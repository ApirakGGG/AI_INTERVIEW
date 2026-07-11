import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AdminGraphsView } from "./AdminGraphsView";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const dynamic = "force-dynamic";

export default async function AdminDetailedDashboardPage() {
  const allInterviews = await prisma.interview.findMany({
    select: {
      createdAt: true,
      averageScore: true,
      position: true,
      level: true,
    },
    orderBy: { createdAt: "asc" }
  });

  // Aggregation 1: Timeline of Interviews Over Time (Group by day)
  const timelineMap: Record<string, number> = {};
  allInterviews.forEach((interview) => {
    const d = new Date(interview.createdAt);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`; // format: M/D
    timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;
  });
  const timelineData = Object.keys(timelineMap).map(key => ({
    date: key,
    interviews: timelineMap[key]
  }));

  // Aggregation 2: Average Score By Topic
  const topicMap: Record<string, { total: number; count: number }> = {};
  allInterviews.forEach((interview) => {
    const pos = interview.position.substring(0, 15) || "General";
    if (!topicMap[pos]) topicMap[pos] = { total: 0, count: 0 };
    topicMap[pos].total += interview.averageScore || 0;
    topicMap[pos].count += 1;
  });
  const topicChartData = Object.keys(topicMap).map(key => ({
    topic: key,
    score: Math.round(topicMap[key].total / topicMap[key].count)
  })).sort((a, b) => b.score - a.score);

  // Aggregation 3: Level Distribution
  const levelMap: Record<string, number> = {};
  allInterviews.forEach((interview) => {
    const level = interview.level || "Unknown";
    levelMap[level] = (levelMap[level] || 0) + 1;
  });
  const levelData = Object.keys(levelMap).map(key => ({
    name: key,
    value: levelMap[key]
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold cn-font-heading text-heading mb-2">Detailed Graph Analytics</h1>
        <p className="text-muted-foreground text-sm">Comprehensive platform summary charts and metric visualizations.</p>
      </div>

      <AdminGraphsView 
        timelineData={timelineData} 
        topicData={topicChartData} 
        levelData={levelData} 
      />
    </div>
  );
}
