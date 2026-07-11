"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function StatsCard({ title, value, icon, description, intent = "default" }: any) {
  const getIconColors = (intent: string) => {
    switch(intent) {
      case "primary": return "bg-primary/10 text-primary";
      case "secondary": return "bg-secondary/10 text-secondary";
      case "accent": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground border border-border flex items-center justify-center w-10 h-10";
    }
  };

  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default bg-card border-border shadow-card relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 ${getIconColors(intent).split(" ")[0]}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
        <CardTitle className="text-[13px] uppercase tracking-wider font-bold text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2.5 rounded-xl ${getIconColors(intent)}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold cn-font-heading text-heading">{value}</div>
        <p className="text-sm font-medium text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
