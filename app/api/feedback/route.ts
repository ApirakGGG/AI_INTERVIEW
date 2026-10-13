import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const userId = session?.userId || body.userId || null;

    // Check if user exists in database if userId is provided
    let validUserId: string | null = null;
    if (userId) {
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
      if (existingUser) {
        validUserId = existingUser.clerkId;
      }
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: validUserId,
        position: body.position || null,
        level: body.level || null,
        hasCustomJd: Boolean(body.hasCustomJd),
        experienceLevel: body.experienceLevel || null,

        // ส่วนที่ 2: Rating Scale 1-5
        ratingUiEase: body.ratingUiEase ? Number(body.ratingUiEase) : null,
        ratingUiInterview: body.ratingUiInterview ? Number(body.ratingUiInterview) : null,
        ratingUiDashboard: body.ratingUiDashboard ? Number(body.ratingUiDashboard) : null,
        ratingUiHistory: body.ratingUiHistory ? Number(body.ratingUiHistory) : null,

        ratingVoiceNatural: body.ratingVoiceNatural ? Number(body.ratingVoiceNatural) : null,
        ratingVoiceLatency: body.ratingVoiceLatency ? Number(body.ratingVoiceLatency) : null,
        ratingVoiceStt: body.ratingVoiceStt ? Number(body.ratingVoiceStt) : null,
        ratingVoiceRelevance: body.ratingVoiceRelevance ? Number(body.ratingVoiceRelevance) : null,

        ratingEvalFairness: body.ratingEvalFairness ? Number(body.ratingEvalFairness) : null,
        ratingEvalInsight: body.ratingEvalInsight ? Number(body.ratingEvalInsight) : null,
        ratingEvalPractical: body.ratingEvalPractical ? Number(body.ratingEvalPractical) : null,
        ratingEvalSpeed: body.ratingEvalSpeed ? Number(body.ratingEvalSpeed) : null,

        // ส่วนที่ 3: Overall
        confidenceLevel: body.confidenceLevel || null,
        npsScore: body.npsScore !== undefined && body.npsScore !== null ? Number(body.npsScore) : null,

        // ส่วนที่ 4: Open-ended
        mostLiked: body.mostLiked?.trim() || null,
        problemsFound: body.problemsFound?.trim() || null,
        futureSuggestions: body.futureSuggestions?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("[Feedback API POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to save feedback", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const user = await prisma.user.findUnique({
      where: { clerkId: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("[Feedback API GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback", details: String(error) },
      { status: 500 }
    );
  }
}
