import { Mic, History, Star, Award, Clock } from "lucide-react";
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
import { LearningActivities } from "./components_dashboard/LearningActivities";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { userId } = await auth();
  console.log(`userId`, userId);
  if (!userId) return null;

  // userdb
  const user = await prisma.user.findUnique({
    where: { clerkId: userId as string },
    include: { interviews: true },
  });

  // console.log(`user:`, user);

  //   ดึงข้อมูลจากฐานข้อมูล
  const interviews = await prisma.interview.findMany({
    where: { userId: userId as string },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // ดึงประวัติทั้งหมดเพื่อทำกิจกรรมการเรียนรู้
  const allInterviews = await prisma.interview.findMany({
    where: { userId: userId as string },
    select: {
      createdAt: true,
      duration: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  //   จำนวนการสัมภาษณ์ทั้งหมด
  const totalCountInterviews = await prisma.interview.count({
    where: { userId: userId as string },
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

  // ตั้งเวลา 3 เวลา
  function getTimeOfDay(
    date: Date = new Date(),
  ): "สวัสดีตอนเช้า" | "สวัสดีตอนบ่าย" | "สวัสดีตอนเย็น" {
    const hours = date.getHours(); //เวลาเป็นชั่วโมง

    if (hours >= 6 && hours < 12) {
      return "สวัสดีตอนเช้า";
    } else if (hours >= 12 && hours < 18) {
      return "สวัสดีตอนบ่าย";
    } else {
      return "สวัสดีตอนเย็น";
    }
  }

  // เวลาปัจจุบัน
  const currentDate = getTimeOfDay();
  // console.log(`time : ${currentDate}`);

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      {/*  Header & Welcome */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentDate}</h1>
          <h1 className="text-2xl tracking-tight">{user?.name}</h1>
          <p className="text-muted-foreground">
            คุณทำการสัมภาษณ์แล้ว{" "}
            <span className="text-red-600">{totalCountInterviews}</span> ครั้ง
          </p>
        </div>

        <div className="flex gap-2">
          {/*stake fire */}
          <Button
            asChild
            variant={"outline"}
            className=" text-red-600 px-6 py-5 w-50px rounded-xl font-medium shadow-lg flex items-center gap-2"
          >
            <Link href="#" className="flex items-center gap-2">
              {levelInfo.next > 0
                ? `อีก ${levelInfo.next} ครั้งเพื่อเลื่อนระดับ 🔥`
                : "คุณอยู่ในระดับสูงสุดแล้ว!"}
            </Link>
          </Button>

          {/* back to interview */}
          <Button
            asChild
            className="bg-indigo-600 w-50px hover:bg-indigo-700 text-white px-6 py-5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Link href="/interview" className="flex items-center gap-2">
              <Mic size={18} />
              เริ่มสัมภาษณ์ใหม่
            </Link>
          </Button>
        </div>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Feedback & Skills */}
          <FeedBackToUser
            data={avgScore as number}
            latestInterview={interviews[0]}
          />
          {/* Learning Activities */}
          <LearningActivities interviews={allInterviews} />
        </div>

        {/* Right Side (1 col) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-fit">
          <RecentInterviewsTable data={interviews} />
        </div>
      </div>
    </div>
  );
}
