import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
export default function FeedBackToUser({ data: avgScore, latestInterview }: { data: number; latestInterview?: any }) {
    return (
<>
{/*  AI Insights & Suggestions (Right - 4 Cols) */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Technical Knowledge</span>
              <span className="font-bold">70%</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
            <h4 className="text-amber-800 font-semibold text-sm flex items-center gap-2">
              <MessageSquare size={16} />
              สิ่งที่ควรปรับปรุงด่วน
            </h4>
            <p className="text-amber-700 text-sm mt-1 line-clamp-3">
              {/* ตัวอย่าง */}
              {/* คุณมักจะประหม่าเมื่อเจอคำถามเกี่ยวกับ "System Design"
                แนะนำให้ฝึกพูดอธิบาย Flow การทำงานให้ช้าลง */}
              {latestInterview?.feedback}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg text-center">
              <p className="text-2xl font-bold">{avgScore}/10</p>
              <p className="text-xs text-muted-foreground">คะแนน</p>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <p className="text-xs text-muted-foreground">
                มีการพูด (เอ่อ/อา){" "}
                <span
                  className={cn(`font-bold`, {
                    "text-red-500":
                      (latestInterview?.score as any)?.fillerLevel === "High",
                    "text-green-600":
                      (latestInterview?.score as any)?.fillerLevel === "Low",
                  })}
                >
                  {(latestInterview?.score as any)?.fillerLevel || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
</>
    )
}