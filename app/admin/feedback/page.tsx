import { prisma } from "@/lib/prisma";
import { FeedbackListView } from "./FeedbackListView";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const feedbacks = await prisma.feedback.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <FeedbackListView feedbacks={feedbacks} />;
}
