"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsModal({ onAccept, onClose }: { onAccept: () => void, onClose?: () => void }) {
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock body scrolling when mounted
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
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
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold cn-font-heading text-heading">Terms of Service & Privacy Policy Updates</h2>
              <p className="text-sm text-muted-foreground mt-1">Please review the updated agreements before accessing your platform.</p>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X className="size-5" />
              </button>
            )}
          </div>

          {/* Scrollable Text Area */}
          <div className="flex-1 overflow-y-auto mb-6 pr-4 border border-border rounded-xl p-4 bg-background text-sm text-muted-foreground leading-relaxed shadow-inner max-h-60 custom-scrollbar">
            <p className="mb-4">
              <strong>1. Acceptance of Terms</strong><br/>
              By accessing or using our AI Voice Interview platform, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not use our services.
            </p>
            <p className="mb-4">
              <strong>2. Data Usage and Privacy</strong><br/>
              We respect your privacy. Under our updated Privacy Policy, all audio data and transcripts submitted during mock interviews are securely processed to provide performance feedback. We do not sell your personal data to third parties. We use industry-standard encryption to protect your records.
            </p>
            <p className="mb-4">
              <strong>3. AI Processing Consent</strong><br/>
              By continuing to use this platform, you explicitly consent to the recording, processing, and analysis of your voice patterns, spoken text, and interview performance by our Artificial Intelligence systems for the sole operational purpose of generating automated grading and feedback.
            </p>
            <p className="mb-4">
              <strong>4. Data Retention</strong><br/>
              Your interview history and logs are maintained securely and can be purged upon request under applicable data protection laws.
            </p>
            <p>
              <strong>5. Security Compliance</strong><br/>
              Administrators hold the right to review aggregated, anonymized feedback to improve the underlying system algorithms iteratively.
            </p>
          </div>

          {/* Mandatory Checkbox */}
          <div className="mb-8">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div 
                className={`w-6 h-6 mt-0.5 rounded-md border-2 flex items-center justify-center transition-colors shadow-sm shrink-0 ${
                  isChecked ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-background group-hover:border-primary/50'
                }`}
                onClick={() => setIsChecked(!isChecked)}
              >
                {isChecked && <Check className="size-4" />}
              </div>
              <span className="text-sm font-medium text-body leading-snug">
                I have read, understood, and accept the Terms of Service and Privacy Policy agreements.
              </span>
            </label>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-border mt-auto">
            <Button 
              onClick={onAccept}
              disabled={!isChecked}
              className={`w-full py-6 text-base font-bold shadow-lg transition-all ${
                isChecked 
                  ? 'bg-accent text-accent-foreground hover:bg-accent-hover opacity-100 cursor-pointer' 
                  : 'bg-muted-foreground text-background opacity-50 cursor-not-allowed'
              }`}
            >
              Accept and Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
