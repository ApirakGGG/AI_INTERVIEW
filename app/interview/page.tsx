"use client";
import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Bot, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string);

export default function InterviewPage() {
  const { user } = useUser();
  const [transcript, setTranscript] = useState(""); // สำหรับทำ Subtitle
  const [isCalling, setIsCalling] = useState(false);
  const [position, setPosition] = useState("Software Engineer");
  const [level, setLevel] = useState("Junior");

  // UI states
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID as string;

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

    // AI Speaking state
    vapi.on("speech-start", () => setAiSpeaking(true));
    vapi.on("speech-end", () => setAiSpeaking(false));

    // User Speaking state (Volume monitoring)
    vapi.on("volume-level", (volume) => {
      setUserSpeaking(volume > 0.1);
    });

    vapi.on("call-start", () => setIsCalling(true));
    vapi.on("call-end", () => {
      setIsCalling(false);
      setAiSpeaking(false);
      setUserSpeaking(false);
      setTranscript("การสัมภาษณ์จบลงแล้ว ระบบกำลังประมวลผลคะแนน...");
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
    });
  }, []);

  const startInterview = async () => {
    try {
      console.log("Starting interview with assistantId:", assistantId);
      await vapi.start(assistantId, {
        variableValues: {
          position: position,
          level: level,
          userId: user?.id,       // flat string → webhook อ่านได้ง่าย
          userName: user?.fullName,
        },
      });
    } catch (err) {
      console.error("Failed to start interview:", err);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    vapi.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 text-center">
      <h1 className="text-3xl font-bold mb-8">AI Technical Interview</h1>

      {/* AI and User Windows */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8 h-[30vh]">
        {/* AI Window */}
        <div
          className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-2xl w-full md:w-1/2 transition-colors duration-300 ${
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
          className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-2xl w-full md:w-1/2 transition-colors duration-300 ${
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

      {/* Dropdown for Position and Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-slate-700">
            ตำแหน่งที่ต้องการสัมภาษณ์
          </label>
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
          <label className="mb-2 font-semibold text-slate-700">
            ระดับ (Level)
          </label>
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
      <div className="min-h-[150px] bg-slate-900 text-green-400 p-8 rounded-2xl shadow-xl mb-8 border border-slate-700 transition-all">
        <p className="text-xl  font-mono">
          {transcript || "เตรียมตัวให้พร้อม แล้วกดปุ่มเริ่มสัมภาษณ์..."}
        </p>
      </div>

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
  );
}
