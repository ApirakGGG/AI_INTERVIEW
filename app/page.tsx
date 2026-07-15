import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import TermsModalWrapper from "@/app/dashboard/components_dashboard/TermsModalWrapper";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  ChartNoAxesCombined,
  Sparkles,
  Users,
  Goal,
  Target,
  Brain,
  ArrowRight,
} from "lucide-react";

// Initialize Prisma
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const ibmPlex = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "600", "700"],
  subsets: ["thai", "latin"],
});

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const { userId } = await auth();

  // If already logged in, go directly to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  // Fetch real-time data from database
  const userCount = await prisma.user.count();
  const aggregate = await prisma.interview.aggregate({
    _avg: { averageScore: true },
    _count: { id: true },
  });

  // Fetch true User Images from Clerk
  let recentUserAvatars: string[] = [];
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({ limit: 3 });
    recentUserAvatars = users.data.map((u) => u.imageUrl).filter(Boolean);
  } catch (error) {
    console.error("Failed to load clerk images", error);
  }

  // Backup avatars if API limits or empty list
  const defaultAvatars = [
    "https://i.pravatar.cc/100?img=1",
    "https://i.pravatar.cc/100?img=2",
    "https://i.pravatar.cc/100?img=3",
  ];
  const avatarsToShow = [...recentUserAvatars, ...defaultAvatars].slice(0, 3);

  const totalInterviews = aggregate._count.id;
  // If there are no interviews, default to 92 for demo aesthetics
  const averageScore = aggregate._avg.averageScore
    ? Math.round(aggregate._avg.averageScore)
    : 92;

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num);

  return (
    <div className={`w-screen relative left-1/2 -translate-x-1/2 ${ibmPlex.className} -mt-8 overflow-hidden`}>
      <TermsModalWrapper />

      {/* ── Keyframe Animations ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
      `,
        }}
      />

      {/* ── HERO SECTION ── */}
      <section className="relative bg-slate-950 text-white pt-24 pb-32 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 flex justify-center overflow-hidden">
        {/* Background Gradients & Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 xl:gap-24 items-center w-full max-w-[2000px]">
          {/* Left Content */}
          <div className="flex flex-col items-start text-left space-y-8">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <Sparkles size={16} className="text-indigo-400" />
                <span className="text-sm font-medium text-slate-200">
                  สัมภาษณ์แล้ว{" "}
                  {formatNumber(totalInterviews > 0 ? totalInterviews : 12450)}{" "}
                  ครั้ง
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <ChartNoAxesCombined size={16} className="text-orange-400" />
                <span className="text-sm font-medium text-slate-200">
                  พึงพอใจ {averageScore}%
                </span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[1.15] font-bold tracking-tight text-white drop-shadow-xl">
              เตรียมความพร้อมสัมภาษณ์งาน
              <br />
              ด้วยพลังของ{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-indigo-400">
                AI
              </span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl max-w-xl leading-relaxed">
              จำลองสถานการณ์สัมภาษณ์เสมือนจริง โต้ตอบด้วยเสียง
              พร้อมวิเคราะห์จุดเด่นจุดด้อยและรับ Feedback
              แบบเรียลไทม์เพื่อพัฒนาตัวคุณให้พร้อมที่สุด
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
              <Link
                href="/sign-up"
                className="group relative inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-bold bg-white text-slate-950 hover:bg-slate-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105"
              >
                เริ่มพัฒนาตัวเองฟรี
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-semibold border border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition-colors text-slate-300"
              >
                ลงชื่อเข้าใช้
              </Link>
            </div>

            {/* Social Proof (Moved from Floating Card) */}
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-8 mt-4 border-t border-slate-800/50 w-full sm:max-w-md">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full bg-slate-300 border-[3px] border-slate-950 overflow-hidden shadow-lg z-30 relative transition-transform hover:scale-110 hover:z-40">
                  <img src={avatarsToShow[0]} alt="user 1" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-300 border-[3px] border-slate-950 overflow-hidden shadow-lg z-20 relative transition-transform hover:scale-110 hover:z-40">
                  <img src={avatarsToShow[1]} alt="user 2" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-300 border-[3px] border-slate-950 overflow-hidden shadow-lg z-10 relative transition-transform hover:scale-110 hover:z-40">
                  <img src={avatarsToShow[2]} alt="user 3" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-800 border-[3px] border-slate-950 flex items-center justify-center text-xs font-bold text-emerald-400 shadow-lg relative z-0">
                  +{formatNumber(userCount > 0 ? userCount : 5000)}
                </div>
              </div>
            
            </div>
            
          </div>
          

          {/* Right Content - Mock Dashboard */}
          <div className="relative w-full max-w-lg mx-auto lg:mr-0 animate-float pt-10 lg:pt-0">
            {/* Background Glow for Card */}
            <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] animate-pulse-glow rounded-[40px]" />

            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-[32px] p-6 shadow-2xl">
              {/* Fake UI Header */}
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="text-slate-400 text-xs font-mono font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                  AI_INTERVIEW_ANALYSIS
                </div>
              </div>

              {/* Main AI Image/Avatar Area */}
              <div className="relative h-56 rounded-2xl bg-linear-to-br from-indigo-900/50 via-slate-800/50 to-slate-900/50 border border-slate-700/50 flex flex-col items-center justify-center overflow-hidden mb-6 group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-tr from-emerald-400 to-indigo-500 p-[2px] mb-4 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="text-5xl">🤖</span>
                  </div>
                </div>
                {/* Voice bars */}
                <div className="flex items-end gap-1.5 h-6">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                      style={{
                        height: `${Math.max(20, Math.random() * 100)}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: "0.8s",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Fake Data Card */}
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-slate-200 font-bold mb-1">
                      ผลคะแนนล่าสุด
                    </h3>
                    <p className="text-emerald-400 font-medium text-sm">
                      การสื่อสารดีเยี่ยม ตรงประเด็น
                    </p>
                  </div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-indigo-400">
                    {averageScore}
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                  <div
                    className="bg-linear-to-r from-emerald-400 to-indigo-400 h-2 rounded-full"
                    style={{ width: `${averageScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── STEPS SECTION ── */}
      <section className="py-24 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 bg-white flex justify-center relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

        <div className="w-full max-w-[2000px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              เตรียมความพร้อมสู่ความสำเร็จใน 3 ขั้นตอน
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              ออกแบบกระบวนการฝึกฝนให้เหมือนสนามจริงมากที่สุด
              เพื่อลดความประหม่าและเพิ่มความมั่นใจในการสัมภาษณ์ของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Line for Desktop */}
            <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-slate-100 border-t-2 border-dashed border-slate-200" />

            {/* Step 1 */}
            <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-6">
                1
              </div>
              <div className="mt-8 flex flex-col items-center text-center">
                <Target size={36} className="text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  ระบุตำแหน่งที่ต้องการ
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  เลือกสายงาน ตำแหน่ง ระดับ (Junior/Senior) และวางอธิบายงาน (Job
                  Description) ตัวระบบจะสร้างคำถามให้ตรงจุดโดยอัตโนมัติ
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform -rotate-3 group-hover:-rotate-6">
                2
              </div>
              <div className="mt-8 flex flex-col items-center text-center">
                <Brain size={36} className="text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  สัมภาษณ์โต้ตอบเสมือนจริง
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  พูดโต้ตอบด้วยเสียงผ่านไมโครโฟน AI
                  จะทำหน้าที่เป็นผู้สัมภาษณ์ที่สามารถไล่ฟังสคริปต์และถามเจาะลึก(Deep
                  Dive) ได้เหมือนคนจริงๆ
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-6">
                3
              </div>
              <div className="mt-8 flex flex-col items-center text-center">
                <Goal size={36} className="text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  รับผลและคำแนะนำ
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  ดูคะแนนภาพรวม จุดที่คุณทำได้ดี และจุดที่ต้องแก้ไข
                  พร้อมรับแนวทางการตอบแบบ STAR Technique ให้คุณพร้อม 100%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
