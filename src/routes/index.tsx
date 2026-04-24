import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, StatCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  Image as ImageIcon,
  Send,
  Upload,
  Calendar as CalIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Content Studio" },
      { name: "description", content: "Generate and manage AI-powered social media content from a single dashboard." },
    ],
  }),
  component: DashboardPage,
});

const feed = [
  { platform: "Instagram", time: "Today · 2:30 PM", body: "Sip into spring with our new lavender lattes ☕✨ Tag a friend who needs one!", likes: 124, comments: 18 },
  { platform: "LinkedIn", time: "Today · 9:15 AM", body: "We're hiring a Head of Customer Success. Remote-first, equity included.", likes: 312, comments: 47 },
  { platform: "TikTok", time: "Yesterday", body: "POV: you finally found a tool that writes captions in your actual voice.", likes: 1840, comments: 92 },
  { platform: "Facebook", time: "2 days ago", body: "Weekend special: 20% off all merch through Sunday. Use code WEEKEND20.", likes: 56, comments: 9 },
];

function DashboardPage() {
  const [prompt, setPrompt] = useState("");

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard label="Posts this month" value="48" delta="+12% vs last" icon={<Sparkles className="h-4 w-4" />} />
          <StatCard label="Total reach" value="124.8k" delta="+8.2%" icon={<Eye className="h-4 w-4" />} />
          <StatCard label="Engagement" value="6.4%" delta="+0.9pt" icon={<Heart className="h-4 w-4" />} />
          <StatCard label="Scheduled" value="12" icon={<CalIcon className="h-4 w-4" />} />
        </div>

        <SurfaceCard className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-card-foreground/80">
            <Sparkles className="h-4 w-4 text-accent-foreground bg-accent rounded p-0.5" />
            What do you want to post about?
          </div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Announce our new summer menu launching next Friday with photos…"
            className="min-h-[88px] bg-secondary/30 border-border/40 text-card-foreground"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {["Instagram", "LinkedIn", "TikTok", "X", "Facebook"].map((p) => (
                <Badge key={p} variant="secondary" className="bg-secondary/40">{p}</Badge>
              ))}
            </div>
            <Button onClick={() => toast.success("Generating content for 5 platforms…")}>
              <Send className="h-4 w-4" /> Generate
            </Button>
          </div>
        </SurfaceCard>

        <div className="grid gap-4 lg:grid-cols-3">
          <SurfaceCard className="lg:col-span-1 flex flex-col items-center justify-center text-center min-h-[200px] border-dashed">
            <div className="h-12 w-12 rounded-full bg-accent/15 grid place-items-center mb-3">
              <Upload className="h-5 w-5 text-card-foreground" />
            </div>
            <div className="font-medium text-card-foreground">Drop a photo</div>
            <div className="text-xs text-card-foreground/60 mt-1">PNG, JPG up to 20MB</div>
            <Button variant="outline" size="sm" className="mt-4">Browse files</Button>
          </SurfaceCard>

          <div className="lg:col-span-2 space-y-3">
            <SectionHeader title="Recent content" description="Your latest generated and published posts" />
            {feed.map((p, i) => (
              <SurfaceCard key={i} className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-accent/15 grid place-items-center shrink-0">
                  <ImageIcon className="h-4 w-4 text-card-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-card-foreground/60">
                    <span className="font-semibold text-card-foreground">{p.platform}</span>
                    <span>·</span>
                    <span>{p.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-card-foreground">{p.body}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-card-foreground/60">
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes}</span>
                    <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {p.comments}</span>
                  </div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
