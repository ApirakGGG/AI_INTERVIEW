import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Link from "next/link";
import { ChevronLeft, History, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

import { StatsCard } from "@/app/dashboard/components_dashboard/StatsCard";
import { formatTime } from "@/lib/formatTime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: clerkId } = await params;

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { interviews: { orderBy: { createdAt: 'desc' } } },
  });

  if (!user) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold text-heading">User Not Found</h2>
        <p className="text-muted-foreground">The specified user does not exist in the database.</p>
        <Button asChild variant="outline">
          <Link href="/admin/users">Return to Directory</Link>
        </Button>
      </div>
    );
  }

  // Aggregate user stats
  const totalInterviews = user.interviews.length;
  const avgScore = totalInterviews > 0 
    ? Math.round(user.interviews.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / totalInterviews)
    : 0;
  const totalPracticeTime = user.interviews.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const displayTime = formatTime(totalPracticeTime);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/users" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-3">
            <ChevronLeft className="size-4 mr-1" /> Back to Members
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold cn-font-heading text-heading">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <div className="w-1 h-1 rounded-full bg-border" />
                <Badge variant="outline" className="text-xs bg-muted/50">{user.role}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Sessions"
          value={totalInterviews.toString()}
          icon={<History className="size-5" />}
          description={`Joined ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))}`}
          intent="primary"
        />
        <StatsCard
          title="Average Score"
          value={`${avgScore}/100`}
          icon={<Star className="size-5" />}
          description={totalInterviews > 0 ? "Overall performance metric" : "No data available"}
          intent="secondary"
        />
        <StatsCard
          title="Total Practice Time"
          value={`${displayTime}`}
          icon={<Clock className="size-5" />}
          description="Cumulative audio processing time"
          intent="accent"
        />
      </div>

      {/* Interview History Table (Full Width) */}
      <div className="w-full mt-8">
        <Card className="shadow-card border-border h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg cn-font-heading">Detailed Interview History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[700px]">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">Topic Position</th>
                    <th className="px-4 py-3 font-medium">Level</th>
                    <th className="px-4 py-3 font-medium">Date Completed</th>
                    <th className="px-4 py-3 font-medium">Duration</th>
                    <th className="px-4 py-3 font-medium text-center">Score</th>
                    <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.interviews.map((interview) => (
                    <tr key={interview.id} className="border-b last:border-0 border-border hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-4 font-bold text-heading">
                        {interview.position || "Custom Topic"}
                      </td>
                      <td className="px-4 py-4 text-body">
                        {interview.level || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(interview.createdAt))}
                      </td>
                      <td className="px-4 py-4 text-body">
                        {interview.duration ? `${Math.floor(interview.duration / 60)}m ${interview.duration % 60}s` : "N/A"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`font-bold text-sm px-3 py-1 rounded-md border ${
                          (interview.averageScore || 0) >= 70 
                            ? "text-badge-text bg-badge-bg border-badge-border" 
                            : "text-muted-foreground bg-muted border-border"
                        }`}>
                          {Math.round(interview.averageScore || 0)}/100
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Badge 
                          variant={interview.status === "completed" ? "default" : "secondary"}
                          className={interview.status === "completed" 
                            ? "bg-badge-bg text-badge-text border-badge-border" 
                            : "bg-muted text-muted-foreground"
                          }
                        >
                          {interview.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {user.interviews.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        This user hasn't completed any interviews yet.
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
