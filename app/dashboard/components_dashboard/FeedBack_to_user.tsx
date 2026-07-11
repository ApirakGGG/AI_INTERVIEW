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
      <Card className="lg:col-span-4 bg-card shadow-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 cn-font-heading text-lg">
            <TrendingUp className="text-primary size-5" />
            Skills Analysis
          </CardTitle>
          <CardDescription>Detailed overview of your conversational domains.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skills row */}
          <div className="bg-background border border-border p-5 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-between">
              {/* Technical */}
              <div className="p-4 border border-border bg-card rounded-xl text-center flex flex-col gap-2 shadow-sm">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Technical
                </span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-md font-bold text-lg mx-auto min-w-[60px] text-center">
                  {(technicalScore / 10).toFixed(1)}
                </span>
              </div>
              {/* Communication */}
              <div className="p-4 border border-border bg-card rounded-xl text-center flex flex-col gap-2 shadow-sm">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Communication
                </span>
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-md font-bold text-lg mx-auto min-w-[60px] text-center">
                  {(communicationScore / 10).toFixed(1)}
                </span>
              </div>
              {/* Logic */}
              <div className="p-4 border border-border bg-card rounded-xl text-center flex flex-col gap-2 shadow-sm">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Logic
                </span>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-md font-bold text-lg mx-auto min-w-[60px] text-center">
                  {(logicScore / 10).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl shadow-sm">
            <h4 className="text-heading font-bold text-base flex items-center gap-2">
              <MessageSquare className="text-primary size-5" />
              AI Feedback & Suggestions
            </h4>
            <p className="text-body text-sm mt-3 leading-relaxed">
              {/* ตัวอย่าง */}
              {/* คุณมักจะประหม่าเมื่อเจอคำถามเกี่ยวกับ "System Design"
                แนะนำให้ฝึกพูดอธิบาย Flow การทำงานให้ช้าลง */}
              {latestInterview?.feedback}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 border border-border bg-background rounded-xl text-center shadow-sm">
              <p className="text-3xl font-bold cn-font-heading text-heading">{avgScore}<span className="text-lg text-muted-foreground font-medium">/100</span></p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Overall Score</p>
            </div>
            <div className="p-5 border border-border bg-background rounded-xl text-center shadow-sm flex flex-col justify-center items-center">
              <span
                className={cn(`text-2xl font-bold cn-font-heading`, {
                  "text-destructive":
                    (latestInterview?.score as any)?.fillerLevel === "High",
                  "text-badge-text":
                    (latestInterview?.score as any)?.fillerLevel === "Low",
                })}
              >
                {(latestInterview?.score as any)?.fillerLevel || "N/A"}
              </span>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1 text-center">
                Filler Words Usage
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
