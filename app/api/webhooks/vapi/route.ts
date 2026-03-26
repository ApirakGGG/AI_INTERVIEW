import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
// API GGAI
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: GEMINI_KEY });

export async function POST(req: Request) {
  const body = await req.json();

  // เช็คว่าเป็นการจบการโทร (Call End)ป่าว
  if (body.message.type === "end-of-call-report") {
    const { transcript, customer } = body.message;
    const clerkId = customer.id; // ส่งผ่าน Vapi Assistant config

    // กำหนดprompt
    const prompt = `วิเคราะห์การสัมภาษณ์นี้: ${transcript}. 
    ให้คะแนน (1-10) ในด้าน: Logic, Communication, Technical 
    และเขียนคำแนะนำสั้นๆ`;

    // ใช้ Gemini วิเคราะห์script
    const response = await genAI.models.generateContent({
      model: "Gemini 3.1 Pro",
      contents: prompt,
      config: {
       thinkingConfig: {
        includeThoughts: true,
        thinkingLevel: ThinkingLevel.MEDIUM
       }
      },
    });
    console.log(`response: ${response.text}`);
    

    const analysis = JSON.parse(response.text as string)

    // Prisma
    const sendtoDB = await prisma.interview.create({
        data: {
            userId: clerkId,
            position: "Software Engineer",
            level: "Junior",
            transcript: transcript,
            score: analysis.score,
            feedback: analysis.feedback,
            status: "completed",
        }
    })
    return NextResponse.json({success : true , data: sendtoDB})
  }
  return NextResponse.json({ message: "Webhook received" });
}
