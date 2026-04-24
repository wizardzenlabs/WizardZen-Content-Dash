import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Content Studio" },
      { name: "description", content: "Plan and schedule social media posts on a weekly or monthly calendar." },
    ],
  }),
  component: CalendarPage,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const events: Record<number, { title: string; platform: string; time: string }[]> = {
  2: [{ title: "Spring menu reveal", platform: "Instagram", time: "10:00" }],
  4: [
    { title: "Hiring post", platform: "LinkedIn", time: "9:00" },
    { title: "BTS reel", platform: "TikTok", time: "17:30" },
  ],
  5: [{ title: "Weekend promo", platform: "Facebook", time: "12:00" }],
  9: [{ title: "Customer story", platform: "Instagram", time: "11:00" }],
  12: [{ title: "Product tip", platform: "X", time: "8:30" }],
  16: [{ title: "Newsletter", platform: "Email", time: "14:00" }],
  22: [{ title: "Q&A live", platform: "Instagram", time: "19:00" }],
};

function CalendarPage() {
  const [view, setView] = useState<"week" | "month">("month");

  return (
    <AppLayout title="Calendar">
      <div className="space-y-5">
        <SectionHeader
          title="April 2025"
          action={
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-border bg-secondary/30 p-1">
                <button
                  onClick={() => setView("week")}
                  className={`px-3 py-1 text-xs rounded-md ${view === "week" ? "bg-accent text-accent-foreground" : "text-foreground/70"}`}
                >Week</button>
                <button
                  onClick={() => setView("month")}
                  className={`px-3 py-1 text-xs rounded-md ${view === "month" ? "bg-accent text-accent-foreground" : "text-foreground/70"}`}
                >Month</button>
              </div>
              <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              <Button><Plus className="h-4 w-4" /> New post</Button>
            </div>
          }
        />

        <SurfaceCard className="p-0 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border/30 bg-secondary/20">
            {days.map((d) => (
              <div key={d} className="px-3 py-2 text-xs font-semibold text-card-foreground/70 text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: view === "month" ? 35 : 7 }).map((_, i) => {
              const day = i + 1;
              const dayEvents = events[day] || [];
              return (
                <div key={i} className="min-h-[110px] border-r border-b border-border/20 p-2 last:border-r-0">
                  <div className="text-xs font-medium text-card-foreground/60 mb-1">{day <= 30 ? day : ""}</div>
                  <div className="space-y-1">
                    {dayEvents.map((e, idx) => (
                      <div key={idx} className="rounded-md bg-accent/20 px-2 py-1 text-[11px] text-card-foreground">
                        <div className="font-medium truncate">{e.title}</div>
                        <div className="text-card-foreground/60">{e.time} · {e.platform}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <div className="text-sm font-semibold mb-3 text-card-foreground">Upcoming this week</div>
          <div className="space-y-2">
            {Object.entries(events).slice(0, 4).map(([day, list]) =>
              list.map((e, i) => (
                <div key={`${day}-${i}`} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
                  <div className="w-12 text-center">
                    <div className="text-xs text-card-foreground/60">Apr</div>
                    <div className="font-bold text-card-foreground">{day}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-card-foreground">{e.title}</div>
                    <div className="text-xs text-card-foreground/60">{e.time} · {e.platform}</div>
                  </div>
                  <Badge variant="secondary" className="bg-secondary/40">Scheduled</Badge>
                </div>
              )),
            )}
          </div>
        </SurfaceCard>
      </div>
    </AppLayout>
  );
}
