import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Link from "next/link";
import { ChevronLeft, History, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

import { StatsCard } from "@/app/dashboard/components_dashboard/StatsCard";
import { formatTime } from "@/lib/formatTime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: clerkId } = await params;

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { interviews: { orderBy: { createdAt: 'desc' } } },
  });

  if (!user) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold text-heading">ไม่พบข้อมูลผู้ใช้งาน</h2>
        <p className="text-muted-foreground">ไม่พบผู้ใช้งานที่ระบุในระบบ</p>
        <Button asChild variant="outline">
          <Link href="/admin/users">กลับไปหน้าสารบัญสมาชิก</Link>
        </Button>
      </div>
    );
  }

  // Aggregate user stats
  const totalInterviews = user.interviews.length;
  const avgScore = totalInterviews > 0 
    ? Math.round(user.interviews.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / totalInterviews)
    : 0;
  const totalPracticeTime = user.interviews.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const displayTime = formatTime(totalPracticeTime);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/users" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-3">
            <ChevronLeft className="size-4 mr-1" /> กลับไปหน้ารายชื่อสมาชิก
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold cn-font-heading text-heading">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <div className="w-1 h-1 rounded-full bg-border" />
                <Badge variant="outline" className="text-xs bg-muted/50">
                  {user.role === "ADMIN" ? "ผู้ดูแลระบบ" : "สมาชิกผู้ใช้งาน"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="จำนวนสัมภาษณ์ทั้งหมด"
          value={totalInterviews.toString()}
          icon={<History className="size-5" />}
          description={`เป็นสมาชิกเมื่อ ${new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))}`}
          intent="primary"
        />
        <StatsCard
          title="คะแนนเฉลี่ย"
          value={`${avgScore}/100`}
          icon={<Star className="size-5" />}
          description={totalInterviews > 0 ? "ผลการประเมินภาพรวม" : "ไม่มีข้อมูล"}
          intent="secondary"
        />
        <StatsCard
          title="เวลารวมที่ใช้ฝึกซ้อม"
          value={`${displayTime}`}
          icon={<Clock className="size-5" />}
          description="เวลาประมวลผลเสียงสะสม"
          intent="accent"
        />
      </div>

      {/* Interview History Table (Full Width) */}
      <div className="w-full mt-8">
        <Card className="shadow-card border-border h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg cn-font-heading">ประวัติการสัมภาษณ์โดยละเอียด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[700px]">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">หัวข้อ / ตำแหน่ง</th>
                    <th className="px-4 py-3 font-medium">ระดับ</th>
                    <th className="px-4 py-3 font-medium">วันที่ทำรายการ</th>
                    <th className="px-4 py-3 font-medium">ระยะเวลา</th>
                    <th className="px-4 py-3 font-medium text-center">คะแนน</th>
                    <th className="px-4 py-3 font-medium rounded-tr-lg text-right">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {user.interviews.map((interview) => (
                    <tr key={interview.id} className="border-b last:border-0 border-border hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-4 font-bold text-heading">
                        {interview.position || "หัวข้อกำหนดเอง"}
                      </td>
                      <td className="px-4 py-4 text-body">
                        {interview.level || "ไม่ระบุ"}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Intl.DateTimeFormat('th-TH', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(interview.createdAt))}
                      </td>
                      <td className="px-4 py-4 text-body">
                        {interview.duration ? `${Math.floor(interview.duration / 60)} นาที ${interview.duration % 60} วินาที` : "N/A"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`font-bold text-sm px-3 py-1 rounded-md border ${
                          (interview.averageScore || 0) >= 70 
                            ? "text-badge-text bg-badge-bg border-badge-border" 
                            : "text-muted-foreground bg-muted border-border"
                        }`}>
                          {Math.round(interview.averageScore || 0)}/100
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Badge 
                          variant={interview.status === "completed" ? "default" : "secondary"}
                          className={interview.status === "completed" 
                            ? "bg-badge-bg text-badge-text border-badge-border" 
                            : "bg-muted text-muted-foreground"
                          }
                        >
                          {interview.status === "completed" ? "เสร็จสมบูรณ์" : interview.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {user.interviews.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        ผู้ใช้รายนี้ยังไม่มีประวัติการสัมภาษณ์
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
