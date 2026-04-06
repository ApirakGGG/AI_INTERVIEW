"use client";
import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Bot, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string);

export default function InterviewPage() {
  const { user } = useUser();
  const [transcript, setTranscript] = useState(""); // ทำ Subtitle
  const [isCalling, setIsCalling] = useState(false); //สถานะการโทร
  const [position, setPosition] = useState("Software Engineer"); //ตำแหน่ง
  const [level, setLevel] = useState("Junior"); //ระดับ

  // UI 
  const [aiSpeaking, setAiSpeaking] = useState(false); //เวลา AI กดพูด
  const [userSpeaking, setUserSpeaking] = useState(false); //เวลา User กดพูด
  const [isMuted, setIsMuted] = useState(false); //เวลา Mute เสียง

  // state จับเวลา
  const [elapsedSeconds, setElapsedSeconds] = useState(0); //เวลาที่ใช้ในการสัมภาษณ์ให้เพิ่มขึ้นทีละ 1 วิ
  const timerRef = useRef<NodeJS.Timeout | null>(null); //เวลาที่ใช้ในการสัมภาษณ์

  // เริ่มจับเวลา
  const startTimer = () => {
    setElapsedSeconds(0); //เริ่มจับเวลาที่ 0
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1); //เพิ่มขึ้นทีละ 1 วิ
    }, 1000); //ทุกๆ 1 วิ
  };

  // หยุดจับเวลา
  const stopTimer = () => { 
    if (timerRef.current)  {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // แปลงเวลาเป็นนาทีและวินาที
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60) //นาที
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0"); //วินาที
    return `${m}:${s}`;
  };

  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID as string; 

  useEffect(() => {
    vapi.on("message", (message: any) => {
      // ดึง Transcript แบบ Real-time คือยังพูดไม่จบ Final คือจบประโยค
      if (
        message.type === "transcript" &&
        message.transcriptType === "partial"
      ) {
        setTranscript(message.transcript);
      }
    });

    // AI Speaking state
    vapi.on("speech-start", () => setAiSpeaking(true));
    vapi.on("speech-end", () => setAiSpeaking(false));

    // User Speaking state
    vapi.on("volume-level", (volume) => {
      setUserSpeaking(volume > 0.1);
    });

    // เริ่มการสัมภาษณ์
    vapi.on("call-start", () => {
      setIsCalling(true);
      startTimer(); // เริ่มจับเวลา
    });

    // จบการสัมภาษณ์
    vapi.on("call-end", () => {
      setIsCalling(false);
      setAiSpeaking(false);
      setUserSpeaking(false);
      setTranscript("การสัมภาษณ์จบลงแล้ว ระบบกำลังประมวลผลคะแนน...");
      stopTimer(); // หยุดจับเวลา
    });

    // ดักerror
    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
    });
  }, []);

  // เริ่มการสัมภาษณ์
  const startInterview = async () => {
    try {
      console.log("Starting interview with assistantId:", assistantId);
      await vapi.start(assistantId, {
        variableValues: {
          position: position,
          level: level,
          userId: user?.id, // flat string webhook อ่านได้ง่าย
          userName: user?.fullName,
        },
      });
    } catch (err) {
      console.error("Failed to start interview:", err);
    }
  };

  // Mute เสียง
  const toggleMute = () => {
    const nextMuted = !isMuted;
    vapi.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-center">
      {/* AI and User Windows */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8 h-[30vh]">
        {/* AI Window */}
        <div
          className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-2xl w-full sm:w-full md:w-1/2 transition-colors duration-300 ${
            aiSpeaking
              ? "border-indigo-500 bg-indigo-50/50 shadow-indigo-100"
              : "border-slate-200 bg-white"
          }`}
        >
          {aiSpeaking && (
            <Volume2
              className="absolute top-4 right-4 text-indigo-500 animate-pulse"
              size={24}
            />
          )}
          <div
            className={`p-4 rounded-full mb-4 ${aiSpeaking ? "bg-indigo-100" : "bg-slate-100"}`}
          >
            <Bot
              size={64}
              className={aiSpeaking ? "text-indigo-600" : "text-slate-400"}
            />
          </div>
          <h2 className="text-xl font-bold">AI Interviewer</h2>
          <p className="text-sm text-slate-500">
            {isCalling ? "Connected" : "Ready..."}
          </p>
        </div>

        {/* User Window */}
        <div
          className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-2xl w-full sm:w-full md:w-1/2 transition-colors duration-300 ${
            userSpeaking && !isMuted && isCalling
              ? "border-green-500 bg-green-50/50 shadow-green-100"
              : isMuted
                ? "border-red-300 bg-red-50/30"
                : "border-slate-200 bg-white"
          }`}
        >
          {userSpeaking && !isMuted && isCalling && (
            <Volume2
              className="absolute top-4 right-4 text-green-500 animate-pulse"
              size={24}
            />
          )}
          <div
            className={`p-4 rounded-full mb-4 ${userSpeaking && !isMuted && isCalling ? "bg-green-100" : "bg-slate-100"}`}
          >
            {/* <User size={64} className={userSpeaking && !isMuted && isCalling ? "text-green-600" : "text-slate-400"} /> */}
            <Image
              src={user?.imageUrl || "/default-avatar.png"}
              alt="User"
              width={64}
              height={64}
              className={cn(
                "object-cover rounded-full",
                userSpeaking && !isMuted && isCalling
                  ? "text-green-600"
                  : "text-slate-400",
              )}
            />
          </div>
          <h2 className="text-xl font-bold">{user?.fullName || "You"}</h2>
          <p className="text-sm text-slate-500">
            {isMuted ? "Muted" : isCalling ? "Microphone On" : "Ready"}
          </p>

          {isCalling && (
            <button
              onClick={toggleMute}
              className={`absolute bottom-4 right-4 p-3 rounded-full transition-colors ${
                isMuted
                  ? "bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Dropdown for Position and Level — ซ่อนตอนสัมภาษณ์ */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left overflow-hidden transition-all duration-500 ease-in-out ${
          isCalling
            ? "max-h-0 opacity-0 mb-0 pointer-events-none"
            : "max-h-[300px] opacity-100"
        }`}
      >
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-slate-700">
            ตำแหน่งที่ต้องการสัมภาษณ์
          </label>
          <select
            className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
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
          <label className="mb-2 font-semibold text-slate-700">
            ระดับ (Level)
          </label>
          <select
            className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
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
      <div className="min-h-[150px] bg-slate-900 text-green-400 p-8 rounded-2xl shadow-xl mb-8 border border-slate-700 transition-all">
        <p className="text-xl  font-mono">
          {transcript || "เตรียมตัวให้พร้อม แล้วกดปุ่มเริ่มสัมภาษณ์..."}
        </p>
      </div>

      {/* จับเวลาสัมภาษณ์ */}
      <div className="flex flex-col items-center gap-3">
        {isCalling && (
          <div className="flex items-center gap-2 text-slate-600 font-mono text-lg">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-lg">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        )}
        <Button
          variant={"default"}
          onClick={isCalling ? () => vapi.stop() : startInterview}
          className={`px-10 py-6 rounded-xl font-bold text-white text-lg transition-all cursor-pointer shadow-lg w-full md:w-auto ${
            isCalling
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30"
          }`}
        >
          {isCalling ? "จบการสัมภาษณ์" : "เริ่มพูดคุยตอนนี้"}
        </Button>
      </div>
    </div>
  );
}
