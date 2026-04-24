import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, StatCard, SectionHeader } from "@/components/layout/Primitives";
import { Eye, Heart, MessageSquare, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Content Studio" },
      { name: "description", content: "Track reach, engagement, and posting performance across channels." },
    ],
  }),
  component: AnalyticsPage,
});

const reach = [
  { d: "Mon", v: 2400 },
  { d: "Tue", v: 3100 },
  { d: "Wed", v: 2800 },
  { d: "Thu", v: 4100 },
  { d: "Fri", v: 5200 },
  { d: "Sat", v: 4700 },
  { d: "Sun", v: 3900 },
];

const byPlatform = [
  { p: "IG", v: 124 },
  { p: "LI", v: 48 },
  { p: "TT", v: 187 },
  { p: "X", v: 62 },
  { p: "FB", v: 33 },
];

function AnalyticsPage() {
  return (
    <AppLayout title="Analytics">
      <div className="space-y-6">
        <SectionHeader title="Performance overview" description="Last 7 days across all connected platforms." />

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard label="Reach" value="24.8k" delta="+12%" icon={<Eye className="h-4 w-4" />} />
          <StatCard label="Engagement rate" value="6.4%" delta="+0.9pt" icon={<Heart className="h-4 w-4" />} />
          <StatCard label="Comments" value="312" delta="+24" icon={<MessageSquare className="h-4 w-4" />} />
          <StatCard label="Best day" value="Friday" icon={<TrendingUp className="h-4 w-4" />} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SurfaceCard>
            <div className="text-sm font-semibold text-card-foreground mb-3">Reach this week</div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reach}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="d" stroke="currentColor" fontSize={11} />
                  <YAxis stroke="currentColor" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-card-foreground)" }} />
                  <Area dataKey="v" type="monotone" stroke="var(--color-accent)" fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <div className="text-sm font-semibold text-card-foreground mb-3">Posts by platform</div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="p" stroke="currentColor" fontSize={11} />
                  <YAxis stroke="currentColor" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-card-foreground)" }} />
                  <Bar dataKey="v" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard>
          <div className="text-sm font-semibold text-card-foreground mb-3">Best time to post</div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-[60px_repeat(24,_1fr)] gap-1 text-[10px] text-card-foreground/60 mb-1">
                <div />
                {Array.from({ length: 24 }).map((_, h) => (
                  <div key={h} className="text-center">{h}</div>
                ))}
              </div>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, di) => (
                <div key={day} className="grid grid-cols-[60px_repeat(24,_1fr)] gap-1 mb-1">
                  <div className="text-xs text-card-foreground/70 self-center">{day}</div>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const intensity = Math.max(0, Math.sin((h - 6) / 4) + Math.cos(di) / 2);
                    const opacity = Math.min(0.85, Math.max(0.05, intensity * 0.5 + 0.05));
                    return (
                      <div
                        key={h}
                        className="h-5 rounded-sm"
                        style={{ background: `oklch(0.92 0.24 125 / ${opacity})` }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 text-xs text-card-foreground/60">Brighter cells = higher historical engagement.</div>
        </SurfaceCard>
      </div>
    </AppLayout>
  );
}
