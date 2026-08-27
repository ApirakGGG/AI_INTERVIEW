import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { interviews: true },
      },
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold cn-font-heading text-heading mb-2">รายชื่อสมาชิกผู้ใช้งาน</h1>
        <p className="text-muted-foreground text-sm">ดูข้อมูลและจัดการผู้ใช้ทั้งหมดที่ลงทะเบียนในระบบ</p>
      </div>

      <div className="w-full">
        <Card className="shadow-card border-border h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg cn-font-heading">ผู้ใช้ทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">ชื่อผู้ใช้</th>
                    <th className="px-4 py-3 font-medium">อีเมล</th>
                    <th className="px-4 py-3 font-medium">สิทธิ์การใช้งาน</th>
                    <th className="px-4 py-3 font-medium">วันที่สมัครสมาชิก</th>
                    <th className="px-4 py-3 font-medium">จำนวนสัมภาษณ์ทั้งหมด</th>
                    <th className="px-4 py-3 font-medium rounded-tr-lg text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0 border-border hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-4 font-medium text-heading flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        {u.name}
                      </td>
                      <td className="px-4 py-4 text-body truncate max-w-[200px]">{u.email}</td>
                      <td className="px-4 py-4">
                        <Badge 
                          variant={u.role === "ADMIN" ? "default" : "secondary"}
                          className={u.role === "ADMIN" 
                            ? "bg-badge-bg text-badge-text border-badge-border" 
                            : "bg-muted text-muted-foreground border-border"
                          }
                        >
                          {u.role === "ADMIN" ? "ผู้ดูแลระบบ" : "สมาชิกผู้ใช้งาน"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Intl.DateTimeFormat('th-TH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(u.createdAt))}
                      </td>
                      <td className="px-4 py-4 text-body font-bold text-center">
                        {u._count.interviews}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link 
                          href={`/admin/users/${u.clerkId}`}
                          className="text-primary hover:text-primary-hover font-semibold hover:underline decoration-primary/30 underline-offset-4 transition-all"
                        >
                          ดูรายละเอียด
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        ไม่พบข้อมูลผู้ใช้ในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
