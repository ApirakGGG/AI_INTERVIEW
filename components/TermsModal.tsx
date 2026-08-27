"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsModal({
  onAccept,
  isAccepted,
}: {
  onAccept: () => void;
  onClose?: () => void;
  isAccepted: boolean;
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock body scrolling when mounted
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (solid block) */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto" />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 md:p-8 flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold cn-font-heading text-heading">
              ข้อกำหนดการให้บริการและนโยบายความเป็นส่วนตัว
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              กรุณาตรวจสอบและยอมรับข้อตกลงก่อนเข้าใช้งานแพลตฟอร์มสัมภาษณ์งานด้วย
              AI
            </p>
          </div>

          {/* Scrollable Text Area */}
          <div className="flex-1 overflow-y-auto mb-6 pr-4 border border-border rounded-xl p-4 bg-background text-sm text-muted-foreground leading-relaxed shadow-inner max-h-60 custom-scrollbar">
            <p className="mb-4">
              <strong>1. การยอมรับข้อตกลงและเงื่อนไข</strong>
              <br />
              เมื่อคุณเข้าใช้บริการหรือใช้งานแพลตฟอร์มสัมภาษณ์งานด้วยเสียง AI
              (AI Voice Interview)
              ถือว่าคุณยินยอมที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขการให้บริการนี้
              หากคุณไม่ยินยอมตามข้อตกลงทั้งหมด
              คุณจะไม่สามารถเข้าใช้งานบริการของเราได้
            </p>
            <p className="mb-4">
              <strong>2. การใช้งานข้อมูลและความเป็นส่วนตัว</strong>
              <br />
              เราเคารพความเป็นส่วนตัวของคุณ ข้อมูลเสียงและบทสนทนา (Transcripts)
              ทั้งหมดที่บันทึกระหว่างการซ้อมสัมภาษณ์จะถูกนำไปประมวลผลอย่างปลอดภัยเพื่อวิเคราะห์และให้คำแนะนำในการปรับปรุงทักษะเท่านั้น
              โดยไม่มีการนำข้อมูลส่วนบุคคลของคุณไปขายหรือเผยแพร่แก่บุคคลภายนอก
              และใช้เทคโนโลยีการเข้ารหัสมาตรฐานเพื่อปกป้องข้อมูลของคุณ
            </p>
            <p className="mb-4">
              <strong>3. การยินยอมให้ AI ประมวลผลข้อมูล</strong>
              <br />
              การเข้าใช้งานแพลตฟอร์มนี้ ถือว่าคุณยินยอมให้ระบบปัญญาประดิษฐ์ (AI)
              บันทึก ประมวลผล และวิเคราะห์น้ำเสียง ข้อความพูด
              และประสิทธิภาพการสัมภาษณ์ของคุณ เพื่อวัตถุประสงค์ในการประเมินผล
              ให้คะแนน และสร้างคำแนะนำอัตโนมัติ
            </p>
            <p className="mb-4">
              <strong>4. การจัดเก็บและการลบข้อมูล</strong>
              <br />
              ประวัติการสัมภาษณ์และบันทึกข้อมูลของคุณจะถูกจัดเก็บไว้อย่างปลอดภัย
              โดยคุณสามารถร้องขอให้ลบข้อมูลส่วนบุคคลของคุณได้ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
              (PDPA)
            </p>
            <p>
              <strong>5. ความปลอดภัยและการปรับปรุงระบบ</strong>
              <br />
              ผู้ดูแลระบบอาจใช้นามสมมุติและรวมกลุ่มข้อมูลที่ไม่ระบุตัวตน
              เพื่อนำไปพัฒนาและปรับปรุงประสิทธิภาพของอัลกอริทึม AI
              ให้ดียิ่งขึ้นอย่างต่อเนื่อง
            </p>
          </div>

          {/* Mandatory Checkbox */}
          <div className="mb-8">
            {isAccepted ? (
              <label className="text-sm font-medium text-body leading-snug">
                คุณได้ยอมรับข้อกำหนดและเงื่อนไขแล้ว
              </label>
            ) : (
              <label className="flex items-start gap-4 cursor-pointer group">
                <div
                  className={`w-6 h-6 mt-0.5 rounded-md border-2 flex items-center justify-center transition-colors shadow-sm shrink-0 ${
                    isChecked
                      ? "bg-primary border-primary text-white"
                      : "border-slate-300 bg-background group-hover:border-primary/50"
                  }`}
                  onClick={() => setIsChecked(!isChecked)}
                >
                  {isChecked && <Check className="size-4" />}
                </div>
                <span className="text-sm font-medium text-body leading-snug">
                  ฉันได้อ่าน เข้าใจ
                  และยอมรับข้อกำหนดการให้บริการและนโยบายความเป็นส่วนตัวทั้งหมด
                </span>
              </label>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-border mt-auto">
            {isAccepted ? (
              <Button
                onClick={onAccept}
                className={`w-full py-6 text-base font-bold shadow-lg transition-all 
                  bg-accent text-accent-foreground hover:bg-red-600 opacity-100 cursor-pointer
              }`}
              >
                ปิด
              </Button>
            ) : (
              <Button
                onClick={onAccept}
                disabled={!isChecked}
                className={`w-full py-6 text-base font-bold shadow-lg transition-all ${
                  isChecked
                    ? "bg-accent text-accent-foreground hover:bg-accent-hover opacity-100 cursor-pointer"
                    : "bg-muted-foreground text-background opacity-50 cursor-not-allowed"
                }`}
              >
                ยอมรับและดำเนินการต่อ
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
