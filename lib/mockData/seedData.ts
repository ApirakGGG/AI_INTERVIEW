// Mock data สำหรับทดสอบ insert ลง DB
// ใช้ clerkId จริงของ user ที่มีอยู่ใน DB แล้ว

export const mockInterviews = [
  {
    userId: "user_3BX69gW4LVXytARqV9J1JEK3cIt", // แทนด้วย clerkId จริง
    position: "Frontend Developer",
    level: "Junior",
    transcript:
      "Q: Tell me about yourself?\nA: I am a passionate frontend developer with 1 year of experience in React and Next.js...",
    audioUrl: null,
    score: {
      Logic: 80,
      Technical: 75,
      Communication: 90,
      Confidence: 70,
      ProblemSolving: 78,
    },
    averageScore: 78.6,
    duration: 1200, // วินาที = 20 นาที
    feedback:
      "ผู้สมัครมีทักษะการสื่อสารที่ดีมาก มีความเข้าใจพื้นฐาน React แต่ควรพัฒนาทักษะด้าน algorithmic thinking เพิ่มเติม",
    status: "completed",
  },
  {
    userId: "user_3BX69gW4LVXytARqV9J1JEK3cIt", // แทนด้วย clerkId จริง
    position: "Fullstack Engineer",
    level: "Mid",
    transcript:
      "Q: How do you handle state management in large applications?\nA: I prefer using Zustand or Redux Toolkit for complex state...",
    audioUrl: null,
    score: {
      Logic: 85,
      Technical: 88,
      Communication: 72,
      Confidence: 65,
      ProblemSolving: 82,
    },
    averageScore: 78.4,
    duration: 1800, // วินาที = 30 นาที
    feedback:
      "มีความรู้ technical ที่แข็งแกร่ง เข้าใจ system design ดี แต่ควรพัฒนาความมั่นใจในการนำเสนอ",
    status: "completed",
  },
  {
    userId: "user_3BX69gW4LVXytARqV9J1JEK3cIt", // แทนด้วย clerkId จริง
    position: "React Specialist",
    level: "Senior",
    transcript:
      "Q: Can you explain the difference between useMemo and useCallback?\nA: Both are performance optimization hooks...",
    audioUrl: null,
    score: {
      Logic: 92,
      Technical: 95,
      Communication: 88,
      Confidence: 90,
      ProblemSolving: 93,
    },
    averageScore: 91.6,
    duration: 2400, // วินาที = 40 นาที
    feedback:
      "ยอดเยี่ยมมาก มีความเชี่ยวชาญ React ในระดับสูง สามารถอธิบาย concept ที่ซับซ้อนได้อย่างชัดเจน พร้อมสำหรับตำแหน่ง Senior",
    status: "completed",
  },
];
