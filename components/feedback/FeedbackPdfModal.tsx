"use client";

import React, { useRef } from "react";
import { X, Printer, Download, Sparkles, CheckCircle2, FileText } from "lucide-react";
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

interface FeedbackPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbacks: FeedbackItem[];
}

export function FeedbackPdfModal({
  isOpen,
  onClose,
  feedbacks,
}: FeedbackPdfModalProps) {
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Aggregates
  const totalCount = feedbacks.length;

  const calculateAvg = (keys: (keyof FeedbackItem)[]) => {
    let sum = 0;
    let count = 0;
    feedbacks.forEach((f) => {
      keys.forEach((k) => {
        const val = f[k];
        if (typeof val === "number") {
          sum += val;
          count++;
        }
      });
    });
    return count > 0 ? (sum / count).toFixed(1) : "0.0";
  };

  const avgUi = calculateAvg([
    "ratingUiEase",
    "ratingUiInterview",
    "ratingUiDashboard",
    "ratingUiHistory",
  ]);

  const avgVoice = calculateAvg([
    "ratingVoiceNatural",
    "ratingVoiceLatency",
    "ratingVoiceStt",
    "ratingVoiceRelevance",
  ]);

  const avgEval = calculateAvg([
    "ratingEvalFairness",
    "ratingEvalInsight",
    "ratingEvalPractical",
    "ratingEvalSpeed",
  ]);

  const avgOverall = calculateAvg([
    "ratingUiEase",
    "ratingUiInterview",
    "ratingUiDashboard",
    "ratingUiHistory",
    "ratingVoiceNatural",
    "ratingVoiceLatency",
    "ratingVoiceStt",
    "ratingVoiceRelevance",
    "ratingEvalFairness",
    "ratingEvalInsight",
    "ratingEvalPractical",
    "ratingEvalSpeed",
  ]);

  const npsList = feedbacks.map((f) => f.npsScore).filter((s): s is number => s !== null);
  const avgNps =
    npsList.length > 0
      ? (npsList.reduce((a, b) => a + b, 0) / npsList.length).toFixed(1)
      : "0.0";

  const confidentUsers = feedbacks.filter(
    (f) => f.confidenceLevel === "เพิ่มขึ้นมาก" || f.confidenceLevel === "เพิ่มขึ้นเล็กน้อย"
  ).length;
  const confidentPercentage =
    totalCount > 0 ? Math.round((confidentUsers / totalCount) * 100) : 0;

  const currentDateStr = new Date().toLocaleString("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const handlePrint = () => {
    if (!printContentRef.current) return;

    const printWindow = window.open("", "_blank", "width=1200,height=850");
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
          <title>รายงานผลแบบสอบถาม AI Voice Interview - ${new Date().toISOString().slice(0, 10)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 16px;
              font-size: 11pt;
              line-height: 1.4;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            @page {
              size: A4 landscape;
              margin: 12mm 10mm;
            }

            .header-banner {
              border-bottom: 2px solid #ea580c;
              padding-bottom: 12px;
              margin-bottom: 16px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .title-area h1 {
              font-size: 18pt;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 4px;
            }

            .title-area p {
              font-size: 9.5pt;
              color: #64748b;
            }

            .meta-box {
              text-align: right;
              font-size: 9pt;
              color: #475569;
            }

            .meta-box strong {
              color: #0f172a;
            }

            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 16px;
            }

            .stat-card {
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 10px;
              background: #f8fafc;
            }

            .stat-label {
              font-size: 8.5pt;
              color: #64748b;
              font-weight: 600;
            }

            .stat-value {
              font-size: 15pt;
              font-weight: 700;
              color: #0f172a;
              margin-top: 2px;
            }

            .categories-box {
              background: #fff7ed;
              border: 1px solid #fed7aa;
              border-radius: 8px;
              padding: 8px 12px;
              margin-bottom: 16px;
              display: flex;
              justify-content: space-around;
              font-size: 9pt;
            }

            .categories-box span {
              font-weight: 600;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9pt;
              margin-bottom: 16px;
            }

            th {
              background-color: #f1f5f9;
              color: #334155;
              font-weight: 600;
              text-align: left;
              padding: 8px 6px;
              border: 1px solid #cbd5e1;
            }

            td {
              padding: 6px 6px;
              border: 1px solid #e2e8f0;
              vertical-align: top;
            }

            tr:nth-child(even) td {
              background-color: #f8fafc;
            }

            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 8pt;
              font-weight: 600;
            }

            .badge-promoter {
              background-color: #d1fae5;
              color: #065f46;
            }

            .badge-passive {
              background-color: #e0f2fe;
              color: #0369a1;
            }

            .badge-detractor {
              background-color: #fef3c7;
              color: #92400e;
            }

            .badge-jd {
              background-color: #ffedd5;
              color: #9a3412;
            }

            .footer-info {
              margin-top: 14px;
              border-top: 1px solid #e2e8f0;
              padding-top: 8px;
              display: flex;
              justify-content: space-between;
              font-size: 8pt;
              color: #94a3b8;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl bg-card rounded-3xl shadow-2xl border border-border flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-heading">
                ส่งออกรายงานแบบสอบถาม (Export PDF Report)
              </h3>
              <p className="text-xs text-muted-foreground">
                พิมพ์หรือบันทึกเป็น PDF รายชื่อและผลการประเมินของผู้ใช้งาน ({feedbacks.length} รายการ)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-accent hover:bg-accent-hover text-white shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="size-4" />
              <span>สั่งพิมพ์ / บันทึกเป็น PDF</span>
            </Button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Container (styled like paper) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950 custom-scrollbar">
          <div className="max-w-4xl mx-auto bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-200">
            {/* Printable Content Section */}
            <div ref={printContentRef}>
              {/* Header Banner */}
              <div className="header-banner">
                <div className="title-area">
                  <h1>รายงานรายชื่อและผลการประเมินของผู้ตอบแบบสอบถาม</h1>
                  <p>AI Voice Interview Platform • Post-Interview Usability & Experience Survey</p>
                </div>
                <div className="meta-box">
                  <div>วันที่จัดทำ: <strong>{currentDateStr}</strong></div>
                  <div>จำนวนข้อมูล: <strong>{totalCount} คน</strong></div>
                  <div>สถานะ: <strong>ข้อมูลสมบูรณ์</strong></div>
                </div>
              </div>

              {/* Summary Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">ผู้ตอบทั้งหมด</div>
                  <div className="stat-value">{totalCount} คน</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">ความพึงพอใจรวม</div>
                  <div className="stat-value">{avgOverall} / 5.0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">คะแนน NPS เฉลี่ย</div>
                  <div className="stat-value">{avgNps} / 10</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">ความมั่นใจเพิ่มขึ้น</div>
                  <div className="stat-value">{confidentPercentage}%</div>
                </div>
              </div>

              {/* Categories Summary */}
              <div className="categories-box">
                <div>🎨 UI / UX เฉลี่ย: <span>{avgUi} / 5.0</span></div>
                <div>🎙️ ระบบเสียง AI เฉลี่ย: <span>{avgVoice} / 5.0</span></div>
                <div>📊 การประเมินผล AI เฉลี่ย: <span>{avgEval} / 5.0</span></div>
              </div>

              {/* Table of Respondents */}
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "35px", textAlign: "center" }}>ลำดับ</th>
                    <th style={{ width: "160px" }}>ชื่อผู้ประเมิน / อีเมล</th>
                    <th style={{ width: "140px" }}>ตำแหน่ง / ระดับ</th>
                    <th style={{ width: "110px" }}>ประสบการณ์</th>
                    <th style={{ width: "65px", textAlign: "center" }}>NPS</th>
                    <th style={{ width: "90px", textAlign: "center" }}>ความมั่นใจ</th>
                    <th style={{ width: "80px", textAlign: "center" }}>คะแนนเฉลี่ย</th>
                    <th>ข้อคิดเห็นและข้อเสนอแนะ</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                        ไม่มีข้อมูลแบบสอบถามในระบบ
                      </td>
                    </tr>
                  ) : (
                    feedbacks.map((item, idx) => {
                      const nps = item.npsScore ?? 0;
                      let npsClass = "badge-detractor";
                      if (nps >= 9) npsClass = "badge-promoter";
                      else if (nps >= 7) npsClass = "badge-passive";

                      // Calculate individual average score
                      const scores = [
                        item.ratingUiEase,
                        item.ratingUiInterview,
                        item.ratingUiDashboard,
                        item.ratingUiHistory,
                        item.ratingVoiceNatural,
                        item.ratingVoiceLatency,
                        item.ratingVoiceStt,
                        item.ratingVoiceRelevance,
                        item.ratingEvalFairness,
                        item.ratingEvalInsight,
                        item.ratingEvalPractical,
                        item.ratingEvalSpeed,
                      ].filter((s): s is number => s !== null);

                      const userAvg =
                        scores.length > 0
                          ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                          : "-";

                      return (
                        <tr key={item.id}>
                          <td style={{ textAlign: "center", fontWeight: 600 }}>{idx + 1}</td>
                          <td>
                            <strong style={{ color: "#0f172a" }}>{item.user?.name || "Anonymous"}</strong>
                            <div style={{ fontSize: "7.5pt", color: "#64748b" }}>
                              {item.user?.email || "—"}
                            </div>
                          </td>
                          <td>
                            <strong>{item.position || "—"}</strong>
                            <div style={{ fontSize: "7.5pt", color: "#64748b" }}>
                              {item.level || "Junior"}
                              {item.hasCustomJd ? " (Custom JD)" : ""}
                            </div>
                          </td>
                          <td style={{ fontSize: "8pt" }}>
                            {item.experienceLevel?.split(" ")[0] || "—"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`badge ${npsClass}`}>
                              {item.npsScore ?? "-"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", fontSize: "8pt" }}>
                            {item.confidenceLevel || "—"}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 700, color: "#16a34a" }}>
                            {userAvg} / 5
                          </td>
                          <td style={{ fontSize: "7.5pt", lineHeight: 1.3 }}>
                            {item.mostLiked && (
                              <div>
                                <span style={{ color: "#ea580c", fontWeight: 600 }}>ชอบ:</span> {item.mostLiked}
                              </div>
                            )}
                            {item.problemsFound && (
                              <div>
                                <span style={{ color: "#dc2626", fontWeight: 600 }}>ปัญหา:</span> {item.problemsFound}
                              </div>
                            )}
                            {item.futureSuggestions && (
                              <div>
                                <span style={{ color: "#0284c7", fontWeight: 600 }}>แนะ:</span> {item.futureSuggestions}
                              </div>
                            )}
                            {!item.mostLiked && !item.problemsFound && !item.futureSuggestions && (
                              <span style={{ color: "#94a3b8" }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Footer */}
              <div className="footer-info">
                <div>AI Voice Interview • รายงานสรุปผลการประเมินและการใช้งานแพลตฟอร์ม</div>
                <div>จัดทำโดยระบบผู้ดูแลระบบ (Admin) • หน้า 1 จาก 1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 border-t border-border bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between shrink-0">
          <span className="text-xs text-muted-foreground">
            💡 เคล็ดลับ: เมื่อหน้าต่างพิมพ์เปิดขึ้น ให้เลือกเครื่องพิมพ์เป็น <strong>"Save as PDF"</strong> หรือ <strong>"บันทึกเป็น PDF"</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer"
            >
              ปิดหน้าต่าง
            </Button>
            <Button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-accent hover:bg-accent-hover text-white shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="size-4" />
              <span>พิมพ์ / บันทึก PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
