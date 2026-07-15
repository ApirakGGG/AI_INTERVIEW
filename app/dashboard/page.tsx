import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Link from "next/link";
import { Mic, History, Star, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

import { StatsCard } from "./components_dashboard/StatsCard";
import { RecentInterviewsTable } from "./components_dashboard/InterviewTable";
import { getlevelInfo } from "@/lib/getlevelInfo";
import { formatTime } from "@/lib/formatTime";
import RadarCharts from "./components_dashboard/Chart";
import FeedBackToUser from "./components_dashboard/FeedBack_to_user";
import { LearningActivities } from "./components_dashboard/LearningActivities";
import TermsModalWrapper from "./components_dashboard/TermsModalWrapper";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Aggregate user data and basic stats
  const user = await prisma.user.findUnique({
    where: { clerkId: userId as string },
    include: { interviews: true },
  });

  const aggregate = await prisma.interview.aggregate({
    where: { userId },
    _avg: { averageScore: true },
    _sum: { duration: true },
    _count: { id: true },
  });

  const totalInterviews = aggregate._count.id;
  const avgScore = aggregate._avg.averageScore ? Math.round(aggregate._avg.averageScore) : 0;
  const totalPracticeTime = aggregate._sum.duration || 0;
  const displayTime = formatTime(totalPracticeTime);

  // Fetch recent interviews
  const recentInterviews = await prisma.interview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Calculate Last Week's diff
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const interviewsLastWeek = await prisma.interview.count({
    where: { userId, createdAt: { gte: lastWeek } },
  });

  // Learning Activities Data
  const allInterviews = await prisma.interview.findMany({
    where: { userId },
    select: { createdAt: true, duration: true },
    orderBy: { createdAt: "asc" },
  });

  // Level Info
  const levelInfo = getlevelInfo(totalInterviews);

  // Greeting logic
  function getTimeOfDay(date: Date = new Date()): "สวัสดีตอนเช้า" | "สวัสดีตอนบ่าย" | "สวัสดีตอนเย็น" {
    const hours = date.getHours();
    if (hours >= 6 && hours < 12) return "สวัสดีตอนเช้า";
    else if (hours >= 12 && hours < 18) return "สวัสดีตอนบ่าย";
    else return "สวัสดีตอนเย็น";
  }
  const greeting = getTimeOfDay();

  const chartData = recentInterviews.map((interview) => ({
    subject: interview.position.substring(0, 15) || "General",
    A: Math.round(interview.averageScore || 0),
    fullMark: 100,
  }));

  return (
    <div className="p-6 md:p-10 space-y-8 bg-background min-h-[calc(100vh-64px)] relative">
      <TermsModalWrapper />

      {/* Welcome Banner */}
      <div className="bg-card p-8 rounded-2xl shadow-card border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight cn-font-heading text-heading">
            {greeting}
          </h1>
          <h2 className="text-2xl mt-1 tracking-tight text-heading font-medium">{user?.name}</h2>
          <p className="text-muted-foreground mt-3">
            คุณทำการสัมภาษณ์ไปแล้ว <span className="text-primary font-bold">{totalInterviews}</span> ครั้ง
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
          {/* Level Info Button */}
          <Button
            asChild
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/5 px-6 py-6 rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Link href="#">
              {levelInfo.next > 0
                ? `อีก ${levelInfo.next} ครั้งเพื่อเลื่อนระดับ 🔥`
                : "คุณอยู่ในระดับสูงสุดแล้ว! 🎉"}
            </Link>
          </Button>

          {/* Primary Action */}
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold py-6 px-8 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Link href="/interview">
              <Mic size={18} />
              เริ่มสัมภาษณ์ใหม่
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="สัมภาษณ์ทั้งหมด"
          value={totalInterviews.toString()}
          icon={<History className="size-5" />}
          description={`+${interviewsLastWeek} จากสัปดาห์ที่แล้ว`}
          intent="primary"
        />
        <StatsCard
          title="คะแนนเฉลี่ย"
          value={`${avgScore}/100`}
          icon={<Star className="size-5" />}
          description={avgScore >= 50 ? "ทำได้ดีมาก 🚀" : "ต้องฝึกฝนเพิ่มเติม 💪"}
          intent="secondary"
        />
        <StatsCard
          title="เวลาฝึกรวม"
          value={`${displayTime}`}
          icon={<Clock className="size-5" />}
          description={`รวมทั้งหมด ${displayTime}`}
          intent="accent"
        />
        <StatsCard
          title={levelInfo.label || "Level"}
          value="Intermediate"
          icon={<Award className={`size-5 text-current`} />}
          description={
            levelInfo.next > 0
              ? `อีก ${levelInfo.next} ครั้งเพื่อเลื่อนระดับ`
              : "ระดับสุงสุด!"
          }
          intent="outline"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          <FeedBackToUser
            data={avgScore as number}
            latestInterview={recentInterviews[0]}
          />
          <LearningActivities interviews={allInterviews} />
          <RadarCharts data={chartData} />
        </div>
        
        {/* Right Side (1 col) */}
        <div className="bg-card rounded-2xl shadow-card border border-border h-fit">
          <RecentInterviewsTable data={recentInterviews} />
        </div>
      </div>
    </div>
  );
}
