import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, Play, Scissors, Download, Film } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/video-studio")({
  head: () => ({
    meta: [
      { title: "Video Studio — Content Studio" },
      { name: "description", content: "Trim, caption, and export short-form video for social platforms." },
    ],
  }),
  component: VideoStudioPage,
});

function VideoStudioPage() {
  return (
    <AppLayout title="Video Studio">
      <div className="space-y-6">
        <SectionHeader title="Video Studio" description="Trim and export short clips for Reels, TikTok, and Shorts." />

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <SurfaceCard className="space-y-4">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-secondary/40 to-muted/30 grid place-items-center relative overflow-hidden">
              <Film className="h-16 w-16 text-card-foreground/20" />
              <button className="absolute inset-0 grid place-items-center group">
                <span className="h-14 w-14 rounded-full bg-accent text-accent-foreground grid place-items-center group-hover:scale-105 transition-transform">
                  <Play className="h-6 w-6" />
                </span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-card-foreground/70">
                <Scissors className="h-4 w-4" /> Trim
              </div>
              <Slider defaultValue={[10, 75]} max={100} step={1} />
              <div className="flex justify-between text-xs text-card-foreground/60">
                <span>00:03</span>
                <span>00:24</span>
              </div>
            </div>
          </SurfaceCard>

          <div className="space-y-4">
            <SurfaceCard className="border-dashed flex flex-col items-center text-center py-8">
              <div className="h-12 w-12 rounded-full bg-accent/15 grid place-items-center mb-3">
                <Upload className="h-5 w-5 text-card-foreground" />
              </div>
              <div className="font-medium text-card-foreground">Upload video</div>
              <div className="text-xs text-card-foreground/60 mt-1">MP4, MOV up to 200MB</div>
              <Button variant="outline" size="sm" className="mt-4">Browse</Button>
            </SurfaceCard>

            <SurfaceCard className="space-y-3">
              <div className="text-sm font-semibold text-card-foreground">Export</div>
              {[
                { label: "Instagram Reel", spec: "1080x1920 · 9:16" },
                { label: "TikTok", spec: "1080x1920 · 9:16" },
                { label: "YouTube Short", spec: "1080x1920 · 9:16" },
                { label: "Square", spec: "1080x1080 · 1:1" },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={() => toast.success(`Exporting ${o.label}…`)}
                  className="w-full flex items-center justify-between rounded-lg border border-border/40 bg-secondary/20 hover:bg-secondary/40 px-3 py-2 text-left transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-card-foreground">{o.label}</div>
                    <div className="text-xs text-card-foreground/60">{o.spec}</div>
                  </div>
                  <Download className="h-4 w-4 text-card-foreground/60" />
                </button>
              ))}
            </SurfaceCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
