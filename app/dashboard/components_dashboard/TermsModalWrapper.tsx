"use client";

import { useState, useEffect } from "react";
import TermsModal from "@/components/TermsModal";

export default function TermsModalWrapper() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // เช็คว่าเคยยอมรับข้อตกลงหรือยังจาก localStorage
    const hasAccepted = localStorage.getItem("hasAcceptedTerms");
    if (!hasAccepted) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("hasAcceptedTerms", "true");
    setShowModal(false);
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 left-6 z-40 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg text-slate-600 px-4 py-2 text-sm font-medium rounded-full hover:bg-white hover:text-slate-900 transition-all hover:-translate-y-1 flex items-center gap-2"
      >
        <span>📜</span> ข้อกำหนดและเงื่อนไข
      </button>

      {showModal && <TermsModal onAccept={handleAccept} onClose={() => setShowModal(false)} />}
    </>
  );
}
