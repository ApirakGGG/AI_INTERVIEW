import {
  Mic,
  History,
  Star,
  Award,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "./components_dashboard/StatsCard";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { RecentInterviewsTable } from "./components_dashboard/InterviewTable";
import { Button } from "@/components/ui/button";
import { getlevelInfo } from "@/lib/getlevelInfo";
import { formatTime } from "@/lib/formatTime";
// import { performanceData, historyData } from "@/lib/mockData/mockdata";
import RadarCharts from "./components_dashboard/Chart";
import FeedBackToUser from "./components_dashboard/FeedBack_to_user";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) return null;

  //   ดึงข้อมูลจากฐานข้อมูล
  const interviews = await prisma.interview.findMany({
    where: { userId: userId as any },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  //   จำนวนการสัมภาษณ์ทั้งหมด
  const totalCountInterviews = await prisma.interview.count({
    where: { userId: userId as any },
  });
  // คำนวณคะแนนเฉลี่ย
  const aggregate = await prisma.interview.aggregate({
    where: {
      userId,
    },
    _avg: {
      averageScore: true,
    },
  });
  const avgScore = Math.round(aggregate._avg.averageScore || 0);

  // เปรียบเทียบกับสัปดาห์ที่แล้ว
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const interviewsLastWeek = await prisma.interview.count({
    where: { userId, createdAt: { gte: lastWeek } },
  });

  // เวลาฝึกรวม
  const totalPracticeTime = await prisma.interview.aggregate({
    where: { userId },
    _sum: {
      duration: true,
    },
  });

  // เวลารวมในการสัมภาษณ์
  const totalTime = totalPracticeTime._sum.duration || 0;
  //  format time
  const displayTime = formatTime(totalTime);

  // ระดับการสัมภาษณ์
  const levelInfo = getlevelInfo(totalCountInterviews);

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      {/*  Header & Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            ยินดีต้อนรับกลับมา! มาดูความก้าวหน้าในการสัมภาษณ์ของคุณ
          </p>
        </div>
        {/* back to interview */}
        <Button asChild
          className="bg-indigo-600 w-50px hover:bg-indigo-700 text-white px-6 py-5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Link href="/interview" className="flex items-center gap-2">
            <Mic size={18} />
            เริ่มสัมภาษณ์ใหม่
          </Link>
        </Button>
      </div>

      {/*  Overview Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="สัมภาษณ์ทั้งหมด"
          value={totalCountInterviews.toString()}
          icon={<History />}
          description={`+${interviewsLastWeek} จากสัปดาห์ที่แล้ว`}
        />
        <StatsCard
          title="คะแนนเฉลี่ย"
          value={avgScore.toString()}
          icon={<Star />}
          description={avgScore > 50 ? "ทำได้ดีมาก" : "ปรับปรุง"}
        />
        <StatsCard
          title="เวลาฝึกรวม"
          value={`${displayTime}`}
          icon={<Clock />}
          description={`เวลาที่ใช้ทั้งหมดคือ ${displayTime}`}
        />
        <StatsCard
          title={levelInfo.label}
          value="Intermediate"
          icon={<Award className={`${levelInfo.color}`} />}
          description={
            levelInfo.next > 0
              ? `อีก ${levelInfo.next} ครั้งเพื่อเลื่อนระดับ`
              : "คุณอยู่ในระดับสูงสุดแล้ว!"
          }
        />
      </div>

      {/* charts */}
      {/* <RadarCharts /> */}

      {/* Feedback */}
      <FeedBackToUser data={avgScore as number} latestInterview={interviews[0]} />

      {/*  Interviews Table ล่าสุด */}
      <RecentInterviewsTable data={interviews} />
    </div>
  );
}
