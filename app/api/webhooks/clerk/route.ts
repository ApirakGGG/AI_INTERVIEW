import { PrismaClient } from "@/lib/generated/prisma/client";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaPg } from "@prisma/adapter-pg";

export const dynamic = 'force-dynamic';

// แนะนำให้ดึง PrismaClient ออกมาข้างนอกเพื่อป้องกันการสร้าง connection ซ้ำซ้อน
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  const header = await headers();
  const svix_id = header.get("svix-id");
  const svix_timestamp = header.get("svix-timestamp");
  const svix_signature = header.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // ✅ แก้ไขจุดนี้: ดึงค่าดิบเป็น Text เพื่อใช้ในการ Verify
  const body = await req.text(); 
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    // ใช้ body ที่เป็น text ดิๆ ในการ verify
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  //   จัดการ event
const eventType = evt.type;

if (eventType === "user.created") {
  // 1. ดึงข้อมูลออกมาอย่างปลอดภัย
  const { id, email_addresses, first_name, last_name } = evt.data;

  // 2. เช็คก่อนว่ามีข้อมูลอีเมลไหม
  const email = email_addresses && email_addresses.length > 0 
                ? email_addresses[0].email_address 
                : null;

  if (!email) {
    console.error("No email address found for user:", id);
    return new Response("Error: No email address", { status: 400 });
  }

  // 3. จัดการเรื่องชื่อ (เผื่อบางคนไม่มีนามสกุล)
  const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim() || "User";

  try {
    // สร้าง user ใน DB โดยใช้ฟังก์ชัน upsert เพื่อกันข้อมูลซ้ำ
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: email,
        name: fullName,
      },
      create: {
        clerkId: id,
        email: email,
        name: fullName,
      },
    });

    console.log(`✅ User processed successfully: ${id} (${fullName})`);
  } catch (dbError) {
    console.error("❌ Prisma Error:", dbError);
    return new Response("Database Error", { status: 500 });
  }
}

  return new Response("Success", { status: 200 });
}