"use client";

import React, { useState } from "react";
import {
  MessageSquareHeart,
  Star,
  Users,
  Award,
  Search,
  Eye,
  Sliders,
  TrendingUp,
  MessageSquare,
  Printer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackDetailModal } from "./FeedbackDetailModal";
import { FeedbackPdfModal } from "@/components/feedback/FeedbackPdfModal";

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

interface FeedbackListViewProps {
  feedbacks: FeedbackItem[];
}

export function FeedbackListView({ feedbacks }: FeedbackListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((f) => {
    const term = searchTerm.toLowerCase();
    const userName = f.user?.name?.toLowerCase() || "";
    const userEmail = f.user?.email?.toLowerCase() || "";
    const pos = f.position?.toLowerCase() || "";
    const exp = f.experienceLevel?.toLowerCase() || "";
    return (
      userName.includes(term) ||
      userEmail.includes(term) ||
      pos.includes(term) ||
      exp.includes(term)
    );
  });

  // Calculate Aggregates
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

  // Overall average
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

  // Average NPS
  const npsList = feedbacks.map((f) => f.npsScore).filter((s): s is number => s !== null);
  const avgNps =
    npsList.length > 0
      ? (npsList.reduce((a, b) => a + b, 0) / npsList.length).toFixed(1)
      : "0.0";

  // Confident count
  const confidentUsers = feedbacks.filter(
    (f) => f.confidenceLevel === "เพิ่มขึ้นมาก" || f.confidenceLevel === "เพิ่มขึ้นเล็กน้อย"
  ).length;
  const confidentPercentage =
    totalCount > 0 ? Math.round((confidentUsers / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold cn-font-heading text-heading">
            ผลการประเมินและแบบสอบถามความพึงพอใจ
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            รวบรวมข้อเสนอแนะ ประสบการณ์ผู้ใช้ คุณภาพเสียง AI และความแม่นยำในการวิเคราะห์
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPdfModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Printer className="size-4" />
          <span>ส่งออกรายงาน PDF</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Feedback */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              จำนวนผู้ตอบแบบสอบถาม
            </CardTitle>
            <MessageSquareHeart className="size-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">{totalCount} ชุด</div>
            <p className="text-xs text-muted-foreground mt-1">ทั้งหมดที่บันทึกในระบบ</p>
          </CardContent>
        </Card>

        {/* Avg Overall Rating */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              ความพึงพอใจภาพรวม
            </CardTitle>
            <Star className="size-4 text-amber-500 fill-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">{avgOverall} / 5.0</div>
            <p className="text-xs text-muted-foreground mt-1">คะแนนเฉลี่ยจากทุกมิติ</p>
          </CardContent>
        </Card>

        {/* NPS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              คะแนน NPS เฉลี่ย
            </CardTitle>
            <TrendingUp className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">{avgNps} / 10</div>
            <p className="text-xs text-muted-foreground mt-1">โอกาสบอกต่อเพื่อนร่วมสายงาน</p>
          </CardContent>
        </Card>

        {/* Confidence Boost */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              ความมั่นใจเพิ่มขึ้น
            </CardTitle>
            <Award className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading">{confidentPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">ผู้ใช้รู้สึกพร้อมสัมภาษณ์มากขึ้น</p>
          </CardContent>
        </Card>
      </div>

      {/* 3 Categories Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              1. ประสบการณ์ UI / UX
            </span>
            <div className="text-xl font-bold text-heading mt-1">{avgUi} <span className="text-sm font-normal text-muted-foreground">/ 5.0</span></div>
            <span className="text-xs text-muted-foreground">ความง่ายในการใช้งาน & แดชบอร์ด</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            UI
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              2. ระบบเสียง AI (Vapi)
            </span>
            <div className="text-xl font-bold text-heading mt-1">{avgVoice} <span className="text-sm font-normal text-muted-foreground">/ 5.0</span></div>
            <span className="text-xs text-muted-foreground">ความเป็นธรรมชาติ & Real-time STT</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-accent flex items-center justify-center font-bold">
            VOX
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              3. ผลประเมิน AI (Gemini)
            </span>
            <div className="text-xl font-bold text-heading mt-1">{avgEval} <span className="text-sm font-normal text-muted-foreground">/ 5.0</span></div>
            <span className="text-xs text-muted-foreground">ความแม่นยำ & ข้อเสนอแนะเชิงลึก</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-secondary flex items-center justify-center font-bold">
            GEM
          </div>
        </div>
      </div>

      {/* Feedbacks Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <CardTitle className="text-base font-bold text-heading">
              รายการแบบสอบถามล่าสุด ({filteredFeedbacks.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              คลิกเพื่อดูรายละเอียดความคิดเห็นและคะแนนของแต่ละท่าน
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, ตำแหน่ง, ประสบการณ์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold bg-background hover:bg-muted text-heading transition-colors cursor-pointer shrink-0"
              title="พิมพ์หรือบันทึกเป็น PDF"
            >
              <Printer className="size-3.5 text-accent" />
              <span className="hidden md:inline">พิมพ์ PDF</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">ผู้ประเมิน</th>
                  <th className="py-3 px-4">ตำแหน่ง / ระดับ</th>
                  <th className="py-3 px-4">ประสบการณ์</th>
                  <th className="py-3 px-4 text-center">NPS</th>
                  <th className="py-3 px-4 text-center">ความมั่นใจ</th>
                  <th className="py-3 px-4">วันที่ทำ</th>
                  <th className="py-3 px-4 text-right">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFeedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      ไม่พบข้อมูลแบบสอบถาม
                    </td>
                  </tr>
                ) : (
                  filteredFeedbacks.map((f) => {
                    const dateStr = new Date(f.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    });

                    return (
                      <tr
                        key={f.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-heading block">
                            {f.user?.name || "Anonymous"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {f.user?.email || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-heading block">
                            {f.position || "—"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {f.level} {f.hasCustomJd ? "• Custom JD" : ""}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {f.experienceLevel?.split(" ")[0] || "—"}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs ${
                              (f.npsScore ?? 0) >= 9
                                ? "bg-emerald-100 text-emerald-800"
                                : (f.npsScore ?? 0) >= 7
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {f.npsScore ?? "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className="text-[10px]">
                            {f.confidenceLevel || "—"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {dateStr}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedFeedback(f)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                            <span>ดูผล</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Detail */}
      <FeedbackDetailModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      />

      {/* Modal Export PDF */}
      <FeedbackPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        feedbacks={filteredFeedbacks}
      />
    </div>
  );
}
