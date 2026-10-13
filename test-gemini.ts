import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const transcript = `User: ชื่อกายเคยทำโปรเจกต์ e-commerce เคยเขียน Next.js แล้วก็ React ครับ ยังเรียนอยู่ครับ เพราะว่าเขียน Next.js กับ React เป็นประจำ เลยมาลองสัมภาษณ์ดูก่อนครับ
AI: สวัสดีค่ะ ยินดีที่ได้รู้จักอย่างเป็นทางการนะคะ... 
User: ครับ
AI: ขอบคุณค่ะ แต่ขอให้ช่วยแนะนำตัวสั้นๆ เพิ่มเติมอีกหน่อยนะคะ`;

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

async function run() {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      // เพิ่ม Configuration ด้านล่างนี้เพื่อบังคับ JSON Schema
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
    
    // ด้วยวิธีนี้ response.text จะเป็น JSON string บริสุทธิ์ทันที ไม่ต้องใช้ Regex ค้นหาตัวกรอง {} อีกต่อไป
    const rawText = response.text || "";
    console.log("=== RAW ===");
    console.log(rawText);
    
    console.log("=== PARSING ===");
    const parsed = JSON.parse(rawText);
    console.log("Parsed Successfully!", parsed);
    
  } catch (e) {
    console.error("Error calling Gemini:", e);
  }
}

await run()
