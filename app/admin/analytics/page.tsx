import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Activity, ArrowUpRight } from "lucide-react";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  // Aggregate KPIs
  const totalInterviews = await prisma.interview.count();
  
  // Last 7 days vs previous 7 days trend for total interviews
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);

  const thisWeekInterviews = await prisma.interview.count({
    where: { createdAt: { gte: sevenDaysAgo } }
  });
  
  const lastWeekInterviews = await prisma.interview.count({
    where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }
  });

  const trendPercentage = lastWeekInterviews === 0 ? 100 : Math.round(((thisWeekInterviews - lastWeekInterviews) / lastWeekInterviews) * 100);
  const isPositiveTrend = trendPercentage >= 0;

  // Active Users Today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const activeUsersTodayList = await prisma.interview.findMany({
    where: { createdAt: { gte: startOfDay } },
    select: { userId: true },
    distinct: ['userId']
  });
  const activeUsersToday = activeUsersTodayList.length;

  // Topics/Positions Leaderboard
  const positionGroups = await prisma.interview.groupBy({
    by: ['position'],
    _count: { position: true },
    orderBy: { _count: { position: 'desc' } }
  });

  const mostPopularTopic = positionGroups.length > 0 ? positionGroups[0].position : "N/A";
  
  // Audit Log Table Data
  const recentInterviews = await prisma.interview.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold cn-font-heading text-heading mb-2">วิเคราะห์ข้อมูลแพลตฟอร์ม</h1>
        <p className="text-muted-foreground text-sm">ติดตามกิจกรรมการใช้งานของผู้ใช้และสถิติภาพรวมระบบ</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-heading">จำนวนการสัมภาษณ์ทั้งหมดในระบบ</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-heading">{totalInterviews.toLocaleString()}</div>
            <p className={`text-xs mt-1 flex items-center gap-1 ${isPositiveTrend ? 'text-green-600' : 'text-destructive'}`}>
              {isPositiveTrend ? <ArrowUpRight className="size-3" /> : null}
              {isPositiveTrend ? '+' : ''}{trendPercentage}% จากสัปดาห์ที่แล้ว
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-heading">หัวข้อยอดนิยมสูงสุด</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-heading mt-1">
              <Badge className="bg-badge-bg text-badge-text border-badge-border text-sm px-3 py-1">
                {mostPopularTopic}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">อัตราการเข้าใช้งานสูงสุด</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-heading">ผู้ใช้งานที่ใช้วันนี้</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-heading">{activeUsersToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">จำนวนผู้ใช้ที่เข้าใช้งานในวันนี้</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Topic Popularity Leaderboard */}
        <div className="xl:w-1/2">
          <Card className="shadow-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg cn-font-heading">ความนิยมของหัวข้อสัมภาษณ์</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positionGroups.slice(0, 5).map((group, idx) => {
                  const percentage = totalInterviews > 0 ? Math.round((group._count.position / totalInterviews) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-heading truncate pr-4">{group.position || "ไม่ระบุ"}</span>
                        <span className="text-muted-foreground font-semibold">{percentage}% ({group._count.position})</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {positionGroups.length === 0 && (
                  <p className="text-muted-foreground text-sm py-4 text-center">ยังไม่มีข้อมูลหัวข้อสัมภาษณ์</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log Table */}
        <div className="w-full">
          <Card className="shadow-card border-border h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg cn-font-heading">บันทึกประวัติการใช้งานระบบ (Audit Log)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[800px]">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">ชื่อผู้ใช้</th>
                      <th className="px-4 py-3 font-medium">หัวข้อ / ตำแหน่ง</th>
                      <th className="px-4 py-3 font-medium">วัน-เวลา</th>
                      <th className="px-4 py-3 font-medium">ระยะเวลา</th>
                      <th className="px-4 py-3 font-medium rounded-tr-lg text-right">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInterviews.map((interview) => (
                      <tr key={interview.id} className="border-b last:border-0 border-border hover:bg-accent/5 transition-colors">
                        <td className="px-4 py-4 font-medium text-heading flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                            {interview.user?.name ? interview.user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          {interview.user?.name || "ผู้ใช้ไม่ระบุตัวตน"}
                        </td>
                        <td className="px-4 py-4 text-body">{interview.position}</td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {new Intl.DateTimeFormat('th-TH', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(interview.createdAt))}
                        </td>
                        <td className="px-4 py-4 text-body">
                          {interview.duration ? `${Math.floor(interview.duration / 60)} นาที ${interview.duration % 60} วินาที` : "N/A"}
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
                    {recentInterviews.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                          ไม่พบประวัติการสัมภาษณ์ล่าสุด
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
    </div>
  );
}
