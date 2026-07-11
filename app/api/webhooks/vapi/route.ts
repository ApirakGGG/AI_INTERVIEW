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

      // ค่า default ถ้า Gemini คิดผิด
      let techScore = 10;
      let commScore = 10;
      let logicScore = 10;
      let averageScore = 10;
      let feedback = "ไม่สามารถวิเคราะห์ผลได้ในขณะนี้"; //default

      const prompt = `คุณเป็น AI วิเคราะห์การสัมภาษณ์งาน วิเคราะห์บทสนทนาต่อไปนี้แล้วตอบในรูปแบบ JSON เท่านั้น ห้ามมี text อื่นนอกเหนือจาก JSON:
ข้อควรระวัง: ห้ามใช้การขึ้นบรรทัดใหม่ (Newline) จริงๆ ในข้อความ String ของ JSON เด็ดขาด ให้ใช้สัญลักษณ์ \\n แทนถ้าต้องการขึ้นบรรทัดใหม่

บทสนทนา:
${transcript}

ตอบในรูปแบบ JSON นี้เท่านั้น:
{
  "score": <คะแนนรวม 1-10 เป็นตัวเลข>,
  "logic": <คะแนน Logic 1-10 เป็นตัวเลข>,
  "communication": <คะแนน Communication 1-10 เป็นตัวเลข>,
  "technical": <คะแนน Technical 1-10 เป็นตัวเลข>,
  "feedback": "<คำติชมและคำแนะนำที่กระชับ ตรงประเด็น แบ่งเป็นข้อๆ (เช่น 1... 2...) ภาษาไทย>"
}`;

      // ลอง call Gemini สูงสุด 2 ครั้ง retry ถ้าโดน 429
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await genAI.models.generateContent({
            model: "gemini-3.1-flash-lite", 
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  score: { type: "INTEGER" },
                  logic: { type: "INTEGER" },
                  communication: { type: "INTEGER" },
                  technical: { type: "INTEGER" },
                  feedback: { type: "STRING" }
                },
                required: ["score", "logic", "communication", "technical", "feedback"]
              }
            }
          });

          const rawText = response.text || "";
          console.log("[VAPI Webhook] Gemini raw response:", rawText);

          const jsonMatch = rawText.match(/\{[\s\S]*\}/); //validate text
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);

            // แปลงคะแนนระดับ 1-10 เป็นเปอร์เซ็นต์ (คูณ 10) ตามรูปแบบการแสดงผลของ Dashboard
            techScore = (Number(analysis.technical) || 5) * 10;
            commScore = (Number(analysis.communication) || 5) * 10;
            logicScore = (Number(analysis.logic) || 5) * 10;
            averageScore = (Number(analysis.score) || 5) * 10;

            feedback = analysis.feedback || feedback;
            console.log("[VAPI Webhook] Gemini analysis:", analysis);
          } else {
            console.warn("[VAPI Webhook] Could not extract JSON from Gemini");
          }
          break; // สำเร็จออก loop
        } catch (geminiError: any) {
          const is429 = geminiError?.status === 429;
          console.error(
            `[VAPI Webhook] Gemini error (attempt ${attempt}):`,
            is429 ? "429 Rate limited" : geminiError,
          );

          if (is429 && attempt === 1) {
            console.log("[VAPI Webhook] Rate limited, retrying in 10s...");
            await new Promise((r) => setTimeout(r, 10000));
          } else {
            break; // ล้มเหลว ใช้ default score แล้วไปบันทึก DB ต่อ
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
          score: {
            Technical: techScore,
            Communication: commScore,
            Logic: logicScore,
            fillerLevel: "Low", // ค่าเริ่มต้นระดับความถี่การพูดคำสร้อย
          },
          averageScore: averageScore,
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
