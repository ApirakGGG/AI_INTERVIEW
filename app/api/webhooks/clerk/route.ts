import { PrismaClient } from "@/lib/generated/prisma/client";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaPg } from "@prisma/adapter-pg";

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

  const eventType = evt.type;

  // ✅ เมื่อ Verify ผ่านแล้ว ค่อยเอาข้อมูลมาใช้งาน
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    try {
      await prisma.user.create({
          data: {
              clerkId: id,
              email: email_addresses[0].email_address,
              name: `${first_name || ""} ${last_name || ""}`.trim(),
          }
      });
      console.log(`User created: ${id}`);
    } catch (dbError) {
      console.error("Database Error:", dbError);
      // คืนค่า 500 ถ้า DB มีปัญหา เพื่อให้ Clerk ส่ง Webhook มาใหม่ (Retry)
      return new Response("Database Error", { status: 500 });
    }
  }

  return new Response("Success", { status: 200 });
}