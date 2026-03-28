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
export default function FeedBackToUser({
  data: avgScore,
  latestInterview,
}: {
  data: number;
  latestInterview?: any;
}) {
  // คิดคะแนนรวม
  const technicalScore = (latestInterview?.score as any)?.Technical || 0;
  // คะแนนเต็ม
  const max = 100;
  // คำนวณเป็นเปอร์เซ็นต์
  const Percent = Math.round((technicalScore / max) * 100);
  // communication
  const communicationScore = (latestInterview?.score as any)?.Communication || 0;
  const communicationPercent = Math.round((communicationScore / max) * 100);

    const logicScore = (latestInterview?.score as any)?.Logic || 0;
  const logicPercent = Math.round((logicScore / max) * 100);
  // console.log("Percent:", Percent);
  // console.log("Latest Interview Object:", latestInterview);
  // console.log("Score Object:", latestInterview?.score);
  // console.log("Technical Value:", (latestInterview?.score as any)?.Technical);

  return (
    <>
      {/*  AI Insights & Suggestions (Right - 4 Cols) */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            คำแนะนำในแต่ละด้าน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Technical Knowledge */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Technical Knowledge</span>
              <span className="font-bold">{Percent}%</span>
            </div>
            <Progress
              value={Percent}
              className={cn(
                "h-2",
                Percent < 50 ? "bg-red-100" : "bg-green-100",
              )}
            />
          </div>
           {/* Comnication*/}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Comnication</span>
              <span className="font-bold">{communicationPercent}%</span>
            </div>
            <Progress
              value={communicationPercent}
              className={cn(
                "h-2",
                communicationPercent < 50 ? "bg-red-100" : "bg-green-100",
              )}
            />
          </div>
           {/* Logic*/}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Logic</span>
              <span className="font-bold">{logicPercent}%</span>
            </div>
            <Progress
              value={logicPercent}
              className={cn(
                "h-2",
                logicPercent < 50 ? "bg-red-100" : "bg-green-100",
              )}
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
            <h4 className="text-amber-800 font-semibold text-sm flex items-center gap-2">
              <MessageSquare size={16} />
              คำแนะนำ
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
              <p className="text-2xl font-bold">{avgScore}/100</p>
              <p className="text-xs text-muted-foreground">คะแนน</p>
            </div>
            <div className="p-3 border rounded-lg text-center items-center">
              <span
                className={cn(`font-bold`, {
                  "text-red-500":
                    (latestInterview?.score as any)?.fillerLevel === "High",
                  "text-green-600":
                    (latestInterview?.score as any)?.fillerLevel === "Low",
                })}
              >
                {(latestInterview?.score as any)?.fillerLevel || "0"}
              </span>
              <p className="text-xs text-muted-foreground text-center">
                มีการพูด (เอ่อ/อา){" "}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
