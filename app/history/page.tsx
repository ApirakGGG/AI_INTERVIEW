import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // ดึงประวัติทั้งหมด เรียงจากใหม่ไปเก่า
  const interviews = await prisma.interview.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">ประวัติการสัมภาษณ์</h1>
          <p className="text-muted-foreground">รวมการฝึกซ้อมทั้งหมดของคุณที่ผ่านมา</p>
        </div>
        <Badge variant="outline" className="text-sm py-1 px-4">
          ทั้งหมด {interviews.length} รายการ
        </Badge>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[300px]">ตำแหน่ง / ข้อมูล</TableHead>
              <TableHead>วันที่ฝึก</TableHead>
              <TableHead>ระยะเวลา</TableHead>
              <TableHead>คะแนนรวม</TableHead>
              <TableHead className="text-right">รายละเอียด</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                  ยังไม่มีประวัติการฝึกซ้อม เริ่มต้นสัมภาษณ์ครั้งแรกของคุณเลย!
                </TableCell>
              </TableRow>
            ) : (
              interviews.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{item.position || "ไม่ได้ระบุตำแหน่ง"}</span>
                      <span className="text-xs text-muted-foreground uppercase">{item.level || "General"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} />
                      {new Date(item.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric', month: 'short', year: '2-digit'
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={14} />
                      {Math.floor((item.duration || 0) / 60)} นาที
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* ดึงคะแนนจากฟิลด์ JSON ที่คุณเก็บไว้ */}
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${(item.score as any)?.total >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                        {(item.score as any)?.total || 0}
                      </span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/history/${item.id}`}>
                      <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                        ดูผลวิเคราะห์ <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}