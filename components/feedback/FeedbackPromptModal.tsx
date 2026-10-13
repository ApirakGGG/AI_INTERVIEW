"use client";

import React, { useEffect } from "react";
import { Sparkles, MessageSquareHeart, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackPromptModalProps {
  isOpen: boolean;
  onStartSurvey: () => void;
  onDecline: () => void;
  position?: string;
  level?: string;
}

export function FeedbackPromptModal({
  isOpen,
  onStartSurvey,
  onDecline,
  position,
  level,
}: FeedbackPromptModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onDecline}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300 text-center">
        {/* Close/Skip button */}
        <button
          onClick={onDecline}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="ข้าม / ปิด"
        >
          <X className="size-5" />
        </button>

        {/* Celebratory Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 ring-8 ring-primary/5">
          <Sparkles className="size-8 text-primary animate-pulse" />
        </div>

        <h3 className="text-2xl font-bold text-heading tracking-tight mb-2">
          🎉 ซ้อมสัมภาษณ์เสร็จเรียบร้อย!
        </h3>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          ระบบได้บันทึกการสัมภาษณ์ตำแหน่ง <strong className="text-heading">{position || "ทั่วไป"}</strong> ({level || "Junior"}) และกำลังประมวลผลการวิเคราะห์คะแนน
        </p>

        <div className="bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 rounded-2xl p-4 mb-6 text-left">
          <div className="flex gap-3 items-start">
            <MessageSquareHeart className="size-5 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-orange-900 dark:text-orange-200 leading-relaxed">
              <strong className="font-semibold block text-sm mb-1 text-orange-950 dark:text-orange-100">
                ร่วมประเมินความพึงพอใจ
              </strong>
              ใช้เวลาเพียง 1-2 นาที เพื่อช่วยเราพัฒนาคุณภาพเสียง AI, ความแม่นยำของการประเมินผล และประสบการณ์ใช้งานให้ดียิ่งขึ้น
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onStartSurvey}
            className="w-full py-6 rounded-xl font-bold text-base text-accent-foreground bg-accent hover:bg-accent-hover shadow-lg shadow-accent/20 transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>ทำแบบสอบถามความพึงพอใจ</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <button
            onClick={onDecline}
            className="w-full py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all cursor-pointer"
          >
            ไว้คราวหน้า / ข้ามไปหน้าแดชบอร์ด
          </button>
        </div>
      </div>
    </div>
  );
}
