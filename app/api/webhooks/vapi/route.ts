import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { GoogleGenAI } from "@google/genai";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: GEMINI_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[VAPI Webhook] Received event type:", body?.message?.type);

    // เช็คว่าเป็นการจบการโทร (end-of-call-report)
    if (body.message.type === "end-of-call-report") {
      const { transcript, customer, startedAt, endedAt } = body.message;

      // รับ callVars ก่อนเพื่อใช้เป็น fallback หา clerkId
      // (web call ไม่มี body.message.customer.id → ต้องอ่านจาก variableValues แทน)
      const callVars =
        body.message?.call?.assistantOverrides?.variableValues ||
        body.message?.call?.variableValues ||
        {};

      const clerkId = customer?.id || callVars?.userId;

      if (!clerkId) {
        console.error(
          "[VAPI Webhook] No userId found in customer or variableValues",
          { customer, callVars },
        );
        return NextResponse.json({ error: "No user id" }, { status: 400 });
      }

      // คำนวณระยะเวลา (วินาที)
      const durationInSeconds = Math.floor(
        (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000,
      );

      // callVars ถูก declare ไปแล้วด้านบน
      const actualPosition = callVars.position || "Software Engineer";
      const actualLevel = callVars.level || "Junior";

      // ค่า default ในกรณีที่ Gemini ล้มเหลว
      let score = 5;
      let feedback = "ไม่สามารถวิเคราะห์ผลได้ในขณะนี้";

      const prompt = `คุณเป็น AI วิเคราะห์การสัมภาษณ์งาน วิเคราะห์บทสนทนาต่อไปนี้แล้วตอบในรูปแบบ JSON เท่านั้น ห้ามมี text อื่น:

บทสนทนา:
${transcript}

ตอบในรูปแบบ JSON นี้เท่านั้น:
{
  "score": <คะแนนรวม 1-10 เป็นตัวเลข>,
  "logic": <คะแนน Logic 1-10 เป็นตัวเลข>,
  "communication": <คะแนน Communication 1-10 เป็นตัวเลข>,
  "technical": <คะแนน Technical 1-10 เป็นตัวเลข>,
  "feedback": "<คำแนะนำสั้นๆ ภาษาไทย>"
}`;

      // ลอง call Gemini สูงสุด 2 ครั้ง (retry เมื่อโดน 429)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await genAI.models.generateContent({
            model: "gemini-1.5-flash", // quota แยกจาก gemini-2.0-flash
            contents: prompt,
          });

          const rawText = response.text || "";
          console.log("[VAPI Webhook] Gemini raw response:", rawText);

          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            score = Number(analysis.score) || 5;
            feedback = analysis.feedback || feedback;
            console.log("[VAPI Webhook] Gemini analysis:", analysis);
          } else {
            console.warn("[VAPI Webhook] Could not extract JSON from Gemini");
          }
          break; // สำเร็จ → ออก loop

        } catch (geminiError: any) {
          const is429 = geminiError?.status === 429;
          console.error(`[VAPI Webhook] Gemini error (attempt ${attempt}):`, is429 ? "429 Rate limited" : geminiError);

          if (is429 && attempt === 1) {
            console.log("[VAPI Webhook] Rate limited, retrying in 10s...");
            await new Promise((r) => setTimeout(r, 10000));
          } else {
            break; // ล้มเหลว → ใช้ default score แล้วไปบันทึก DB ต่อ
          }
        }
      }

      // บันทึกลง DB
      const sendtoDB = await prisma.interview.create({
        data: {
          userId: clerkId,
          position: actualPosition,
          duration: durationInSeconds,
          level: actualLevel,
          transcript: transcript,
          score: score,
          feedback: feedback,
          status: "completed",
        },
      });

      console.log("[VAPI Webhook] Saved to DB, id:", sendtoDB.id);
      return NextResponse.json({ success: true, data: sendtoDB });
    }

    return NextResponse.json({ message: "Webhook received" });
  } catch (error) {
    console.error("[VAPI Webhook] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
