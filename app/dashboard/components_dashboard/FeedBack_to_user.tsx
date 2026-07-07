import { cn } from "@/lib/utils";
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
  const communicationScore =
    (latestInterview?.score as any)?.Communication || 0;
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
            ทักษะแต่ละด้าน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skills row */}
          <div className=" sm:grid gap-4 justify-between bg-amber-50 border border-amber-100 p-4 rounded-lg">
            <div className="sm:grid sm:grid-cols-3 flex flex-row gap-4 items-center justify-between">
              {/* Technical */}
              <div className="p-3 border rounded-lg text-center gap-3">
                <span className="text-sm font-medium text-slate-700">
                  Technical
                </span>
                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg font-bold text-sm min-w-10 text-center">
                  {(technicalScore / 10).toFixed(1)}
                </span>
              </div>
              {/* Communication */}
              <div className="p-3 border rounded-lg text-center gap-3">
                <span className="text-sm font-medium text-slate-700">
                  Communication
                </span>
                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg font-bold text-sm min-w-10 text-center">
                  {(communicationScore / 10).toFixed(1)}
                </span>
              </div>
              {/* Logic */}
              <div className="p-3 border rounded-lg text-center gap-3">
                <span className="text-sm font-medium text-slate-700">
                  Logic
                </span>
                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg font-bold text-sm min-w-10 text-center">
                  {(logicScore / 10).toFixed(1)}
                </span>
              </div>
            </div>
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
