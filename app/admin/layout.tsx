import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { redirect } from "next/navigation";
import Forbidden403 from "@/components/Forbidden403";
import AdminSidebar from "./AdminSidebar";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true, name: true }
  });

  if (user?.role !== "ADMIN") {
    return <Forbidden403 />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#faf8f5] flex flex-col md:flex-row w-full">
      <AdminSidebar userName={user?.name || "ผู้ดูแลระบบ"} />
      <div className="flex-1 w-full min-w-0 p-6 md:p-8 lg:p-10 relative">
        {children}
      </div>
    </div>
  );
}
