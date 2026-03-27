"use client";
import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { useUser } from "@clerk/nextjs";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

export default function InterviewPage() {
  const { user } = useUser();
  const [transcript, setTranscript] = useState(""); // สำหรับทำ Subtitle
  const [isCalling, setIsCalling] = useState(false);
  const [position, setPosition] = useState("Software Engineer");
  const [level, setLevel] = useState("Junior");
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

  useEffect(() => {
    vapi.on("message", (message: any) => {
      // ดึง Transcript แบบ Real-time (Partial คือยังพูดไม่จบ, Final คือจบประโยค)
      if (
        message.type === "transcript" &&
        message.transcriptType === "partial"
      ) {
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
    await vapi.start(assistantId, {
      variableValues: {
        position: position,
        level: level,
        customer: { id: user?.id, name: user?.fullName },
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 text-center">
      <h1 className="text-3xl font-bold mb-8">AI Technical Interview</h1>

      {/* Dropdown for Position and Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-slate-700">ตำแหน่งที่ต้องการสัมภาษณ์ (Position)</label>
          <select 
            className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            disabled={isCalling}
          >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Fullstack Developer">Fullstack Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-slate-700">ระดับ (Level)</label>
          <select 
            className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            disabled={isCalling}
          >
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
      </div>

      {/* ส่วนแสดงซับไทเติล Subtitles */}
      <div className="min-h-[150px] bg-slate-900 text-green-400 p-8 rounded-2xl shadow-2xl mb-8 border border-slate-700 transition-all">
        <p className="text-xl italic font-mono">
          {transcript || "เตรียมตัวให้พร้อม แล้วกดปุ่มเริ่มสัมภาษณ์..."}
        </p>
      </div>

      <button
        onClick={isCalling ? () => vapi.stop() : startInterview}
        className={`px-10 py-4 rounded-full font-bold text-white transition-all ${
          isCalling
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isCalling ? "วางสาย" : "เริ่มพูดคุยตอนนี้"}
      </button>
    </div>
  );
}
