"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

type Props = {
  timelineData: { date: string; interviews: number }[];
  topicData: { topic: string; score: number }[];
  levelData: { name: string; value: number }[];
};

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"]; // Orange semantics

export function AdminGraphsView({ timelineData, topicData, levelData }: Props) {
  return (
    <div className="space-y-6">
      
      {/* Line Chart: Interviews over time */}
      <Card className="shadow-card border-border bg-card">
        <CardHeader>
          <CardTitle className="cn-font-heading text-heading">Interview Engagement Timeline</CardTitle>
          <CardDescription>Number of interviews attempted natively over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="interviews" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  activeDot={{ r: 8, fill: "#ea580c" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No timeline data available</div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart: Scores by Topic */}
        <Card className="shadow-card border-border bg-card">
          <CardHeader>
            <CardTitle className="cn-font-heading text-heading">Average Scores by Topic</CardTitle>
            <CardDescription>Comparing aggregate user performance across positions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="topic" type="category" stroke="#64748b" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="score" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No score data available</div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart: Level Distribution */}
        <Card className="shadow-card border-border bg-card">
          <CardHeader>
            <CardTitle className="cn-font-heading text-heading">Candidate Level Distribution</CardTitle>
            <CardDescription>Breakdown by application seniority levels.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {levelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {levelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No level data available</div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
