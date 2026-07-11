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

  if (!showModal) return null;

  return <TermsModal onAccept={handleAccept} />;
}
