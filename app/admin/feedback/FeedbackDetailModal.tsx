"use client";

import React from "react";
import { X, User, ThumbsUp, MessageSquare, Sliders, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface FeedbackDetailModalProps {
  feedback: FeedbackItem | null;
  onClose: () => void;
}

export function FeedbackDetailModal({
  feedback,
  onClose,
}: FeedbackDetailModalProps) {
  if (!feedback) return null;

  const dateStr = new Date(feedback.createdAt).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-heading flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              รายละเอียดแบบประเมินความพึงพอใจ
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              ส่งเมื่อ: {dateStr}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm custom-scrollbar">
          {/* User info */}
          <div className="p-4 rounded-xl bg-background border border-border flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                <User className="size-5" />
              </div>
              <div>
                <div className="font-bold text-heading">
                  {feedback.user?.name || "ไม่ระบุชื่อ"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {feedback.user?.email || "ไม่มีอีเมล"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">
                {feedback.position || "ไม่ระบุตำแหน่ง"}
              </Badge>
              <Badge variant="secondary">
                {feedback.level || "Junior"}
              </Badge>
              {feedback.hasCustomJd && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                  Custom JD
                </Badge>
              )}
            </div>
          </div>

          {/* Experience & Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-border bg-background">
              <span className="text-xs text-muted-foreground block">
                ระดับประสบการณ์:
              </span>
              <strong className="text-heading text-sm mt-0.5 block">
                {feedback.experienceLevel || "ไม่ได้ระบุ"}
              </strong>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background">
              <span className="text-xs text-muted-foreground block">
                ความมั่นใจหลังสัมภาษณ์:
              </span>
              <strong className="text-heading text-sm mt-0.5 block">
                {feedback.confidenceLevel || "ไม่ได้ระบุ"}
              </strong>
            </div>
          </div>

          {/* Scores Overview */}
          <div className="space-y-4">
            <h4 className="font-bold text-heading text-xs tracking-wider uppercase flex items-center gap-2">
              <Sliders className="size-4 text-primary" />
              คะแนนประเมินแต่ละด้าน (เต็ม 5)
            </h4>

            {/* UI/UX */}
            <div className="p-3.5 rounded-xl bg-background border border-border space-y-2 text-xs">
              <span className="font-bold text-heading block">
                1. ด้าน UI / UX & การใช้งานระบบ
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-muted-foreground">
                <div>เข้าระบงง่าย: <strong className="text-heading">{feedback.ratingUiEase ?? "-"}</strong>/5</div>
                <div>หน้าสัมภาษณ์: <strong className="text-heading">{feedback.ratingUiInterview ?? "-"}</strong>/5</div>
                <div>แดชบอร์ด/กราฟ: <strong className="text-heading">{feedback.ratingUiDashboard ?? "-"}</strong>/5</div>
                <div>ประวัติย้อนหลัง: <strong className="text-heading">{feedback.ratingUiHistory ?? "-"}</strong>/5</div>
              </div>
            </div>

            {/* Voice */}
            <div className="p-3.5 rounded-xl bg-background border border-border space-y-2 text-xs">
              <span className="font-bold text-heading block">
                2. ด้านระบบเสียง AI (Vapi)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-muted-foreground">
                <div>ความเป็นธรรมชาติ: <strong className="text-heading">{feedback.ratingVoiceNatural ?? "-"}</strong>/5</div>
                <div>ความเร็วตอบสนอง: <strong className="text-heading">{feedback.ratingVoiceLatency ?? "-"}</strong>/5</div>
                <div>ซับไทเทิล/STT: <strong className="text-heading">{feedback.ratingVoiceStt ?? "-"}</strong>/5</div>
                <div>คำถามตรงประเด็น: <strong className="text-heading">{feedback.ratingVoiceRelevance ?? "-"}</strong>/5</div>
              </div>
            </div>

            {/* Eval */}
            <div className="p-3.5 rounded-xl bg-background border border-border space-y-2 text-xs">
              <span className="font-bold text-heading block">
                3. ด้านการประเมินผล (Gemini AI)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-muted-foreground">
                <div>ความสมเหตุสมผล: <strong className="text-heading">{feedback.ratingEvalFairness ?? "-"}</strong>/5</div>
                <div>คำแนะนำตรงจุด: <strong className="text-heading">{feedback.ratingEvalInsight ?? "-"}</strong>/5</div>
                <div>นำไปใช้จริงได้: <strong className="text-heading">{feedback.ratingEvalPractical ?? "-"}</strong>/5</div>
                <div>ความเร็วออกรายงาน: <strong className="text-heading">{feedback.ratingEvalSpeed ?? "-"}</strong>/5</div>
              </div>
            </div>
          </div>

          {/* NPS */}
          <div className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-heading">
              คะแนน Net Promoter Score (NPS):
            </span>
            <span className="text-lg font-black px-3 py-1 rounded-lg bg-accent/10 text-accent">
              {feedback.npsScore ?? "-"} / 10
            </span>
          </div>

          {/* Open-ended answers */}
          <div className="space-y-3">
            <h4 className="font-bold text-heading text-xs tracking-wider uppercase flex items-center gap-2">
              <MessageSquare className="size-4 text-secondary" />
              ความคิดเห็นและข้อเสนอแนะเพิ่มเติม
            </h4>

            <div className="p-3.5 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground block mb-1">
                สิ่งที่ชอบมากที่สุด:
              </span>
              <p className="text-heading text-sm">
                {feedback.mostLiked || "—"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground block mb-1">
                ปัญหาหรืออุปสรรคที่พบ:
              </span>
              <p className="text-heading text-sm">
                {feedback.problemsFound || "—"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-background border border-border">
              <span className="text-xs text-muted-foreground block mb-1">
                ฟังก์ชันที่อยากให้มีเพิ่มเติม:
              </span>
              <p className="text-heading text-sm">
                {feedback.futureSuggestions || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
