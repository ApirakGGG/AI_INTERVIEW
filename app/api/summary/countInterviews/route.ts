import { useAuth } from "@clerk/nextjs";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export async function GET() {
  const { userId } = useAuth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" });

  try {
    const countInterview = await prisma.interview.count();
    console.log("จำนวนการสัมภาษณ์ทั้งหมด", countInterview);
    return NextResponse.json(countInterview);
  } catch (err) {
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
