import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard/page";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

export default async function Page() {
  const { userId } = await auth(); // clerkId

  if (!userId) {
    redirect("/sign-in")
  }

  // ค้นหาข้อมูลผู้ใช้ใน Supabase ที่ตรงกับ clerkId 
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { interviews: true } // ดึงข้อมูลการสัมภาษณ์มาด้วย
  });

  return (
    <div className="mx-auto">
      {/* <h1>สวัสดีคุณ {dbUser?.name}</h1>
      <p>คุณสัมภาษณ์ไปแล้ว {dbUser?.interviews.length} ครั้ง</p> */}
      <main className="p-4">
        <Dashboard />
      </main>
    </div>
  );
}