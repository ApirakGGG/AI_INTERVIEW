"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RatingSelectorProps {
  label: string;
  description?: string;
  value: number | null;
  onChange: (value: number) => void;
  required?: boolean;
}

const ratingLabels: Record<number, string> = {
  1: "น้อยที่สุด",
  2: "น้อย",
  3: "ปานกลาง",
  4: "มาก",
  5: "มากที่สุด",
};

export function RatingSelector({
  label,
  description,
  value,
  onChange,
  required = false,
}: RatingSelectorProps) {
  return (
    <div className="p-3.5 rounded-xl bg-background border border-border hover:border-slate-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div>
          <span className="text-sm font-semibold text-heading leading-tight">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {value && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0 self-start sm:self-auto">
            {value}/5 • {ratingLabels[value]}
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isSelected = value === rating;
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={cn(
                "flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer select-none",
                isSelected
                  ? "bg-primary text-white border-primary shadow-sm scale-[1.02]"
                  : "bg-card border-border text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <span className="text-sm sm:text-base font-bold">{rating}</span>
              <span className="text-[10px] hidden sm:inline-block opacity-80 mt-0.5 font-normal">
                {ratingLabels[rating]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface NpsSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function NpsSelector({ value, onChange }: NpsSelectorProps) {
  return (
    <div className="p-4 rounded-xl bg-background border border-border">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-heading">
          คะแนน NPS (0 - 10)
        </label>
        {value !== null && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
            {value} คะแนน
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        (0 = ไม่มีทางแนะนำเลย, 10 = แนะนำแน่นอนอย่างยิ่ง)
      </p>

      <div className="grid grid-cols-11 gap-1 sm:gap-1.5 overflow-x-auto pb-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isSelected = value === num;
          // Color coding: 0-6 Detractors (red/orange), 7-8 Passives (yellow), 9-10 Promoters (green)
          let activeClass = "bg-primary text-white border-primary";
          if (num <= 6) activeClass = "bg-amber-600 text-white border-amber-600";
          if (num >= 9) activeClass = "bg-emerald-600 text-white border-emerald-600";

          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={cn(
                "h-10 rounded-lg border text-sm font-bold flex items-center justify-center transition-all cursor-pointer",
                isSelected
                  ? activeClass + " shadow-md scale-105"
                  : "bg-card border-border text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {num}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-[11px] text-muted-foreground mt-2 px-1">
        <span>0 = ไม่แนะนำเลย</span>
        <span>5 = ปานกลาง</span>
        <span>10 = แนะนำแน่นอน</span>
      </div>
    </div>
  );
}
