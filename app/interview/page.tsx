'use client'
import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { useUser } from "@clerk/nextjs";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

export default function InterviewPage() {
  const { user } = useUser();
  const [transcript, setTranscript] = useState(""); // สำหรับทำ Subtitle
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    vapi.on("message", (message : any) => {
      // ดึง Transcript แบบ Real-time (Partial คือยังพูดไม่จบ, Final คือจบประโยค)
      if (message.type === "transcript" && message.transcriptType === "partial") {
        setTranscript(message.transcript);
      }
    });

    vapi.on("call-start", () => setIsCalling(true));
    vapi.on("call-end", () => {
      setIsCalling(false);
      setTranscript("การสัมภาษณ์จบลงแล้ว ระบบกำลังประมวลผลคะแนน...");
    });
  }, []);

  const startInterview = async () => {
    // ต้องแน่ใจว่าได้ส่ง clerkId ไปใน assistant เพื่อให้ Webhook จำได้ว่าใครคุย
    await vapi.start("YOUR_ASSISTANT_ID", {
      variableValues: {
        customer: { id: user?.id, name: user?.fullName }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 text-center">
      <h1 className="text-3xl font-bold mb-8">AI Technical Interview</h1>
      
      {/* ส่วนแสดงซับไทเติล (Subtitles) */}
      <div className="min-h-[150px] bg-slate-900 text-green-400 p-8 rounded-2xl shadow-2xl mb-8 border border-slate-700 transition-all">
        <p className="text-xl italic font-mono">
          {transcript || "เตรียมตัวให้พร้อม แล้วกดปุ่มเริ่มสัมภาษณ์..."}
        </p>
      </div>

      <button
        onClick={isCalling ? () => vapi.stop() : startInterview}
        className={`px-10 py-4 rounded-full font-bold text-white transition-all ${
          isCalling ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isCalling ? "วางสาย" : "เริ่มพูดคุยตอนนี้"}
      </button>
    </div>
  );
}