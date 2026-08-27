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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <AdminSidebar userName={user?.name || "ผู้ดูแลระบบ"} />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 relative">
        {children}
      </main>
    </div>
  );
}
