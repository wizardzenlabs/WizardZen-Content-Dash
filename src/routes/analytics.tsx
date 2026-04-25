import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, StatCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import {
  Eye,
  TrendingUp,
  FileText,
  Sparkles,
  Repeat,
  Lightbulb,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Content Studio" },
      {
        name: "description",
        content: "Track reach, engagement, and posting performance across channels.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const PERSONAL = "Jamie";
const BUSINESS = "Linden Coffee";

type Voice = "all" | "personal" | "business";

const platformPerf = [
  { p: "Instagram", personal: 1240, business: 2400 },
  { p: "TikTok", personal: 3100, business: 1800 },
  { p: "LinkedIn", personal: 480, business: 980 },
  { p: "Threads", personal: 1650, business: 720 },
  { p: "Facebook", personal: 220, business: 1340 },
  { p: "Pinterest", personal: 190, business: 880 },
];

const topContent = [
  {
    id: 1,
    voice: "personal" as const,
    platform: "Threads",
    preview: "What I learned from 90 days of shipping one tiny thing daily…",
    engagement: "8.2%",
  },
  {
    id: 2,
    voice: "business" as const,
    platform: "Instagram",
    preview: "Lavender latte returns Friday — first 25 cups are on us ✨",
    engagement: "7.6%",
  },
  {
    id: 3,
    voice: "personal" as const,
    platform: "LinkedIn",
    preview: "Three founder mistakes I made in year one I'd happily un-make…",
    engagement: "6.9%",
  },
  {
    id: 4,
    voice: "business" as const,
    platform: "TikTok",
    preview: "Watch us pull a perfect oat-milk pour at 7am rush. Sound on.",
    engagement: "6.4%",
  },
  {
    id: 5,
    voice: "business" as const,
    platform: "Facebook",
    preview: "Saturday open mic is back — sign up at the counter ☕",
    engagement: "5.8%",
  },
];

const themeBars = [
  { theme: "Behind the scenes", value: 32 },
  { theme: "Product launches", value: 24 },
  { theme: "Customer stories", value: 18 },
  { theme: "Tips & how-to", value: 14 },
  { theme: "Founder thoughts", value: 12 },
];

function AnalyticsPage() {
  const [voice, setVoice] = useState<Voice>("all");

  const stats = useMemo(() => {
    if (voice === "personal") {
      return {
        posts: "12",
        engagement: "7.4%",
        topPlatform: "Threads",
        generated: "186",
      };
    }
    if (voice === "business") {
      return {
        posts: "21",
        engagement: "5.9%",
        topPlatform: "Instagram",
        generated: "412",
      };
    }
    return {
      posts: "33",
      engagement: "6.4%",
      topPlatform: "Instagram",
      generated: "598",
    };
  }, [voice]);

  const filteredTop = useMemo(() => {
    if (voice === "all") return topContent;
    return topContent.filter((c) => c.voice === voice);
  }, [voice]);

  const donut = [
    { name: PERSONAL, value: 38 },
    { name: BUSINESS, value: 62 },
  ];

  const heatmapWeeks = 16;
  const heatmapDays = 7;
  const cells = useMemo(() => {
    const out: { day: number; week: number; personal: number; business: number }[] =
      [];
    for (let w = 0; w < heatmapWeeks; w++) {
      for (let d = 0; d < heatmapDays; d++) {
        const seed = (w * 7 + d) % 11;
        out.push({
          day: d,
          week: w,
          personal: seed % 3 === 0 ? (seed % 4) + 1 : 0,
          business: seed % 2 === 0 ? (seed % 5) + 1 : 0,
        });
      }
    }
    return out;
  }, []);

  const recommendations = [
    {
      icon: TrendingUp,
      title: `Your ${PERSONAL} brand gets 2× engagement on Threads`,
      body: "Consider doubling personal-voice Threads posts from 2 → 4 per week.",
    },
    {
      icon: Sparkles,
      title: "Behind-the-scenes outperforms launches by 38%",
      body: `Lean into BTS posts for ${BUSINESS} — especially Tuesday + Thursday mornings.`,
    },
    {
      icon: Lightbulb,
      title: "You haven't posted on LinkedIn in 9 days",
      body: "LinkedIn engagement compounds with cadence — schedule a founder reflection.",
    },
  ];

  const voicePill = (id: Voice, label: string) => (
    <button
      key={id}
      onClick={() => setVoice(id)}
      className={cn(
        "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
        voice === id
          ? "bg-accent text-accent-foreground"
          : "bg-secondary/30 text-foreground/80 hover:bg-secondary/50",
      )}
    >
      {label}
    </button>
  );

  return (
    <AppLayout title="Analytics">
      <div className="space-y-6">
        <SectionHeader
          title="Performance overview"
          description="Last 30 days across all connected platforms."
        />

        <div className="flex flex-wrap items-center gap-2 glass-panel rounded-full p-1 w-fit">
          {voicePill("all", "All Content")}
          {voicePill("personal", `${PERSONAL} only`)}
          {voicePill("business", `${BUSINESS} only`)}
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Posts this week"
            value={stats.posts}
            delta="+4 vs last"
            icon={<FileText className="h-4 w-4" />}
          />
          <StatCard
            label="Engagement rate"
            value={stats.engagement}
            delta="+0.8pt"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            label="Top platform"
            value={stats.topPlatform}
            icon={<Eye className="h-4 w-4" />}
          />
          <StatCard
            label="Total generated"
            value={stats.generated}
            delta="+58"
            icon={<Sparkles className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <SurfaceCard>
            <div className="text-sm font-semibold text-card-foreground mb-3">
              Performance by platform
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="p" stroke="currentColor" fontSize={11} />
                  <YAxis stroke="currentColor" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      color: "var(--color-card-foreground)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {(voice === "all" || voice === "personal") && (
                    <Bar
                      dataKey="personal"
                      name={PERSONAL}
                      fill="var(--color-chart-2)"
                      radius={[6, 6, 0, 0]}
                    />
                  )}
                  {(voice === "all" || voice === "business") && (
                    <Bar
                      dataKey="business"
                      name={BUSINESS}
                      fill="var(--color-accent)"
                      radius={[6, 6, 0, 0]}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <div className="text-sm font-semibold text-card-foreground mb-3">
              Voice split
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donut}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    <Cell fill="var(--color-chart-2)" />
                    <Cell fill="var(--color-accent)" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      color: "var(--color-card-foreground)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-card-foreground">
              Top 5 performing posts
            </div>
            <div className="text-xs text-card-foreground/60">Last 30 days</div>
          </div>
          <div className="grid gap-2">
            {filteredTop.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-border/30 bg-secondary/20 p-3"
              >
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded",
                    c.voice === "personal"
                      ? "bg-chart-2/20 text-chart-2"
                      : "bg-accent/20 text-accent-foreground",
                  )}
                  style={{
                    color:
                      c.voice === "personal"
                        ? "var(--color-chart-2)"
                        : "var(--color-accent-foreground)",
                  }}
                >
                  {c.voice === "personal" ? PERSONAL : BUSINESS}
                </span>
                <span className="text-xs text-card-foreground/70 shrink-0">
                  {c.platform}
                </span>
                <p className="text-sm text-card-foreground/90 flex-1 min-w-0 truncate">
                  {c.preview}
                </p>
                <span className="text-sm font-semibold text-card-foreground shrink-0">
                  {c.engagement}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Loaded into Polish")}
                >
                  <Repeat className="h-3.5 w-3.5" /> Reuse
                </Button>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="text-sm font-semibold text-card-foreground">
              Posting heatmap (last 16 weeks)
            </div>
            <div className="flex items-center gap-3 text-xs text-card-foreground/70">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ background: "var(--color-chart-2)" }}
                />
                {PERSONAL}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ background: "var(--color-accent)" }}
                />
                {BUSINESS}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${heatmapWeeks}, minmax(14px, 1fr))`,
                gridAutoRows: "14px",
              }}
            >
              {Array.from({ length: heatmapDays }).map((_, dayIdx) =>
                Array.from({ length: heatmapWeeks }).map((__, weekIdx) => {
                  const c = cells.find(
                    (x) => x.day === dayIdx && x.week === weekIdx,
                  )!;
                  const showPersonal =
                    (voice === "all" || voice === "personal") && c.personal > 0;
                  const showBusiness =
                    (voice === "all" || voice === "business") && c.business > 0;
                  let bg = "var(--color-secondary)";
                  let opacity = 0.3;
                  if (showPersonal && showBusiness) {
                    bg =
                      "linear-gradient(135deg, var(--color-chart-2) 50%, var(--color-accent) 50%)";
                    opacity = 0.9;
                  } else if (showPersonal) {
                    bg = "var(--color-chart-2)";
                    opacity = 0.3 + c.personal * 0.15;
                  } else if (showBusiness) {
                    bg = "var(--color-accent)";
                    opacity = 0.3 + c.business * 0.13;
                  }
                  return (
                    <div
                      key={`${dayIdx}-${weekIdx}`}
                      className="rounded-sm"
                      style={{
                        gridRow: dayIdx + 1,
                        gridColumn: weekIdx + 1,
                        background: bg,
                        opacity,
                      }}
                    />
                  );
                }),
              )}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <div className="text-sm font-semibold text-card-foreground mb-3">
            Theme distribution
          </div>
          <div className="space-y-2">
            {themeBars.map((t) => (
              <div key={t.theme} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-card-foreground/80">{t.theme}</span>
                  <span className="text-card-foreground/60">{t.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/40 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${t.value * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <div>
          <div className="text-sm font-semibold text-foreground mb-3">
            AI recommendations
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {recommendations.map((r) => {
              const Icon = r.icon;
              return (
                <SurfaceCard key={r.title} className="space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-accent/15 grid place-items-center">
                    <Icon className="h-4 w-4 text-card-foreground" />
                  </div>
                  <div className="font-semibold text-card-foreground text-sm">
                    {r.title}
                  </div>
                  <p className="text-xs text-card-foreground/70 leading-relaxed">
                    {r.body}
                  </p>
                </SurfaceCard>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
