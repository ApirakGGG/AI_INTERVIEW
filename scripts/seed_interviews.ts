import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

// โหลด Environment Variables จากไฟล์ .env
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting mock data seeding...");

  // ค้นหาผู้ใช้คนแรกในระบบเพื่อจำลองข้อมูลการสัมภาษณ์ให้
  // const user = await prisma.user.findFirst();

  // if (!user) {
  //   console.error("❌ ไม่พบผู้ใช้ในระบบ กรุณาเข้าใช้งานและเข้าสู่ระบบก่อนเพื่อสร้างบัญชีผู้ใช้ในระบบฐานข้อมูล");
  //   return;
  // }

  const userId = "user_3BZuV697SL228lH1GB0WtQ9TwyJ";

  // console.log(`พบผู้ใช้: ${user.name} (clerkId: ${user.clerkId})`);

  // ลบข้อมูลการสัมภาษณ์เดิมออกก่อน (เผื่อต้องการทดสอบใหม่)
  const deleteCount = await prisma.interview.deleteMany({
    where: { userId: userId },
  });
  console.log(`ลบข้อมูลการสัมภาษณ์เดิมไป ${deleteCount.count} รายการ`);

  const positions = ["Software Engineer", "Frontend Developer", "Product Manager", "Data Analyst", "DevOps Engineer"];
  const levels = ["Junior", "Senior", "Middle"];
  const fillerLevels = ["Low", "High", "None"];
  const feedbacks = [
    "ทำได้ดีมากในการตอบคำถามเชิงตรรกะ แต่อาจจะพูดติดอ่างเล็กน้อยเมื่อเจอคำถามยาก",
    "ทักษะด้านเทคนิคค่อนข้างเด่นชัด ควรปรับปรุงเรื่องการเชื่อมโยงระบบ (System Integration)",
    "ตอบคำถามได้ตรงประเด็นและมีความมั่นใจสูงมาก มีทักษะการสื่อสารที่ยอดเยี่ยม",
    "ประหม่าเล็กน้อยในคำถามแรก แต่อธิบายวิธีแก้ปัญหาได้สมเหตุสมผลในภายหลัง",
    "ทักษะความรู้พื้นฐานดี แนะนำให้อธิบายขั้นตอนและโครงสร้างความคิดให้เป็นระบบขึ้น"
  ];

  const today = new Date();
  const mockInterviews = [];

  // สร้างประวัติกิจกรรมสัมภาษณ์ประมาณ 55 รายการสุ่มย้อนหลัง 150 วัน
  for (let i = 0; i < 55; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 150);
    const createdAt = new Date();
    createdAt.setDate(today.getDate() - randomDaysAgo);
    
    // สุ่มข้อมูลคะแนนและการฝึก
    const tech = Math.floor(Math.random() * 50) + 50; // 50-100
    const comm = Math.floor(Math.random() * 50) + 50; // 50-100
    const logic = Math.floor(Math.random() * 50) + 50; // 50-100
    const averageScore = Math.round((tech + comm + logic) / 3);
    const duration = Math.floor(Math.random() * 1500) + 300; // 5 - 30 นาที (หน่วยเป็นวินาที)

    mockInterviews.push({
      userId: userId,
      position: positions[Math.floor(Math.random() * positions.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      transcript: "นี่คือบทสนทนาจำลองสำหรับการทำแบบทดสอบสัมภาษณ์จำลองของระบบ...",
      audioUrl: "https://example.com/mock-audio.mp3",
      score: {
        Technical: tech,
        Communication: comm,
        Logic: logic,
        fillerLevel: fillerLevels[Math.floor(Math.random() * fillerLevels.length)],
      },
      averageScore,
      duration,
      feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
      status: "completed",
      createdAt,
    });
  }

  // นำข้อมูลเข้าสู่ฐานข้อมูล
  console.log("กำลังเพิ่มข้อมูลการสัมภาษณ์จำลอง 55 รายการ...");
  let createdCount = 0;
  for (const item of mockInterviews) {
    await prisma.interview.create({
      data: item,
    });
    createdCount++;
  }

  console.log(`Successfully seeded ${createdCount} mock interviews for user: ${userId}`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
