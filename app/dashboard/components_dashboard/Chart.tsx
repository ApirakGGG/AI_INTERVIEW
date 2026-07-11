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
export default function RadarCharts({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 w-full mt-8">
      {/*  Skill Radar Chart */}
      <Card className="bg-card shadow-card border border-border">
        <CardHeader>
          <CardTitle className="cn-font-heading text-heading">Skill Analysis</CardTitle>
          <CardDescription>วิเคราะห์จุดแข็งและจุดอ่อนของคุณ</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#64748b" }} />
              <Radar
                name="User"
                dataKey="A"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
