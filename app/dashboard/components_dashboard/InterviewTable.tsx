"use client";
import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RecentInterviewsTable({ data }: { data: any[] }) {
  return (
    <div className="space-y-4 px-6 py-6 h-full flex flex-col">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-xl font-bold cn-font-heading text-heading">Recent Interviews</h2>
      </div>

      <div className="space-y-3 flex-1 overflow-auto custom-scrollbar">
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
                className="flex items-center justify-between px-5 py-4 bg-background group hover:border-primary/30 border border-border rounded-xl transition-all shadow-sm"
              >
                <div className="space-y-1">
                  <div className="font-bold text-[15px] text-heading group-hover:text-primary transition-colors">
                    {item.position}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span>{dateStr}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{item.level}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{durationStr}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mr-1">Score</span>
                  <span
                    className={cn(
                      "font-bold text-sm px-3 py-1 rounded-md border",
                      isGood
                        ? "text-badge-text bg-badge-bg border-badge-border"
                        : "text-muted-foreground bg-muted border-border"
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
          className="w-full mt-4 py-3 border border-border bg-background hover:bg-accent/10 hover:text-accent hover:border-accent/30 font-bold text-sm rounded-xl transition-all text-center block shadow-sm"
        >
          View All History
        </Link>
      )}
    </div>
  );
}
