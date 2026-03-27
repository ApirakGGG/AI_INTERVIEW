import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard/page";

export default async function Page() {
  const { userId } = await auth(); // clerkId

  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div className="mx-auto">
      <main className="p-4">
        <Dashboard />
      </main>
    </div>
  );
}
