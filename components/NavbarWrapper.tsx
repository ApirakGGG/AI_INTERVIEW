import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Navbar from "./Navbar";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export default async function NavbarWrapper() {
  const { userId } = await auth();
  let isAdmin = false;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    if (user?.role === "ADMIN") {
      isAdmin = true;
    }
  }

  return <Navbar isAdmin={isAdmin} />;
}
