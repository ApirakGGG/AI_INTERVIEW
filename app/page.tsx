import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

export default async function DashboardPage() {
  const { userId } = await auth(); // นี่คือ clerkId

  if (!userId) return <div>กรุณาล็อกอิน</div>;

  // ค้นหาข้อมูลผู้ใช้ใน Supabase ที่ตรงกับ clerkId 
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { interviews: true } // ดึงข้อมูลการสัมภาษณ์มาด้วย
  });

  return (
    <div>
      <h1>สวัสดีคุณ {dbUser?.name}</h1>
      <p>คุณสัมภาษณ์ไปแล้ว {dbUser?.interviews.length} ครั้ง</p>
    </div>
  );
}