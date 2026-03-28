import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { mockInterviews } from "./mockData/seedData";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string}),
});

async function main() {
  for (const interview of mockInterviews) {
    await prisma.interview.create({ data: interview });
  }
  console.log("Seeded successfully!");
}

main().finally(() => prisma.$disconnect());
