import { Calendar, Clock, ChevronRight } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const totalInterviews = await prisma.interview.findMany({
    where: { userId: userId as any },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">ประวัติการสัมภาษณ์</h1>
          <p className="text-muted-foreground">
            รวมการฝึกซ้อมทั้งหมดของคุณที่ผ่านมา
          </p>
        </div>
        <Badge variant="outline" className="text-sm py-1 px-4">
          ทั้งหมด {totalInterviews.length} รายการ
        </Badge>
      </div>
      {/* Body */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* ...กกก */}
      </div>
    </div>
  );
}
