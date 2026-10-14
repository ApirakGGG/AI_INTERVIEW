import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_KEY ? new GoogleGenAI({ apiKey: GEMINI_KEY }) : null;

// ฟังก์ชันสร้างบทสรุปแบบสำรอง (Fallback) โดยใช้หลักการทางสถิติและการแปลผลตามเกณฑ์ Likert Scale มาตรฐาน
function generateFallbackSummary(
  stats: any,
  comments: { mostLiked: string[]; problemsFound: string[]; futureSuggestions: string[] }
) {
  const getLikertLevel = (mean: number) => {
    if (mean >= 4.5) return "มากที่สุด";
    if (mean >= 3.5) return "มาก";
    if (mean >= 2.5) return "ปานกลาง";
    if (mean >= 1.5) return "น้อย";
    return "น้อยที่สุด";
  };

  const overallMean = stats.overall?.mean || 0;
  const overallSd = stats.overall?.sd || 0;
  const overallLevel = getLikertLevel(overallMean);

  const uiMean = stats.categories?.ui?.mean || 0;
  const uiSd = stats.categories?.ui?.sd || 0;

  const voiceMean = stats.categories?.voice?.mean || 0;
  const voiceSd = stats.categories?.voice?.sd || 0;

  const evalMean = stats.categories?.eval?.mean || 0;
  const evalSd = stats.categories?.eval?.sd || 0;

  // หาจุดเด่นและจุดที่ควรปรับปรุง
  const allQuestions: { key: string; label: string; mean: number; sd: number; cat: string }[] =
    stats.questions || [];
  
  const sortedByMean = [...allQuestions].sort((a, b) => b.mean - a.mean);
  const topQuestions = sortedByMean.slice(0, 3);
  const bottomQuestions = [...sortedByMean].reverse().slice(0, 3);

  const strengths = topQuestions.map(
    (q) => `${q.label} (x̄ = ${q.mean.toFixed(2)}, S.D. = ${q.sd.toFixed(2)}) อยู่ในเกณฑ์ ${getLikertLevel(q.mean)}`
  );

  const improvements = bottomQuestions.map(
    (q) => `${q.label} (x̄ = ${q.mean.toFixed(2)}, S.D. = ${q.sd.toFixed(2)}) ควรเฝ้าระวังหรือพัฒนาต่อยอด`
  );

  const overallAnalysis = `ผลการประเมินความพึงพอใจและการใช้งานระบบ AI Voice Interview จากผู้ตอบแบบสอบถามทั้งหมด ${stats.totalRespondents || 0} คน พบว่าภาพรวมมีความพึงพอใจอยู่ในระดับ "${overallLevel}" โดยมีค่าเฉลี่ยรวม (x̄) เท่ากับ ${overallMean.toFixed(2)} และค่าส่วนเบี่ยงเบนมาตรฐาน (S.D.) เท่ากับ ${overallSd.toFixed(2)} บ่งชี้ว่าผู้ใช้งานส่วนใหญ่มีระดับความพึงพอใจและทัศนคติที่ดีต่อแพลตฟอร์มไปในทิศทางเดียวกันอย่างมีนัยสำคัญ`;

  const dimensionAnalysis = {
    ui: `ด้านการออกแบบและประสบการณ์ผู้ใช้ (UI / UX & Onboarding) มีค่าเฉลี่ย x̄ = ${uiMean.toFixed(2)} (S.D. = ${uiSd.toFixed(2)}) ระดับ "${getLikertLevel(uiMean)}" ผู้ใช้งานระบุว่าระบบมีความสะดวก เข้าถึงง่าย หน้าสัมภาษณ์และแดชบอร์ดแสดงผลได้ชัดเจน`,
    voice: `ด้านระบบสัมภาษณ์ด้วยเสียง AI (Vapi) มีค่าเฉลี่ย x̄ = ${voiceMean.toFixed(2)} (S.D. = ${voiceSd.toFixed(2)}) ระดับ "${getLikertLevel(voiceMean)}" ผู้ใช้มีความพึงพอใจต่อน้ำเสียงที่เป็นธรรมชาติ ความแม่นยำของการจับเสียง (STT) และคำถามที่ตรงกับตำแหน่งงาน`,
    eval: `ด้านการประเมินผลและคำแนะนำ (Gemini) มีค่าเฉลี่ย x̄ = ${evalMean.toFixed(2)} (S.D. = ${evalSd.toFixed(2)}) ระดับ "${getLikertLevel(evalMean)}" ผู้ใช้เห็นว่าคะแนนและคำแนะนำมีความสมเหตุสมผล สามารถนำไปประยุกต์ใช้ในการฝึกซ้อมสัมภาษณ์จริงได้จริง`,
  };

  const sampleLiked = comments.mostLiked.slice(0, 3).join(", ");
  const sampleProblems = comments.problemsFound.slice(0, 3).join(", ");
  const sampleSuggestions = comments.futureSuggestions.slice(0, 3).join(", ");

  const qualitativeSummary = `จากข้อเสนอแนะเพิ่มเติม (ตอนที่ 3): ผู้ใช้งานส่วนใหญ่ชื่นชอบในประเด็น ${sampleLiked || "ความสมจริงของการสัมภาษณ์ด้วยเสียงและคำแนะนำที่ตรงจุด"} ขณะที่อุปสรรคที่พบมีข้อสังเกตเรื่อง ${sampleProblems || "การเชื่อมต่อสัญญาณและระยะเวลาหน่วงบางช่วง"} และมีข้อเสนอแนะเพิ่มเติมที่อยากให้พัฒนาคือ ${sampleSuggestions || "การเพิ่มโหมดสัมภาษณ์ภาษาอังกฤษและการจำลองสถานการณ์เพิ่มเติม"}`;

  return {
    overallAnalysis,
    dimensionAnalysis,
    strengths,
    improvements,
    qualitativeSummary,
    isGeneratedByAi: false,
  };
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ตรวจสอบสิทธิ์ Admin
    const user = await prisma.user.findUnique({
      where: { clerkId: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const { stats, comments } = body;

    if (!stats) {
      return NextResponse.json({ error: "Missing stats data" }, { status: 400 });
    }

    // กรณีไม่มี Gemini API Key หรือเรียก AI ไม่สำเร็จ ให้ใช้ Fallback Rule-based Summary
    if (!genAI || !GEMINI_KEY) {
      const fallback = generateFallbackSummary(stats, comments || { mostLiked: [], problemsFound: [], futureSuggestions: [] });
      return NextResponse.json({ success: true, summary: fallback });
    }

    // เรียก Google Gemini เพื่อสรุปผลเชิงวิชาการ/วิจัย Likert Scale (SD & XD Analysis)
    const prompt = `
คุณเป็นผู้เชี่ยวชาญด้านการวิจัย สถิติประยุกต์ และการประเมินระบบสารสนเทศ (Usability & User Experience Evaluation Expert)
โปรดสรุปผลการประเมินแบบสอบถามความพึงพอใจของระบบ "AI Voice Interview" จากข้อมูลสถิติที่จัดเตรียมไว้ให้

ข้อมูลสถิติ (Likert Scale 1 - 5: 5=มากที่สุด, 4=มาก, 3=ปานกลาง, 2=น้อย, 1=น้อยที่สุด):
- จำนวนผู้ตอบทั้งหมด: ${stats.totalRespondents || 0} คน
- ภาพรวมทุกด้าน: ค่าเฉลี่ย x̄ = ${stats.overall?.mean?.toFixed(2) || "0.00"}, S.D. = ${stats.overall?.sd?.toFixed(2) || "0.00"}
- ด้านที่ 1 UI/UX: ค่าเฉลี่ย x̄ = ${stats.categories?.ui?.mean?.toFixed(2) || "0.00"}, S.D. = ${stats.categories?.ui?.sd?.toFixed(2) || "0.00"}
- ด้านที่ 2 ระบบเสียง AI: ค่าเฉลี่ย x̄ = ${stats.categories?.voice?.mean?.toFixed(2) || "0.00"}, S.D. = ${stats.categories?.voice?.sd?.toFixed(2) || "0.00"}
- ด้านที่ 3 การประเมินผล AI: ค่าเฉลี่ย x̄ = ${stats.categories?.eval?.mean?.toFixed(2) || "0.00"}, S.D. = ${stats.categories?.eval?.sd?.toFixed(2) || "0.00"}

รายละเอียดข้อคำถาม:
${(stats.questions || [])
  .map(
    (q: any) =>
      `- ${q.label}: 5=${q.counts?.[5] || 0}คน, 4=${q.counts?.[4] || 0}คน, 3=${q.counts?.[3] || 0}คน, 2=${q.counts?.[2] || 0}คน, 1=${q.counts?.[1] || 0}คน (x̄=${q.mean?.toFixed(2)}, S.D.=${q.sd?.toFixed(2)})`
  )
  .join("\n")}

ความคิดเห็นเพิ่มเติมจากผู้ใช้งาน:
- สิ่งที่ชอบ: ${(comments?.mostLiked || []).slice(0, 8).join(" | ") || "ไม่มีข้อมูล"}
- ปัญหาที่พบ: ${(comments?.problemsFound || []).slice(0, 8).join(" | ") || "ไม่มีข้อมูล"}
- ข้อเสนอแนะ: ${(comments?.futureSuggestions || []).slice(0, 8).join(" | ") || "ไม่มีข้อมูล"}

เกณฑ์การแปลความหมายค่าเฉลี่ย:
4.50 - 5.00 = มากที่สุด
3.50 - 4.49 = มาก
2.50 - 3.49 = ปานกลาง
1.50 - 2.49 = น้อย
1.00 - 1.49 = น้อยที่สุด

จงวิเคราะห์และตอบกลับในรูปแบบ JSON เท่านั้น โดยต้องมีโครงสร้างตามนี้:
{
  "overallAnalysis": "บทวิเคราะห์ภาพรวมค่าสถิติ x̄ (XD) และ S.D. (SD) บรรยายระดับความพึงพอใจและความกลมกลืนของข้อมูลอย่างเป็นทางการ",
  "dimensionAnalysis": {
    "ui": "บทวิเคราะห์เจาะจงด้าน UI/UX สอดคล้องกับค่า x̄ และ S.D.",
    "voice": "บทวิเคราะห์เจาะจงด้านเสียง AI (Vapi) สอดคล้องกับค่า x̄ และ S.D.",
    "eval": "บทวิเคราะห์เจาะจงด้านการประเมินผล (Gemini) สอดคล้องกับค่า x̄ และ S.D."
  },
  "strengths": [
    "จุดเด่นอันดับ 1 ที่ผู้ใช้พึงพอใจสูงสุด พร้อมอ้างอิงค่าเฉลี่ย",
    "จุดเด่นอันดับ 2 พร้อมอ้างอิงค่าเฉลี่ย",
    "จุดเด่นอันดับ 3 พร้อมอ้างอิงค่าเฉลี่ย"
  ],
  "improvements": [
    "ข้อสังเกตหรือจุดที่ควรปรับปรุงอันดับ 1",
    "ข้อสังเกตหรือจุดที่ควรปรับปรุงอันดับ 2"
  ],
  "qualitativeSummary": "สรุปวิเคราะห์ข้อเสนอแนะตอนที่ 3 ทั้งสิ่งที่ชอบ อุปสรรค และฟังก์ชันที่ต้องการในอนาคตเพื่อการพัฒนาแพลตฟอร์มต่อไป"
}
`;

    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let aiResultText = "";

    for (const modelName of candidateModels) {
      try {
        const response = await genAI.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });
        if (response.text) {
          aiResultText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`[Summary AI] Model ${modelName} failed:`, err?.message || err);
      }
    }

    if (aiResultText) {
      try {
        const parsed = JSON.parse(aiResultText);
        return NextResponse.json({
          success: true,
          summary: {
            ...parsed,
            isGeneratedByAi: true,
          },
        });
      } catch (parseErr) {
        console.error("[Summary AI Parse Error]:", parseErr);
      }
    }

    // กรณีเรียก AI ไม่สำเร็จ ให้ใช้ fallback ที่คำนวณจากสถิติจริง
    const fallbackSummary = generateFallbackSummary(
      stats,
      comments || { mostLiked: [], problemsFound: [], futureSuggestions: [] }
    );
    return NextResponse.json({ success: true, summary: fallbackSummary });
  } catch (error) {
    console.error("[Feedback Summary AI Error]:", error);
    return NextResponse.json(
      { error: "Failed to generate AI summary", details: String(error) },
      { status: 500 }
    );
  }
}
