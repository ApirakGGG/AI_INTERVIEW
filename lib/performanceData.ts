import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
export const performanceData = async () => {
  const { userId } = await auth();
  if (userId) return null;

  //   ข้อมูลการสัมภาษณ์
  const interviews = await prisma.interview.findMany({
    where: { userId: userId as any },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const dataAll = interviews.map((interview) => ({
    subject: interview.position.substring(0,15),
    score: interview.averageScore || 0,
    fullScore: 100,
  }));
  return dataAll
};
