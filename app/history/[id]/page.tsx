import { MessageSquare } from "lucide-react";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export default async function InterviewDetails({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const interview = await prisma.interview.findUnique({
    where: { id: id }
  });

  if (!interview) return <div>ไม่พบข้อมูล</div>;
   if (!interview.transcript) return <div>ไม่พบข้อมูล transcript</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* ส่วนหัว: สรุปคะแนน */}
      <section className="bg-white p-8 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">ผลการวิเคราะห์โดย AI</h2>
        <div className="grid grid-cols-3 gap-4">
          <ScoreBox label="ตรรกะ" score={(interview.score as any)?.Logic} />
          <ScoreBox label="เทคนิค" score={(interview.score as any)?.Technical} />
          <ScoreBox label="การสื่อสาร" score={(interview.score as any)?.Communication} />
        </div>
      </section>

      {/*  Transcript */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={20} /> บทสนทนาย้อนหลัง
        </h3>
        <div className="bg-slate-50 p-6 rounded-xl border font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {interview.transcript}
        </div>
      </section>
       {/*  feedback */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={20} /> คำแนะนำ
        </h3>
        <div className="bg-slate-50 p-6 rounded-xl border font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {interview.feedback}
        </div>
      </section>
    </div>
  );
}

function ScoreBox({ label, score }: { label: string, score: number }) {
  return (
    <div className="text-center p-4 border rounded-xl">
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-indigo-600">{score}/10</p>
    </div>
  );
}