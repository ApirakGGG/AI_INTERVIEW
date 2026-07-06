import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server"; 
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = await auth();
  // userdb
  const userRole = await prisma.user.findUnique({
    where: { id: params.id, clerkId: userId as string, role: "ADMIN" },
  });

  if (!userId) return NextResponse.json({ error: "Unauthorized" });
  // กันถ้าไม่ใช้ Admin
  if (userRole?.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" });
  if (req.method !== "DELETE")
    return NextResponse.json({ error: "Method Not Allowed" });

  try {
    // ลบ
    const user = await prisma.user.delete({
      where: { id: params.id },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
