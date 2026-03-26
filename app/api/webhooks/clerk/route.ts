import { PrismaClient } from "@/lib/generated/prisma/client";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

export async function POST(req: Request) {
  
  // ดึง Webhook Secret จาก Clerk Dashboard (.env)
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env",
    );
  }

  //   ดึง Headers
  const header = await headers();
  const svix_id = header.get("svix-id");
  const svix_timestamp = header.get("svix-timestamp");
  const svix_signature = header.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  //   รับ Body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // สร้าง Instance ของ Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  //   จัดการevent
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    // สร้าง user ใน DB
    await prisma.user.create({
        data: {
            clerkId: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
        }
    })
    console.log(`create successfully ${id} : ${first_name}`)
  }
  return new Response("", {status: 200})
}
