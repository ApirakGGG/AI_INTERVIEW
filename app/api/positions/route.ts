import { NextResponse } from 'next/server';
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { flattenJobPositions } from '@/lib/jobPositions';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

export async function GET() {
  try {
    const positions = await prisma.jobPosition.findMany({
      orderBy: [{ category: 'asc' }, { title: 'asc' }]
    });

    // Group into categories
    const grouped = positions.reduce((acc: { category: string; titles: string[] }[], pos) => {
      const g = acc.find(x => x.category === pos.category);
      if (g) {
        g.titles.push(pos.title);
      } else {
        acc.push({ category: pos.category, titles: [pos.title] });
      }
      return acc;
    }, [] as { category: string; titles: string[] }[]);

    return NextResponse.json(grouped);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST() {
  // SEED Operation
  try {
    const positions = flattenJobPositions();
    let count = 0;
    for (const pos of positions) {
      await prisma.jobPosition.upsert({
        where: { title: pos.title },
        update: {},
        create: { category: pos.category, title: pos.title }
      });
      count++;
    }
    return NextResponse.json({ success: true, seeded: count });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
