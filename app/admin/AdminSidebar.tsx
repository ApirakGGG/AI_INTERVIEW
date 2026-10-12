"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Settings, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: PieChart },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="w-full md:w-64 bg-card border-r border-border shadow-sm flex flex-col shrink-0">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold cn-font-heading text-heading">ระบบผู้ดูแลระบบ</h2>
        <p className="text-sm text-muted-foreground mt-1">เข้าสู่ระบบในชื่อ {userName}</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/8 text-primary" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-heading"
              )}
            >
              <item.icon className={cn("size-5", isActive ? "text-primary" : "")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
