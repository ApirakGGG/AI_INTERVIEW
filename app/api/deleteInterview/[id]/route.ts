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

  if (!userId) return NextResponse.json({ error: "Unauthorized" });
  if (req.method !== "DELETE")
    return NextResponse.json({ error: "Method Not Allowed" });

  try {
    // ลบ
    const delInterview = await prisma.interview.deleteMany({
      where: { id: params.id, userId: userId },
    });
    // ถ้าid ผิด หรือid ไม่ตรงก็ลบไม่ได้
    if (delInterview.count === 0) {
      return NextResponse.json(
        { error: "Record not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
