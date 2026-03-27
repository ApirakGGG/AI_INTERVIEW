'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { performanceData } from "@/lib/performanceData";

export default async function RadarCharts() {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      {/*  Skill Radar Chart (Left - 3 Cols) */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Skill Analysis</CardTitle>
          <CardDescription>วิเคราะห์จุดแข็งและจุดอ่อนของคุณ</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {/* <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <Radar
                name="User"
                dataKey="A"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer> */}
        </CardContent>
      </Card>
    </div>
  );
}
