"use client";
import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Bot, User } from "lucide-react";
import Image from "next/image";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string);

export default function InterviewPage() {
  const { user } = useUser();
  const [transcript, setTranscript] = useState(""); // ทำ Subtitle
  const [isCalling, setIsCalling] = useState(false); //สถานะการโทร
  const [position, setPosition] = useState("Software Engineer"); //ตำแหน่ง
  const [level, setLevel] = useState("Junior"); //ระดับ
  const [jobDescription, setJobDescription] = useState(""); // Job Description

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
          jobDescription: jobDescription.trim() || "ไม่ได้ระบุ",
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

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes ping-slow   { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.35);opacity:0} }
        @keyframes ping-slower { 0%,100%{transform:scale(1);opacity:.4} 50%{transform:scale(1.65);opacity:0} }
        @keyframes bar-bounce  { 0%,100%{height:6px} 50%{height:22px} }
        .ping-slow   { animation: ping-slow   1.2s ease-in-out infinite; }
        .ping-slower { animation: ping-slower 1.8s ease-in-out infinite; }
        .bar1 { animation: bar-bounce .7s ease-in-out infinite; }
        .bar2 { animation: bar-bounce .7s ease-in-out .15s infinite; }
        .bar3 { animation: bar-bounce .7s ease-in-out .30s infinite; }
        .bar4 { animation: bar-bounce .7s ease-in-out .10s infinite; }
        .bar5 { animation: bar-bounce .7s ease-in-out .25s infinite; }
      `}</style>

      {/* AI and User Windows */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center mb-8">

        {/* ── AI Card ── */}
        <div className={`relative flex flex-col items-center justify-center p-8 rounded-3xl w-full md:w-1/2 overflow-hidden transition-all duration-500
          ${aiSpeaking
            ? "bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-2xl shadow-indigo-500/30"
            : "bg-linear-to-br from-slate-900 to-slate-800 shadow-xl shadow-slate-900/40"
          }`}
        >
          {/* glow border */}
          <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-500 pointer-events-none
            ${aiSpeaking ? "border-indigo-400/60" : "border-slate-700/50"}`} />

          {/* pulse rings when speaking */}
          {aiSpeaking && (
            <>
              <div className="ping-slow  absolute w-36 h-36 rounded-full bg-indigo-500/20 pointer-events-none" />
              <div className="ping-slower absolute w-48 h-48 rounded-full bg-indigo-500/10 pointer-events-none" />
            </>
          )}

          {/* avatar circle */}
          <div className={`relative z-10 flex items-center justify-center w-24 h-24 rounded-full mb-5 transition-all duration-500
            ${aiSpeaking
              ? "bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/50"
              : "bg-slate-700"
            }`}
          >
            <Bot size={48} className={aiSpeaking ? "text-white" : "text-slate-400"} />
          </div>

          {/* sound bars */}
          <div className="z-10 flex items-end gap-1 h-6 mb-3">
            {aiSpeaking
              ? [1,2,3,4,5].map(i => (
                  <div key={i} className={`bar${i} w-1.5 rounded-full bg-indigo-400`} style={{height:"6px"}} />
                ))
              : [1,2,3,4,5].map(i => (
                  <div key={i} className="w-1.5 rounded-full bg-slate-600" style={{height:"6px"}} />
                ))
            }
          </div>

          <h2 className="z-10 text-xl font-bold text-white tracking-wide">AI Interviewer</h2>
          <p className={`z-10 text-sm mt-1 font-medium transition-colors duration-300
            ${aiSpeaking ? "text-indigo-300" : "text-slate-500"}`}
          >
            {isCalling ? (aiSpeaking ? "● กำลังพูด..." : "● เชื่อมต่อแล้ว") : "พร้อมสัมภาษณ์"}
          </p>
        </div>

        {/* ── User Card ── */}
        <div className={`relative flex flex-col items-center justify-center p-8 rounded-3xl w-full md:w-1/2 overflow-hidden transition-all duration-500
          ${userSpeaking && !isMuted && isCalling
            ? "bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 shadow-2xl shadow-emerald-500/30"
            : isMuted
              ? "bg-linear-to-br from-slate-900 via-red-950/40 to-slate-900 shadow-xl shadow-red-900/20"
              : "bg-linear-to-br from-slate-900 to-slate-800 shadow-xl shadow-slate-900/40"
          }`}
        >
          {/* glow border */}
          <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-500 pointer-events-none
            ${userSpeaking && !isMuted && isCalling
              ? "border-emerald-400/60"
              : isMuted
                ? "border-red-500/40"
                : "border-slate-700/50"
            }`}
          />

          {/* pulse rings when speaking */}
          {userSpeaking && !isMuted && isCalling && (
            <>
              <div className="ping-slow  absolute w-36 h-36 rounded-full bg-emerald-500/20 pointer-events-none" />
              <div className="ping-slower absolute w-48 h-48 rounded-full bg-emerald-500/10 pointer-events-none" />
            </>
          )}

          {/* avatar */}
          <div className={`relative z-10 mb-5 transition-all duration-500
            ${userSpeaking && !isMuted && isCalling ? "ring-4 ring-emerald-400/60 rounded-full shadow-lg shadow-emerald-500/40" : ""}
            ${isMuted ? "ring-4 ring-red-400/40 rounded-full" : ""}
          `}>
            <Image
              src={user?.imageUrl || "/default-avatar.png"}
              alt="User"
              width={96}
              height={96}
              className="object-cover rounded-full w-24 h-24"
            />
            {/* muted overlay */}
            {isMuted && (
              <div className="absolute inset-0 rounded-full bg-red-900/50 flex items-center justify-center">
                <MicOff size={28} className="text-red-300" />
              </div>
            )}
          </div>

          {/* sound bars */}
          <div className="z-10 flex items-end gap-1 h-6 mb-3">
            {userSpeaking && !isMuted && isCalling
              ? [1,2,3,4,5].map(i => (
                  <div key={i} className={`bar${i} w-1.5 rounded-full bg-emerald-400`} style={{height:"6px"}} />
                ))
              : [1,2,3,4,5].map(i => (
                  <div key={i} className="w-1.5 rounded-full bg-slate-600" style={{height:"6px"}} />
                ))
            }
          </div>

          <h2 className="z-10 text-xl font-bold text-white  tracking-wide">{user?.fullName || "You"}</h2>
          <p className={`z-10 text-sm mt-1 font-medium transition-colors duration-300
            ${isMuted ? "text-red-400" : userSpeaking && isCalling ? "text-emerald-300" : "text-slate-500"}`}
          >
            {isMuted ? "🔇 ปิดไมค์" : isCalling ? (userSpeaking ? "● กำลังพูด..." : "● ไมค์เปิดอยู่") : "พร้อมสัมภาษณ์"}
          </p>

          {/* mute toggle button */}
          {isCalling && (
            <button
              onClick={toggleMute}
              className={`absolute bottom-4 right-4 z-20 p-3 rounded-full transition-all duration-200
                ${isMuted
                  ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40"
                  : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/80 border border-slate-600/40"
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
            : "max-h-75 opacity-100"
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
            {/* <option value="Mid-level">Mid-level</option> */}
            <option value="Senior">Senior</option>
            {/* <option value="Lead">Lead</option> */}
          </select>
        </div>

        {/* Job Description */}
        <div className="flex flex-col md:col-span-2">
          <label className="mb-2 font-semibold text-slate-700">
            Job Description{" "}
            <span className="text-slate-400 font-normal text-sm">(ไม่บังคับ)</span>
          </label>
          <textarea
            className="p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm resize-none text-sm text-slate-700 placeholder:text-slate-400"
            rows={4}
            placeholder="วาง Job Description ที่นี่ เพื่อให้ AI ออกแบบคำถามให้ตรงกับตำแหน่งงานจริง..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      {/* ส่วนแสดงซับไทเติล Subtitles */}
      <div className="min-h-37.5 bg-slate-900 text-green-400 p-8 rounded-2xl shadow-xl mb-8 border border-slate-700 transition-all">
        <p className="text-xl ">
          {transcript || "เตรียมตัวให้พร้อม แล้วกดปุ่มเริ่มสัมภาษณ์..."}
        </p>
      </div>

      {/* จับเวลาสัมภาษณ์ */}
      <div className="flex flex-col items-center gap-3">
        {isCalling && (
          <div className="flex items-center gap-2 text-slate-600 text-lg">
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
