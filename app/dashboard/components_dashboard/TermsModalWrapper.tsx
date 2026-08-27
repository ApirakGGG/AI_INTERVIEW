"use client";

import { useState, useEffect } from "react";
import TermsModal from "@/components/TermsModal";

export default function TermsModalWrapper() {
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // ตรวจสอบ localStorage หลัง mount บน Client เท่านั้น
    const accepted = localStorage.getItem("hasAcceptedTerms") === "true";
    setHasAccepted(accepted);

    // ถ้ายังไม่เคยยอมรับ ให้เปิด Modal อัตโนมัติ
    if (!accepted) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("hasAcceptedTerms", "true");
    setHasAccepted(true);
    setShowModal(false);
  };

  // ป้องกัน Hydration Mismatch ในระหว่างรอเช็ค localStorage บน client
  if (hasAccepted === null) {
    return null;
  }

  return (
    <>
      {/* ถ้าเคยยอมรับแล้ว แสดงปุ่มลอยสำหรับเปิดดูย้อนหลัง */}
      {hasAccepted && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 left-6 z-40 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg text-slate-600 px-4 py-2 text-sm font-medium rounded-full hover:bg-white hover:text-slate-900 transition-all hover:-translate-y-1 flex items-center gap-2"
        >
          <span>📜</span> ข้อกำหนดและเงื่อนไข
        </button>
      )}

      {/* แสดง Modal เมื่อ showModal เป็น true (ทั้งผู้ใช้ใหม่ และผู้ใช้ที่กดย้อนหลัง) */}
      {showModal && (
        <TermsModal
        isAccepted={hasAccepted}
          onAccept={handleAccept}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}