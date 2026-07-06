"use client";
import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RecentInterviewsTable({ data }: { data: any[] }) {
  return (
    <div className="space-y-4 px-6 py-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-xl font-bold text-slate-800">ล่าสุด</h2>
      </div>

      <div className="space-y-3">
        {/* เช็กก่อนว่ามีข้อมูลไหม ถ้าไม่มีให้โชว์ว่าว่างเปล่า */}
        {data.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            ยังไม่มีประวัติการสัมภาษณ์
          </div>
        ) : (
          // ใช้ .map() เพื่อสร้างรายการจากข้อมูลจริง
          data.map((item) => {
            const dateStr = new Date(item.createdAt).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
            });
            const durationStr = formatTime(item.duration || 0);
            const score = Math.round(item.averageScore || 0);
            const isGood = score >= 50;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-slate-800">
                    {item.position}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{dateStr}</span>
                    <span>•</span>
                    <span>{item.level}</span>
                    <span>•</span>
                    <span>{durationStr}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "font-bold text-sm px-2.5 py-1 rounded-lg",
                      isGood
                        ? "text-green-600 bg-green-50"
                        : "text-red-500 bg-red-50"
                    )}
                  >
                    {score}/100
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {data.length > 0 && (
        <Link
          href="/history"
          className="w-full mt-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs rounded-xl transition-colors text-center block"
        >
          ดูทั้งหมด
        </Link>
      )}
    </div>
  );
}
