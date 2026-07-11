"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface InterviewActivity {
  createdAt: Date;
  duration: number | null;
}

// ฟังก์ชันสร้าง Mock Data สำหรับแสดงผลตารางกิจกรรมกรณีไม่มีข้อมูลใน DB
const generateMockInterviews = () => {
  const mockList: { createdAt: Date; duration: number }[] = [];
  const today = new Date();
  
  // สุ่มกิจกรรมสัมภาษณ์ประมาณ 60 รายการย้อนหลัง 150 วัน
  for (let i = 0; i < 60; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 150);
    const createdAt = new Date();
    createdAt.setDate(today.getDate() - randomDaysAgo);
    
    mockList.push({
      createdAt,
      duration: Math.floor(Math.random() * 1200) + 300, // 5 - 25 นาที
    });
    
    // สุ่มเพิ่มเซสชันการฝึกซ้ำในวันเดียวกันเพื่อเพิ่มระดับความเข้มของสี
    if (Math.random() > 0.7) {
      mockList.push({
        createdAt,
        duration: Math.floor(Math.random() * 1200) + 300,
      });
    }
  }
  return mockList;
};

export function LearningActivities({
  interviews,
}: {
  interviews: InterviewActivity[];
}) {
  const weeksToShow = 22; // แสดงประมาณ 5 เดือน
  const totalDays = weeksToShow * 7;
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = วันอาทิตย์, 6 = วันเสาร์
  
  // ปรับให้เริ่มต้นที่วันอาทิตย์ของสัปดาห์ที่เริ่มแสดงผลย้อนหลัง
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (totalDays - 1) - dayOfWeek);
  startDate.setHours(0, 0, 0, 0);
  
  // ใช้ข้อมูลจริง หรือ mock data หากยังไม่มีประวัติสัมภาษณ์เลย
  const displayInterviews = interviews && interviews.length > 0 
    ? interviews 
    : React.useMemo(() => generateMockInterviews(), []);

  // รวมข้อมูลการฝึกฝนแยกเป็นรายวัน (คีย์เป็น YYYY-MM-DD)
  const activityMap: Record<string, { count: number; duration: number }> = {};
  
  displayInterviews.forEach((interview) => {
    const dateStr = new Date(interview.createdAt).toISOString().split("T")[0];
    if (!activityMap[dateStr]) {
      activityMap[dateStr] = { count: 0, duration: 0 };
    }
    activityMap[dateStr].count += 1;
    activityMap[dateStr].duration += interview.duration || 0;
  });
  
  // สร้างอาเรย์ข้อมูลของทุกๆ วัน
  const cells = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < totalDays; i++) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const activity = activityMap[dateStr] || { count: 0, duration: 0 };
    
    cells.push({
      date: new Date(currentDate),
      dateStr,
      count: activity.count,
      duration: activity.duration,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-background border border-border hover:bg-muted/50";
    if (count === 1) return "bg-primary/30 border border-primary/10 hover:bg-primary/40 text-transparent";
    if (count === 2) return "bg-primary/60 border border-primary/10 hover:bg-primary/70 text-transparent";
    return "bg-primary border border-primary/20 hover:bg-primary/90 text-transparent shadow-sm";
  };

  // จัดกลุ่มข้อมูลแยกตามสัปดาห์สัปดาห์ละ 7 วันเป็น 1 คอลัมน์
  const columns: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }

  // คำนวณเดือนเพื่อแสดงป้ายกำกับชื่อเดือนด้านบนคอลัมน์
  const monthLabels: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  
  columns.forEach((week, colIdx) => {
    const firstDayOfWeek = week[0]?.date;
    if (firstDayOfWeek) {
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        const label = firstDayOfWeek.toLocaleDateString("th-TH", { month: "short" });
        monthLabels.push({ label, colIndex: colIdx });
        lastMonth = month;
      }
    }
  });

  return (
    <Card className="shadow-card border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold cn-font-heading flex items-center gap-2 text-heading">
          <Calendar className="text-secondary size-5" />
          Learning Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2 scrollbar-none">
          {/* ป้องกันการบีบตัวของตารางกิจกรรม */}
          <div className="w-max flex flex-col space-y-1">
            {/* ป้ายเดือน */}
            <div className="h-4 text-[10px] text-slate-400 relative mb-1">
              {monthLabels.map((ml, idx) => (
                <div
                  key={idx}
                  className="absolute"
                  style={{ left: `${ml.colIndex * 17 + 28}px` }}
                >
                  {ml.label}
                </div>
              ))}
            </div>
            
            {/* ส่วนของตารางและวันของสัปดาห์ */}
            <div className="flex gap-0.75 shrink-0">
              {/* ชื่อวันย่อ */}
              <div className="flex flex-col justify-between text-[9px] text-slate-400 pr-2 w-7 h-29 py-1 text-right select-none shrink-0">
                <span>อา.</span>
                <span>อ.</span>
                <span>พฤ.</span>
                <span>ส.</span>
              </div>
              
              {/* คอลัมน์ของแต่ละสัปดาห์ */}
              <div className="flex gap-0.75 shrink-0">
                {columns.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-0.75 shrink-0">
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        className={`w-3.5 h-3.5 rounded-xs shrink-0 transition-all duration-200 hover:scale-110 cursor-pointer ${getColorClass(day.count)}`}
                        style={{ width: "14px", height: "14px" }}
                        title={`${day.date.toLocaleDateString("th-TH")} : สัมภาษณ์ ${day.count} ครั้ง (${Math.round(day.duration / 60)} นาที)`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground font-medium">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[3px] border border-border bg-background" style={{ width: "12px", height: "12px" }} />
          <div className="w-3 h-3 rounded-[3px] bg-primary/30" style={{ width: "12px", height: "12px" }} />
          <div className="w-3 h-3 rounded-[3px] bg-primary/60" style={{ width: "12px", height: "12px" }} />
          <div className="w-3 h-3 rounded-[3px] bg-primary" style={{ width: "12px", height: "12px" }} />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
