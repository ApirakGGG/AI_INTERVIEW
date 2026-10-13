"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Send,
  Loader2,
  User,
  Sliders,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingSelector, NpsSelector } from "./RatingSelector";

interface FeedbackSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: string;
  level: string;
  hasCustomJd: boolean;
  userId?: string;
  onSubmitted?: () => void;
}

export function FeedbackSurveyModal({
  isOpen,
  onClose,
  position,
  level,
  hasCustomJd,
  userId,
  onSubmitted,
}: FeedbackSurveyModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // ส่วนที่ 1: ข้อมูลทั่วไป
    experienceLevel: "นิสิต/นักศึกษา (Student)",
    confidenceLevel: "เพิ่มขึ้นมาก",

    // ส่วนที่ 2: Rating Scale 1-5
    // ด้านที่ 1: UI / UX
    ratingUiEase: 5,
    ratingUiInterview: 5,
    ratingUiDashboard: 4,
    ratingUiHistory: 4,

    // ด้านที่ 2: AI Voice (Vapi)
    ratingVoiceNatural: 4,
    ratingVoiceLatency: 4,
    ratingVoiceStt: 4,
    ratingVoiceRelevance: 5,

    // ด้านที่ 3: Evaluation (Gemini)
    ratingEvalFairness: 4,
    ratingEvalInsight: 5,
    ratingEvalPractical: 5,
    ratingEvalSpeed: 4,

    // ส่วนที่ 3: NPS
    npsScore: 9,

    // ส่วนที่ 4: ข้อเสนอแนะเพิ่มเติม
    mostLiked: "",
    problemsFound: "",
    futureSuggestions: "",
  });

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

  const updateField = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleDeclineOrSkip = () => {
    onClose();
    router.push("/dashboard");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          position,
          level,
          hasCustomJd,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setIsSubmitted(true);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      // Even if API has network issue, show success or fallback so user isn't stuck
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceOptions = [
    { label: "นิสิต/นักศึกษา", sub: "Student", value: "นิสิต/นักศึกษา (Student)" },
    { label: "เด็กจบใหม่ / กำลังหางานแรก", sub: "Entry Level / Fresh Grad", value: "เด็กจบใหม่ / กำลังหางานแรก (Entry Level / Fresh Graduate)" },
    { label: "มีประสบการณ์ 1 - 3 ปี", sub: "Junior Professional", value: "ผู้มีประสบการณ์ทำงาน 1 - 3 ปี (Junior)" },
    { label: "มีประสบการณ์ 3 ปีขึ้นไป", sub: "Mid - Senior Professional", value: "ผู้มีประสบการณ์ทำงาน 3 ปีขึ้นไป (Mid - Senior)" },
  ];

  const confidenceOptions = [
    { label: "🚀 เพิ่มขึ้นมาก", value: "เพิ่มขึ้นมาก" },
    { label: "📈 เพิ่มขึ้นเล็กน้อย", value: "เพิ่มขึ้นเล็กน้อย" },
    { label: "⚖️ เท่าเดิม", value: "เท่าเดิม" },
    { label: "📉 ลดลง", value: "ลดลง" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300"
        onClick={isSubmitted ? undefined : handleDeclineOrSkip}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl bg-card rounded-3xl shadow-2xl border border-border flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-heading flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              แบบสอบถามความพึงพอใจการใช้งาน
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI Voice Interview • Post-Interview Usability Survey
            </p>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleDeclineOrSkip}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="ข้าม / ปิด"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Progress Bar (if not submitted) */}
        {!isSubmitted && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 shrink-0">
            <div
              className="bg-accent h-1.5 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Step Tabs / Indicators */}
        {!isSubmitted && (
          <div className="px-6 py-2.5 bg-background border-b border-border flex items-center justify-between text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                step === 1 ? "text-accent font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step === 1 ? "bg-accent text-white" : "bg-muted text-muted-foreground"
              }`}>1</span>
              <span>ข้อมูล & ความมั่นใจ</span>
            </button>

            <ChevronRight className="size-3.5 text-muted-foreground/50" />

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                step === 2 ? "text-accent font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step === 2 ? "bg-accent text-white" : "bg-muted text-muted-foreground"
              }`}>2</span>
              <span>ประเมินประสบการณ์ (1-5)</span>
            </button>

            <ChevronRight className="size-3.5 text-muted-foreground/50" />

            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                step === 3 ? "text-accent font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step === 3 ? "bg-accent text-white" : "bg-muted text-muted-foreground"
              }`}>3</span>
              <span>NPS & ข้อเสนอแนะ</span>
            </button>
          </div>
        )}

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 custom-scrollbar">
          {/* ═══════════ SUCCESS VIEW ═══════════ */}
          {isSubmitted ? (
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-900/30">
                <CheckCircle2 className="size-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-heading mb-2">
                  ขอบคุณสำหรับข้อเสนอแนะ! 🎉
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ข้อมูลความคิดเห็นของคุณได้รับการบันทึกเรียบร้อยแล้ว
                  และจะนำไปพัฒนาปรับปรุง AI Voice Interview ให้ดียิ่งขึ้นต่อไป
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-6 rounded-xl font-bold text-base text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 cursor-pointer"
                >
                  ไปยังหน้าแดชบอร์ดเพื่อดูผลวิเคราะห์
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* ═══════════ STEP 1: GENERAL INFO ═══════════ */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Current Session Summary Card */}
                  <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-800/30 text-xs">
                    <span className="font-semibold text-orange-900 dark:text-orange-200 block mb-2">
                      📍 ข้อมูลการซ้อมสัมภาษณ์รอบนี้ (ดึงข้อมูลอัตโนมัติ):
                    </span>
                    <div className="flex flex-wrap gap-2 text-foreground">
                      <span className="px-2.5 py-1 rounded-lg bg-card border border-border shadow-xs">
                        ตำแหน่ง: <strong className="text-heading">{position || "Software Engineer"}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-card border border-border shadow-xs">
                        ระดับ: <strong className="text-heading">{level || "Junior"}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-card border border-border shadow-xs">
                        Job Description: <strong className="text-heading">{hasCustomJd ? "ระบุเอง (Custom JD)" : "คำถามมาตรฐานของระบบ"}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Question 1: Experience Level */}
                  <div>
                    <label className="text-sm font-bold text-heading block mb-1">
                      1. ระดับประสบการณ์การทำงานในปัจจุบันของคุณ:
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      เลือกระดับที่ตรงกับสถานะของคุณมากที่สุด
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {experienceOptions.map((opt) => {
                        const isSelected = formData.experienceLevel === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => updateField("experienceLevel", opt.value)}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary"
                                : "bg-card border-border hover:bg-slate-50 dark:hover:bg-slate-900/50"
                            }`}
                          >
                            <span className="text-sm font-bold block text-heading">
                              {opt.label}
                            </span>
                            <span className="text-xs text-muted-foreground block mt-0.5">
                              {opt.sub}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question 2: Confidence Level */}
                  <div>
                    <label className="text-sm font-bold text-heading block mb-1">
                      2. ระดับความมั่นใจของคุณหลังจากได้ฝึกซ้อมสัมภาษณ์กับระบบ:
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      ความรู้สึกของคุณต่อการเตรียมตัวสัมภาษณ์งานจริง
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {confidenceOptions.map((opt) => {
                        const isSelected = formData.confidenceLevel === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => updateField("confidenceLevel", opt.value)}
                            className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                              isSelected
                                ? "bg-accent/10 border-accent text-accent shadow-xs ring-1 ring-accent font-bold"
                                : "bg-card border-border hover:bg-slate-50 dark:hover:bg-slate-900/50 font-medium"
                            }`}
                          >
                            <span className="text-sm">{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════ STEP 2: RATINGS 1 - 5 ═══════════ */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground flex items-center justify-between">
                    <span>💡 เกณฑ์คะแนน: 1 = น้อยที่สุด • 3 = ปานกลาง • 5 = มากที่สุด / เห็นด้วยอย่างยิ่ง</span>
                  </div>

                  {/* ด้านที่ 1: UI / UX */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-heading flex items-center gap-2 border-b border-border pb-1.5">
                      <Sliders className="size-4 text-primary" />
                      ด้านที่ 1: การออกแบบและประสบการณ์ผู้ใช้ (UI / UX)
                    </h4>
                    <RatingSelector
                      label="1.1 ขั้นตอนการเข้าสู่ระบบและเริ่มฝึกสัมภาษณ์ง่าย ไม่ซับซ้อน"
                      value={formData.ratingUiEase}
                      onChange={(v) => updateField("ratingUiEase", v)}
                    />
                    <RatingSelector
                      label="1.2 หน้าสัมภาษณ์ (/interview) มีข้อมูลชัดเจน"
                      description="ตัวจับเวลา, ป้ายสถานะการพูด, ตัวแสดงผลคลื่นเสียง, ปิด-เปิดไมค์"
                      value={formData.ratingUiInterview}
                      onChange={(v) => updateField("ratingUiInterview", v)}
                    />
                    <RatingSelector
                      label="1.3 หน้าแดชบอร์ด (/dashboard) และกราฟแสดงข้อมูลเข้าใจง่าย"
                      description="Radar Chart, สรุปชั่วโมงฝึก, คะแนนเฉลี่ย"
                      value={formData.ratingUiDashboard}
                      onChange={(v) => updateField("ratingUiDashboard", v)}
                    />
                    <RatingSelector
                      label="1.4 หน้าประวัติการสัมภาษณ์ (/history) ตรวจสอบย้อนหลังได้สะดวก"
                      value={formData.ratingUiHistory}
                      onChange={(v) => updateField("ratingUiHistory", v)}
                    />
                  </div>

                  {/* ด้านที่ 2: ระบบสัมภาษณ์ด้วยเสียง AI (Vapi) */}
                  <div className="space-y-3 pt-3">
                    <h4 className="text-sm font-bold text-heading flex items-center gap-2 border-b border-border pb-1.5">
                      <MessageSquare className="size-4 text-accent" />
                      ด้านที่ 2: ระบบสัมภาษณ์ด้วยเสียง AI (AI Voice Interaction)
                    </h4>
                    <RatingSelector
                      label="2.1 น้ำเสียง จังหวะ และความเป็นธรรมชาติของเสียง AI คล้ายผู้สัมภาษณ์จริง"
                      value={formData.ratingVoiceNatural}
                      onChange={(v) => updateField("ratingVoiceNatural", v)}
                    />
                    <RatingSelector
                      label="2.2 ความเร็วในการตอบสนอง (Response Latency) ของ AI ไม่อืดหรือดีเลย์"
                      value={formData.ratingVoiceLatency}
                      onChange={(v) => updateField("ratingVoiceLatency", v)}
                    />
                    <RatingSelector
                      label="2.3 ระบบจับเสียง (Speech-to-Text) และซับไทเทิลแบบ Real-time มีความแม่นยำ"
                      value={formData.ratingVoiceStt}
                      onChange={(v) => updateField("ratingVoiceStt", v)}
                    />
                    <RatingSelector
                      label="2.4 คำถามที่ AI ถามมีความเกี่ยวข้องและสอดคล้องกับตำแหน่ง/JD ที่เลือก"
                      value={formData.ratingVoiceRelevance}
                      onChange={(v) => updateField("ratingVoiceRelevance", v)}
                    />
                  </div>

                  {/* ด้านที่ 3: การประเมินผลและคำแนะนำ (Gemini) */}
                  <div className="space-y-3 pt-3">
                    <h4 className="text-sm font-bold text-heading flex items-center gap-2 border-b border-border pb-1.5">
                      <ThumbsUp className="size-4 text-secondary" />
                      ด้านที่ 3: การประเมินผลและคำแนะนำ (Evaluation & Feedback)
                    </h4>
                    <RatingSelector
                      label="3.1 ความสมเหตุสมผลของการให้คะแนน 3 ด้าน (Technical, Communication, Logic)"
                      value={formData.ratingEvalFairness}
                      onChange={(v) => updateField("ratingEvalFairness", v)}
                    />
                    <RatingSelector
                      label="3.2 คำแนะนำเชิงลึก (AI Feedback) สร้างสรรค์ ชี้จุดแข็ง/จุดอ่อนได้ตรงประเด็น"
                      value={formData.ratingEvalInsight}
                      onChange={(v) => updateField("ratingEvalInsight", v)}
                    />
                    <RatingSelector
                      label="3.3 คุณสามารถนำคำแนะนำที่ได้รับไปปรับใช้กับการสัมภาษณ์งานจริงได้"
                      value={formData.ratingEvalPractical}
                      onChange={(v) => updateField("ratingEvalPractical", v)}
                    />
                    <RatingSelector
                      label="3.4 ความรวดเร็วในการสร้างรายงานผลหลังกดจบการสัมภาษณ์"
                      value={formData.ratingEvalSpeed}
                      onChange={(v) => updateField("ratingEvalSpeed", v)}
                    />
                  </div>
                </div>
              )}

              {/* ═══════════ STEP 3: NPS & OPEN-ENDED ═══════════ */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* NPS */}
                  <div>
                    <label className="text-sm font-bold text-heading block mb-1">
                      1. โอกาสที่คุณจะแนะนำระบบนี้ให้เพื่อนหรือคนรู้จัก:
                    </label>
                    <NpsSelector
                      value={formData.npsScore}
                      onChange={(v) => updateField("npsScore", v)}
                    />
                  </div>

                  {/* Open-ended Questions */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-heading flex items-center gap-2 border-b border-border pb-1.5">
                      <HelpCircle className="size-4 text-primary" />
                      ความคิดเห็นและข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
                    </h4>

                    <div>
                      <label className="text-xs font-semibold text-heading block mb-1.5">
                        • สิ่งที่ท่านชอบมากที่สุดในการใช้งานแพลตฟอร์มนี้:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="เช่น เสียง AI เป็นธรรมชาติ, กราฟดูง่าย, คำแนะนำมีประโยชน์..."
                        className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-accent outline-none resize-none placeholder:text-muted-foreground"
                        value={formData.mostLiked}
                        onChange={(e) => updateField("mostLiked", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-heading block mb-1.5">
                        • ปัญหาหรืออุปสรรคที่พบระหว่างการใช้งาน:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="เช่น เสียงตัด, การจับเสียงพิมพ์ผิดบางคำ, คำถามซ้ำ..."
                        className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-accent outline-none resize-none placeholder:text-muted-foreground"
                        value={formData.problemsFound}
                        onChange={(e) => updateField("problemsFound", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-heading block mb-1.5">
                        • ฟังก์ชันที่อยากให้มีเพิ่มเติมในอนาคต:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="เช่น โหมดสัมภาษณ์ภาษาอังกฤษ, ดาวน์โหลดผลสอบเป็น PDF, วิเคราะห์ภาษากายผ่านกล้อง..."
                        className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-accent outline-none resize-none placeholder:text-muted-foreground"
                        value={formData.futureSuggestions}
                        onChange={(e) => updateField("futureSuggestions", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isSubmitted && (
          <div className="p-4 sm:p-5 border-t border-border bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {/* Decline/Skip Button */}
            <button
              type="button"
              onClick={handleDeclineOrSkip}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline py-1 px-2 cursor-pointer order-last sm:order-first"
            >
              ปฏิเสธ / ข้ามแบบสอบถาม
            </button>

            {/* Stepper Navigation */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <ChevronLeft className="size-4 mr-1" />
                  ย้อนกลับ
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-accent text-accent-foreground hover:bg-accent-hover shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>ถัดไป</span>
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="px-7 py-2.5 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>กำลังส่ง...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>ส่งแบบสอบถาม</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
