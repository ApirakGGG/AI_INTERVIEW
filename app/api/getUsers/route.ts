import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server"; 
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export async function GET(req: Request) {
  const { userId } = await auth();

  // !user id ห้ามเข้า
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" });
  }

  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


