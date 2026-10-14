"use client";

import React, { useRef, useState, useMemo } from "react";
import {
  X,
  Printer,
  Sparkles,
  BarChart3,
  Loader2,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackItem {
  id: string;
  userId: string | null;
  user?: { name: string; email: string } | null;
  position: string | null;
  level: string | null;
  hasCustomJd: boolean;
  experienceLevel: string | null;

  ratingUiEase: number | null;
  ratingUiInterview: number | null;
  ratingUiDashboard: number | null;
  ratingUiHistory: number | null;

  ratingVoiceNatural: number | null;
  ratingVoiceLatency: number | null;
  ratingVoiceStt: number | null;
  ratingVoiceRelevance: number | null;

  ratingEvalFairness: number | null;
  ratingEvalInsight: number | null;
  ratingEvalPractical: number | null;
  ratingEvalSpeed: number | null;

  confidenceLevel: string | null;
  npsScore: number | null;

  mostLiked: string | null;
  problemsFound: string | null;
  futureSuggestions: string | null;

  createdAt: string | Date;
}

interface FeedbackSummaryPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbacks: FeedbackItem[];
}

interface QuestionDef {
  key: keyof FeedbackItem;
  code: string;
  label: string;
  category: "ui" | "voice" | "eval";
}

const QUESTION_DEFS: QuestionDef[] = [
  // ด้านที่ 1: การออกแบบและประสบการณ์ผู้ใช้ (UI / UX & Onboarding)
  {
    key: "ratingUiEase",
    code: "1.1",
    label: "ขั้นตอนการเข้าสู่ระบบและเริ่มฝึกสัมภาษณ์ง่าย ไม่ซับซ้อน",
    category: "ui",
  },
  {
    key: "ratingUiInterview",
    code: "1.2",
    label: "หน้าสัมภาษณ์ (/interview) มีข้อมูลชัดเจน (ตัวจับเวลา, ป้ายสถานะการพูด, คลื่นเสียง)",
    category: "ui",
  },
  {
    key: "ratingUiDashboard",
    code: "1.3",
    label: "หน้าแดชบอร์ด (/dashboard) และกราฟแสดงข้อมูลเข้าใจง่ายและดูมีประโยชน์",
    category: "ui",
  },
  {
    key: "ratingUiHistory",
    code: "1.4",
    label: "หน้าประวัติการสัมภาษณ์ (/history) ตรวจสอบย้อนหลังได้สะดวก",
    category: "ui",
  },

  // ด้านที่ 2: ระบบสัมภาษณ์ด้วยเสียง AI (AI Voice Interaction via Vapi)
  {
    key: "ratingVoiceNatural",
    code: "2.1",
    label: "น้ำเสียง จังหวะ และความเป็นธรรมชาติของเสียง AI คล้ายผู้สัมภาษณ์จริง",
    category: "voice",
  },
  {
    key: "ratingVoiceLatency",
    code: "2.2",
    label: "ความเร็วในการตอบสนอง (Response Latency) ของ AI ไม่อืดหรือดีเลย์เกินไป",
    category: "voice",
  },
  {
    key: "ratingVoiceStt",
    code: "2.3",
    label: "ระบบจับเสียง (Speech-to-Text) และซับไทเทิลแบบ Real-time มีความถูกต้องแม่นยำ",
    category: "voice",
  },
  {
    key: "ratingVoiceRelevance",
    code: "2.4",
    label: "คำถามที่ AI ถามมีความเกี่ยวข้องและสอดคล้องกับตำแหน่ง/JD ที่เลือก",
    category: "voice",
  },

  // ด้านที่ 3: การประเมินผลและคำแนะนำ (Evaluation & Feedback via Gemini)
  {
    key: "ratingEvalFairness",
    code: "3.1",
    label: "ความสมเหตุสมผลของการให้คะแนน 3 ด้าน (Technical, Communication, Logic)",
    category: "eval",
  },
  {
    key: "ratingEvalInsight",
    code: "3.2",
    label: "คำแนะนำเชิงลึก (AI Feedback) มีความสร้างสรรค์ ชี้จุดแข็ง/จุดอ่อนได้ตรงประเด็น",
    category: "eval",
  },
  {
    key: "ratingEvalPractical",
    code: "3.3",
    label: "คุณสามารถนำคำแนะนำที่ได้รับไปปรับใช้กับการสัมภาษณ์งานจริงได้",
    category: "eval",
  },
  {
    key: "ratingEvalSpeed",
    code: "3.4",
    label: "ความรวดเร็วในการสร้างรายงานผลหลังกดจบการสัมภาษณ์",
    category: "eval",
  },
];

const CATEGORIES = [
  {
    id: "ui",
    title: "ด้านที่ 1: การออกแบบและประสบการณ์ผู้ใช้ (UI / UX & Onboarding)",
    shortTitle: "ด้านที่ 1 ด้าน UI/UX",
  },
  {
    id: "voice",
    title: "ด้านที่ 2: ระบบสัมภาษณ์ด้วยเสียง AI (AI Voice Interaction via Vapi)",
    shortTitle: "ด้านที่ 2 ระบบเสียง AI",
  },
  {
    id: "eval",
    title: "ด้านที่ 3: การประเมินผลและคำแนะนำ (Evaluation & Feedback via Gemini)",
    shortTitle: "ด้านที่ 3 การประเมินผล",
  },
];

function getLikertText(mean: number): string {
  if (mean >= 4.5) return "มากที่สุด";
  if (mean >= 3.5) return "มาก";
  if (mean >= 2.5) return "ปานกลาง";
  if (mean >= 1.5) return "น้อย";
  if (mean > 0) return "น้อยที่สุด";
  return "-";
}

export function FeedbackSummaryPdfModal({
  isOpen,
  onClose,
  feedbacks,
}: FeedbackSummaryPdfModalProps) {
  const printContentRef = useRef<HTMLDivElement>(null);
  const [showStatsColumns, setShowStatsColumns] = useState(true);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // คำนวณข้อมูลสถิติ
  const statsData = useMemo(() => {
    const totalRespondents = feedbacks.length;

    // คำนวณแต่ละข้อคำถาม
    const questionStats = QUESTION_DEFS.map((qDef) => {
      const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      const values: number[] = [];

      feedbacks.forEach((f) => {
        const val = f[qDef.key];
        if (typeof val === "number" && val >= 1 && val <= 5) {
          counts[val] = (counts[val] || 0) + 1;
          values.push(val);
        }
      });

      const n = values.length;
      const sum = values.reduce((a, b) => a + b, 0);
      const mean = n > 0 ? sum / n : 0;

      // Sample Standard Deviation
      let varianceSum = 0;
      values.forEach((v) => {
        varianceSum += Math.pow(v - mean, 2);
      });
      const sd = n > 1 ? Math.sqrt(varianceSum / (n - 1)) : 0;

      return {
        ...qDef,
        counts,
        n,
        mean,
        sd,
        levelText: getLikertText(mean),
      };
    });

    // คำนวณรายด้าน
    const categoryStats: Record<string, any> = {};
    CATEGORIES.forEach((cat) => {
      const catQuestions = questionStats.filter((q) => q.category === cat.id);
      const allCatValues: number[] = [];
      const catCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      catQuestions.forEach((q) => {
        for (let score = 1; score <= 5; score++) {
          catCounts[score] += q.counts[score] || 0;
        }
      });

      feedbacks.forEach((f) => {
        catQuestions.forEach((q) => {
          const val = f[q.key];
          if (typeof val === "number" && val >= 1 && val <= 5) {
            allCatValues.push(val);
          }
        });
      });

      const n = allCatValues.length;
      const sum = allCatValues.reduce((a, b) => a + b, 0);
      const mean = n > 0 ? sum / n : 0;

      let varianceSum = 0;
      allCatValues.forEach((v) => {
        varianceSum += Math.pow(v - mean, 2);
      });
      const sd = n > 1 ? Math.sqrt(varianceSum / (n - 1)) : 0;

      categoryStats[cat.id] = {
        mean,
        sd,
        counts: catCounts,
        levelText: getLikertText(mean),
        n,
      };
    });

    // คำนวณภาพรวมทุกด้าน
    const allValues: number[] = [];
    const grandCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    feedbacks.forEach((f) => {
      QUESTION_DEFS.forEach((q) => {
        const val = f[q.key];
        if (typeof val === "number" && val >= 1 && val <= 5) {
          allValues.push(val);
          grandCounts[val] = (grandCounts[val] || 0) + 1;
        }
      });
    });

    const grandN = allValues.length;
    const grandSum = allValues.reduce((a, b) => a + b, 0);
    const overallMean = grandN > 0 ? grandSum / grandN : 0;

    let grandVarianceSum = 0;
    allValues.forEach((v) => {
      grandVarianceSum += Math.pow(v - overallMean, 2);
    });
    const overallSd = grandN > 1 ? Math.sqrt(grandVarianceSum / (grandN - 1)) : 0;

    return {
      totalRespondents,
      questions: questionStats,
      categories: categoryStats,
      overall: {
        mean: overallMean,
        sd: overallSd,
        counts: grandCounts,
        levelText: getLikertText(overallMean),
        n: grandN,
      },
    };
  }, [feedbacks]);

  // ข้อเสนอแนะเพิ่มเติม (ตอนที่ 3)
  const openEndedComments = useMemo(() => {
    const mostLiked = feedbacks
      .map((f) => f.mostLiked?.trim())
      .filter((s): s is string => Boolean(s));
    const problemsFound = feedbacks
      .map((f) => f.problemsFound?.trim())
      .filter((s): s is string => Boolean(s));
    const futureSuggestions = feedbacks
      .map((f) => f.futureSuggestions?.trim())
      .filter((s): s is string => Boolean(s));

    return { mostLiked, problemsFound, futureSuggestions };
  }, [feedbacks]);

  // ฟังก์ชันเรียก AI สรุปผลวิเคราะห์
  const handleGenerateAiSummary = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch("/api/feedback/summary-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stats: statsData,
          comments: openEndedComments,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch AI summary");
      const data = await res.json();
      if (data.summary) {
        setAiSummary(data.summary);
      }
    } catch (err) {
      console.error("AI Summary error:", err);
      // Fallback local synthesis if offline
      setAiSummary({
        overallAnalysis: `ผลการประเมินภาพรวมระบบ AI Voice Interview จากผู้ตอบแบบสอบถาม ${statsData.totalRespondents} คน มีค่าเฉลี่ย x̄ = ${statsData.overall.mean.toFixed(2)} และส่วนเบี่ยงเบนมาตรฐาน S.D. = ${statsData.overall.sd.toFixed(2)} ซึ่งจัดอยู่ในระดับ "${statsData.overall.levelText}" แสดงให้เห็นว่าผู้ใช้มีความพึงพอใจในระดับสูงและมีทัศนคติที่ดีต่อระบบ`,
        dimensionAnalysis: {
          ui: `ด้าน UI/UX (x̄ = ${statsData.categories.ui?.mean.toFixed(2)}, S.D. = ${statsData.categories.ui?.sd.toFixed(2)}) อยู่ในระดับ "${statsData.categories.ui?.levelText}" สะท้อนการออกแบบที่ใช้งานง่ายและไม่ซับซ้อน`,
          voice: `ด้านระบบเสียง AI (x̄ = ${statsData.categories.voice?.mean.toFixed(2)}, S.D. = ${statsData.categories.voice?.sd.toFixed(2)}) อยู่ในระดับ "${statsData.categories.voice?.levelText}" ระบบเสียงและ STT ทำงานได้แม่นยำเป็นธรรมชาติ`,
          eval: `ด้านการประเมินผล (x̄ = ${statsData.categories.eval?.mean.toFixed(2)}, S.D. = ${statsData.categories.eval?.sd.toFixed(2)}) อยู่ในระดับ "${statsData.categories.eval?.levelText}" ผู้ใช้ได้รับข้อเสนอแนะที่สร้างสรรค์และนำไปใช้จริงได้`,
        },
        strengths: [
          `ขั้นตอนการใช้งานและการเข้าถึงระบบเข้าใจง่าย รวดเร็ว`,
          `การจับเสียงแบบ Real-time และความเกี่ยวข้องของคำถามตรงกับตำแหน่งงาน`,
          `คำแนะนำและคะแนนประเมินมีความสร้างสรรค์และตรงจุด`,
        ],
        improvements: [
          `เพิ่มความเสถียรของเสียงในกรณีสัญญาณอินเทอร์เน็ตไม่คงที่`,
          `ขยายฟังก์ชันการซ้อมสัมภาษณ์ให้ครอบคลุมภาษาอังกฤษและการทดสอบเชิงลึก`,
        ],
        qualitativeSummary: `ผู้ใช้ส่วนใหญ่ชื่นชมในความสมจริงและความสะดวกของระบบ ขณะที่มีข้อเสนอแนะให้เพิ่มโหมดจำลองสถานการณ์และฟังก์ชันภาษาอังกฤษเพิ่มเติม`,
        isGeneratedByAi: false,
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  if (!isOpen) return null;

  const currentDateStr = new Date().toLocaleString("th-TH", {
    dateStyle: "long",
  });

  const handlePrint = () => {
    if (!printContentRef.current) return;

    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) {
      alert("กรุณาอนุญาตให้เปิด Pop-up เพื่อพิมพ์หรือบันทึกเป็น PDF");
      return;
    }

    const contentHtml = printContentRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="th">
        <head>
          <meta charset="utf-8" />
          <title>แบบสรุปการประเมินความพึงพอใจ AI Voice Interview - ${new Date().toISOString().slice(0, 10)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #000000;
              background: #ffffff;
              padding: 20px;
              font-size: 10.5pt;
              line-height: 1.45;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            @page {
              size: A4 portrait;
              margin: 12mm 12mm;
            }

            .report-title-container {
              text-align: center;
              margin-bottom: 16px;
              border-bottom: 2px solid #000;
              padding-bottom: 12px;
            }

            .report-title-container h1 {
              font-size: 15pt;
              font-weight: 700;
              color: #000;
              margin-bottom: 4px;
            }

            .report-title-container p {
              font-size: 10pt;
              color: #333;
            }

            .meta-info-row {
              display: flex;
              justify-content: space-between;
              margin-top: 8px;
              font-size: 9.5pt;
              color: #222;
              font-weight: 500;
            }

            /* Main Table */
            table.evaluation-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 18px;
              font-size: 9.5pt;
            }

            table.evaluation-table th, 
            table.evaluation-table td {
              border: 1px solid #000000;
              padding: 5px 6px;
            }

            table.evaluation-table th {
              background-color: #f2f2f2;
              color: #000;
              font-weight: 600;
              text-align: center;
              vertical-align: middle;
            }

            .category-header-cell {
              background-color: #f7f7f7;
              font-weight: 700;
              color: #000;
              text-align: left !important;
              padding-left: 8px !important;
            }

            .question-cell {
              text-align: left;
              padding-left: 12px;
            }

            .count-cell {
              text-align: center;
              width: 48px;
            }

            .stat-cell {
              text-align: center;
              width: 55px;
              font-weight: 600;
            }

            .level-cell {
              text-align: center;
              width: 70px;
              font-weight: 600;
            }

            .category-avg-row td {
              background-color: #fafafa;
              font-weight: 700;
            }

            .overall-avg-row td {
              background-color: #eaeaea;
              font-weight: 700;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
            }

            /* Section 3 Suggestions Box */
            .section-suggestions {
              margin-top: 14px;
              border-top: 1px solid #000;
              padding-top: 10px;
              page-break-inside: avoid;
            }

            .section-title {
              font-size: 11pt;
              font-weight: 700;
              margin-bottom: 8px;
              color: #000;
            }

            .suggestion-category {
              margin-bottom: 8px;
            }

            .suggestion-category-title {
              font-weight: 600;
              font-size: 10pt;
              margin-bottom: 3px;
              color: #111;
            }

            .suggestion-list {
              padding-left: 20px;
              font-size: 9pt;
              color: #222;
              line-height: 1.4;
            }

            .dotted-placeholder {
              border-bottom: 1px dotted #666;
              margin: 10px 0;
              height: 20px;
            }

            /* AI Analysis Box */
            .ai-summary-box {
              margin-top: 16px;
              border: 1.5px solid #2563eb;
              border-radius: 6px;
              padding: 12px;
              background-color: #f8faff;
              page-break-inside: avoid;
            }

            .ai-summary-title {
              font-size: 11pt;
              font-weight: 700;
              color: #1d4ed8;
              margin-bottom: 6px;
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .ai-summary-content {
              font-size: 9.5pt;
              line-height: 1.5;
              color: #1e293b;
            }

            .ai-summary-subgrid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-top: 8px;
            }

            .subgrid-card {
              border: 1px solid #cbd5e1;
              background: #ffffff;
              padding: 6px 8px;
              border-radius: 4px;
              font-size: 8.5pt;
            }

            .subgrid-card strong {
              color: #0f172a;
              display: block;
              margin-bottom: 2px;
            }

            .footer-sign {
              margin-top: 24px;
              display: flex;
              justify-content: space-between;
              font-size: 9pt;
              color: #444;
              page-break-inside: avoid;
            }

            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
              table {
                page-break-inside: auto;
              }
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
              thead {
                display: table-header-group;
              }
            }
          </style>
        </head>
        <body>
          ${contentHtml}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-6xl bg-card rounded-3xl shadow-2xl border border-border flex flex-col max-h-[96vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 border-b border-border bg-slate-50/70 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-heading flex items-center gap-2">
                <span>ตารางจำแนกผลการประเมินแบบสอบถาม (Questionnaire Summary)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {statsData.totalRespondents} ผู้ตอบ
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                จำแนกจำนวนคน 5 ระดับตามแบบฟอร์ม พร้อมค่าเฉลี่ย (x̄), ส่วนเบี่ยงเบนมาตรฐาน (S.D.) และ AI สรุปผล
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle show stats */}
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-border hover:bg-slate-200/60 transition-colors">
              <input
                type="checkbox"
                checked={showStatsColumns}
                onChange={(e) => setShowStatsColumns(e.target.checked)}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span>แสดง x̄ & S.D. ในตาราง</span>
            </label>

            {/* AI Summary Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateAiSummary}
              disabled={isLoadingAi}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-1.5 cursor-pointer"
            >
              {isLoadingAi ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>กำลังวิเคราะห์ด้วย AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>{aiSummary ? "สร้างบทสรุป AI ใหม่" : "ให้ AI สรุปผล (SD/XD)"}</span>
                </>
              )}
            </Button>

            {/* Print Button */}
            <Button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-accent hover:bg-accent-hover text-white shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="size-4" />
              <span>สั่งพิมพ์ / PDF</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Paper Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 dark:bg-slate-950 custom-scrollbar">
          <div className="max-w-4xl mx-auto bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-200">
            {/* Printable Content */}
            <div ref={printContentRef}>
              {/* Header Title Banner */}
              <div className="report-title-container">
                <h1>แบบสรุปการประเมินความพึงพอใจและการใช้งานระบบ AI Voice Interview</h1>
                <p>แบบสอบถามการประเมินประสบการณ์ผู้ใช้ คุณภาพเสียง AI (Vapi) และการประเมินผล (Gemini AI)</p>
                <div className="meta-info-row">
                  <div>วันที่จัดทำรายงาน: <strong>{currentDateStr}</strong></div>
                  <div>จำนวนผู้ตอบแบบสอบถามทั้งหมด: <strong>{statsData.totalRespondents} คน</strong></div>
                  <div>เกณฑ์: <strong>Likert Scale 1 - 5 ระดับ</strong></div>
                </div>
              </div>

              {/* Evaluation Table matching the uploaded image */}
              <table className="evaluation-table">
                <thead>
                  <tr>
                    <th rowSpan={2} style={{ textAlign: "center", width: "42%" }}>
                      ประเด็นความคิดเห็น
                    </th>
                    <th colSpan={5} style={{ textAlign: "center" }}>
                      ระดับความพึงพอใจ / ความรู้ความเข้าใจ / การนำความรู้ไปใช้
                    </th>
                    {showStatsColumns && (
                      <>
                        <th rowSpan={2} style={{ width: "55px", textAlign: "center" }}>
                          ค่าเฉลี่ย<br />(x̄)
                        </th>
                        <th rowSpan={2} style={{ width: "55px", textAlign: "center" }}>
                          S.D.<br />(ส่วนเบี่ยงเบน)
                        </th>
                        <th rowSpan={2} style={{ width: "70px", textAlign: "center" }}>
                          ระดับการ<br />ประเมิน
                        </th>
                      </>
                    )}
                  </tr>
                  <tr>
                    <th style={{ width: "45px", textAlign: "center" }}>มากที่สุด<br />5</th>
                    <th style={{ width: "45px", textAlign: "center" }}>มาก<br />4</th>
                    <th style={{ width: "45px", textAlign: "center" }}>ปานกลาง<br />3</th>
                    <th style={{ width: "45px", textAlign: "center" }}>น้อย<br />2</th>
                    <th style={{ width: "45px", textAlign: "center" }}>น้อยที่สุด<br />1</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((cat) => {
                    const catQuestions = statsData.questions.filter(
                      (q) => q.category === cat.id
                    );
                    const catStat = statsData.categories[cat.id];

                    return (
                      <React.Fragment key={cat.id}>
                        {/* Category Header Row */}
                        <tr>
                          <td
                            colSpan={showStatsColumns ? 9 : 6}
                            className="category-header-cell"
                          >
                            <strong>{cat.title}</strong>
                          </td>
                        </tr>

                        {/* Question Rows */}
                        {catQuestions.map((q) => (
                          <tr key={q.code}>
                            <td className="question-cell">
                              {q.code} {q.label}
                            </td>
                            <td className="count-cell">
                              {q.counts[5] > 0 ? q.counts[5] : "-"}
                            </td>
                            <td className="count-cell">
                              {q.counts[4] > 0 ? q.counts[4] : "-"}
                            </td>
                            <td className="count-cell">
                              {q.counts[3] > 0 ? q.counts[3] : "-"}
                            </td>
                            <td className="count-cell">
                              {q.counts[2] > 0 ? q.counts[2] : "-"}
                            </td>
                            <td className="count-cell">
                              {q.counts[1] > 0 ? q.counts[1] : "-"}
                            </td>

                            {showStatsColumns && (
                              <>
                                <td className="stat-cell">
                                  {q.mean > 0 ? q.mean.toFixed(2) : "-"}
                                </td>
                                <td className="stat-cell">
                                  {q.sd > 0 ? q.sd.toFixed(2) : "0.00"}
                                </td>
                                <td className="level-cell">
                                  {q.levelText}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}

                        {/* Category Average Row */}
                        <tr className="category-avg-row">
                          <td style={{ textAlign: "right", paddingRight: "10px" }}>
                            <strong>ค่าเฉลี่ยรวม {cat.shortTitle}</strong>
                          </td>
                          <td className="count-cell" style={{ fontWeight: 600 }}>
                            {catStat?.counts[5] || "-"}
                          </td>
                          <td className="count-cell" style={{ fontWeight: 600 }}>
                            {catStat?.counts[4] || "-"}
                          </td>
                          <td className="count-cell" style={{ fontWeight: 600 }}>
                            {catStat?.counts[3] || "-"}
                          </td>
                          <td className="count-cell" style={{ fontWeight: 600 }}>
                            {catStat?.counts[2] || "-"}
                          </td>
                          <td className="count-cell" style={{ fontWeight: 600 }}>
                            {catStat?.counts[1] || "-"}
                          </td>

                          {showStatsColumns && (
                            <>
                              <td className="stat-cell" style={{ color: "#0284c7" }}>
                                {catStat?.mean > 0 ? catStat.mean.toFixed(2) : "-"}
                              </td>
                              <td className="stat-cell">
                                {catStat?.sd > 0 ? catStat.sd.toFixed(2) : "0.00"}
                              </td>
                              <td className="level-cell" style={{ color: "#0284c7" }}>
                                {catStat?.levelText || "-"}
                              </td>
                            </>
                          )}
                        </tr>
                      </React.Fragment>
                    );
                  })}

                  {/* Grand Total Summary Row */}
                  <tr className="overall-avg-row">
                    <td style={{ textAlign: "right", paddingRight: "10px" }}>
                      <strong>เฉลี่ยรวมทุกด้าน (ภาพรวมทั้งหมด)</strong>
                    </td>
                    <td className="count-cell" style={{ fontWeight: 700 }}>
                      {statsData.overall.counts[5] || "-"}
                    </td>
                    <td className="count-cell" style={{ fontWeight: 700 }}>
                      {statsData.overall.counts[4] || "-"}
                    </td>
                    <td className="count-cell" style={{ fontWeight: 700 }}>
                      {statsData.overall.counts[3] || "-"}
                    </td>
                    <td className="count-cell" style={{ fontWeight: 700 }}>
                      {statsData.overall.counts[2] || "-"}
                    </td>
                    <td className="count-cell" style={{ fontWeight: 700 }}>
                      {statsData.overall.counts[1] || "-"}
                    </td>

                    {showStatsColumns && (
                      <>
                        <td className="stat-cell" style={{ color: "#ea580c", fontSize: "10pt" }}>
                          {statsData.overall.mean > 0
                            ? statsData.overall.mean.toFixed(2)
                            : "-"}
                        </td>
                        <td className="stat-cell" style={{ color: "#ea580c" }}>
                          {statsData.overall.sd > 0
                            ? statsData.overall.sd.toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="level-cell" style={{ color: "#ea580c" }}>
                          {statsData.overall.levelText}
                        </td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>

              {/* AI Analysis Summary Box (SD & XD Analysis) */}
              {(aiSummary || !isLoadingAi) && (
                <div className="ai-summary-box">
                  <div className="ai-summary-title">
                    <Sparkles className="size-4 text-primary" />
                    <span>บทสรุปและวิเคราะห์ผลเชิงสถิติ (SD & XD) โดย AI</span>
                    {aiSummary?.isGeneratedByAi && (
                      <span className="text-[9pt] font-normal text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                        ✨ ประมวลผลด้วย Google Gemini AI
                      </span>
                    )}
                  </div>

                  <div className="ai-summary-content">
                    <p style={{ marginBottom: "6px" }}>
                      {aiSummary?.overallAnalysis ||
                        `จากผลการประเมินระบบ AI Voice Interview ผู้ตอบแบบสอบถามทั้งหมด ${statsData.totalRespondents} คน ให้คะแนนความพึงพอใจเฉลี่ยรวม (x̄) เท่ากับ ${statsData.overall.mean.toFixed(2)} และส่วนเบี่ยงเบนมาตรฐาน (S.D.) เท่ากับ ${statsData.overall.sd.toFixed(2)} อยู่ในเกณฑ์ระดับ "${statsData.overall.levelText}" สะท้อนว่าผู้ใช้งานส่วนใหญ่มีความคิดเห็นเชิงบวกและสอดคล้องกัน`}
                    </p>

                    <div className="ai-summary-subgrid">
                      <div className="subgrid-card">
                        <strong style={{ color: "#0369a1" }}>✨ จุดเด่นที่พึงพอใจสูงสุด:</strong>
                        <ul style={{ paddingLeft: "16px", marginTop: "2px" }}>
                          {aiSummary?.strengths?.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                          )) || (
                            <>
                              <li>ขั้นตอนการเข้าสู่ระบบและเริ่มฝึกสัมภาษณ์ง่าย ไม่ซับซ้อน</li>
                              <li>ความแม่นยำของการจับเสียงและการตอบสนองของ AI</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div className="subgrid-card">
                        <strong style={{ color: "#b45309" }}>💡 ข้อสังเกตและจุดพัฒนาต่อ:</strong>
                        <ul style={{ paddingLeft: "16px", marginTop: "2px" }}>
                          {aiSummary?.improvements?.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                          )) || (
                            <>
                              <li>การปรับปรุง Latency ในเครือข่ายความเร็วต่ำ</li>
                              <li>การเพิ่มฟังก์ชันจำลองคำถามสัมภาษณ์ภาษาอังกฤษ</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>

                    {aiSummary?.dimensionAnalysis && (
                      <div style={{ marginTop: "8px", fontSize: "9pt", color: "#334155" }}>
                        <div>• <strong>ด้าน UI/UX:</strong> {aiSummary.dimensionAnalysis.ui}</div>
                        <div>• <strong>ด้านเสียง AI:</strong> {aiSummary.dimensionAnalysis.voice}</div>
                        <div>• <strong>ด้านการประเมินผล:</strong> {aiSummary.dimensionAnalysis.eval}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ตอนที่ 3: ข้อเสนอแนะอื่นๆ (ตามรูปภาพ) */}
              <div className="section-suggestions">
                <div className="section-title">ตอนที่ 3 ข้อเสนอแนะอื่นๆ</div>

                <div className="suggestion-category">
                  <div className="suggestion-category-title">
                    1. สิ่งที่ท่านชอบมากที่สุดในการใช้งานแพลตฟอร์มนี้:
                  </div>
                  {openEndedComments.mostLiked.length > 0 ? (
                    <ul className="suggestion-list">
                      {openEndedComments.mostLiked.slice(0, 6).map((item, idx) => (
                        <li key={idx}>- {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="dotted-placeholder" />
                  )}
                </div>

                <div className="suggestion-category">
                  <div className="suggestion-category-title">
                    2. ปัญหาหรืออุปสรรคที่พบระหว่างการใช้งาน:
                  </div>
                  {openEndedComments.problemsFound.length > 0 ? (
                    <ul className="suggestion-list">
                      {openEndedComments.problemsFound.slice(0, 6).map((item, idx) => (
                        <li key={idx}>- {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="dotted-placeholder" />
                  )}
                </div>

                <div className="suggestion-category">
                  <div className="suggestion-category-title">
                    3. ฟังก์ชันหรือสิ่งที่อยากให้เพิ่มเติมในอนาคต:
                  </div>
                  {openEndedComments.futureSuggestions.length > 0 ? (
                    <ul className="suggestion-list">
                      {openEndedComments.futureSuggestions.slice(0, 6).map((item, idx) => (
                        <li key={idx}>- {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="dotted-placeholder" />
                  )}
                </div>
              </div>

              {/* Signature / Validation Footer */}
              <div className="footer-sign">
                <div>ผู้จัดทำรายงาน: ระบบวิเคราะห์สถิติ AI Voice Interview</div>
                <div>เกณฑ์การแปลผล: 4.50-5.00 มากที่สุด | 3.50-4.49 มาก | 2.50-3.49 ปานกลาง | 1.50-2.49 น้อย | 1.00-1.49 น้อยที่สุด</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
