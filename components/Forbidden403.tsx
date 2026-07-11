import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden403() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="bg-card text-card-foreground max-w-md w-full p-8 rounded-2xl shadow-card border border-border flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="size-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold cn-font-heading text-heading mb-3">
          Access Denied
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Admin Privileges Required. You do not have the necessary permissions to view this page.
        </p>
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent-hover font-semibold py-6">
          <Link href="/dashboard">Return to User Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
