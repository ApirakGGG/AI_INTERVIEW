'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { RecentInterviewsTable } from "./InterviewTable";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";  

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

export default async function ReacntInterviews() {
      //   ดึงข้อมูลจากฐานข้อมูล
  const { userId } = await auth();
  if(!userId) return null
  const interviews = await prisma.interview.findMany({
    where: { userId: userId as any },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ประวัติการสัมภาษณ์ล่าสุด</CardTitle>
            <CardDescription>
              รายการการทดสอบ 5 ครั้งล่าสุดของคุณ
            </CardDescription>
          </div>
          <Button
            className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
          >
            <Link href="/history">
            ดูทั้งหมด <ArrowUpRight size={14} />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {/* data components */}
          <RecentInterviewsTable data={interviews} />
        </CardContent>
      </Card>
    </>
  );
}
