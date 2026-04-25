import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  RotateCw,
  Pencil,
  Check,
  ChevronDown,
  Quote,
  TrendingUp,
  BookOpen,
  Megaphone,
  Type as TypeIcon,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/image-studio")({
  head: () => ({
    meta: [
      { title: "Image Studio — Content Studio" },
      {
        name: "description",
        content: "Generate on-brand social images sized for every platform.",
      },
    ],
  }),
  component: ImageStudioPage,
});

const platforms = [
  { id: "ig-post", name: "Instagram Post", w: 1080, h: 1350 },
  { id: "ig-story", name: "Instagram Story", w: 1080, h: 1920 },
  { id: "tiktok", name: "TikTok", w: 1080, h: 1920 },
  { id: "facebook", name: "Facebook", w: 1200, h: 630 },
  { id: "linkedin", name: "LinkedIn", w: 1200, h: 627 },
  { id: "threads", name: "Threads", w: 1080, h: 1080 },
  { id: "pinterest", name: "Pinterest", w: 1000, h: 1500 },
] as const;

type ImageType = "quote" | "background" | "text-on-bg" | "upload";

const imageTypes: {
  id: ImageType;
  name: string;
  icon: typeof Quote;
  subtypes?: string[];
}[] = [
  {
    id: "quote",
    name: "Quote Card",
    icon: Quote,
    subtypes: ["Stat", "Dictionary", "CTA", "Announcement"],
  },
  { id: "background", name: "Background", icon: ImageIcon },
  { id: "text-on-bg", name: "Text on Background", icon: TypeIcon },
  { id: "upload", name: "Upload Own", icon: Upload },
];

const platformPlaceholders: Record<string, string> = {
  "ig-post": "A flat-lay of a lavender latte on a pale pink table, soft morning light…",
  "ig-story": "Vertical close-up of steam curling off an oat-milk cap, warm tones…",
  tiktok: "Dynamic vertical shot of a barista pulling espresso, motion blur, cinematic…",
  facebook: "Wide cafe interior, golden hour, customers chatting in soft focus…",
  linkedin: "Professional barista at work, editorial style, neutral palette…",
  threads: "Square minimal product still life of a pastry on linen…",
  pinterest: "Tall pin: layered iced matcha with ingredients fanned out, top down…",
};

const promptSuggestions = [
  "Soft morning light",
  "Flat-lay composition",
  "Editorial styling",
  "Pastel palette",
  "Shallow depth of field",
  "Negative space for text",
];

function ImageStudioPage() {
  const [platform, setPlatform] = useState<(typeof platforms)[number]>(platforms[0]);
  const [imgType, setImgType] = useState<ImageType>("quote");
  const [subtype, setSubtype] = useState<string>("Stat");
  const [content, setContent] = useState("");
  const [highlights, setHighlights] = useState<Set<string>>(new Set());
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState<"idle" | "polishing" | "generating" | "done">(
    "idle",
  );
  const [polishedPrompt, setPolishedPrompt] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();

  const maxKeywords = 5;
  const aspect = useMemo(() => `${platform.w} / ${platform.h}`, [platform]);

  const toggleHighlight = (word: string) => {
    setHighlights((prev) => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else if (next.size < maxKeywords) {
        next.add(word);
      } else {
        toast.error(`Max ${maxKeywords} keywords (settings)`);
        return prev;
      }
      return next;
    });
  };

  const words = useMemo(
    () => content.split(/(\s+)/).filter((w) => w.length > 0),
    [content],
  );

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Add a prompt first");
      return;
    }
    setStage("polishing");
    setTimeout(() => {
      setPolishedPrompt(
        `${prompt.trim()} — ${platform.name.toLowerCase()} composition, ${[...highlights].join(", ") || "balanced palette"}, brand-aligned, 4k detail`,
      );
      setStage("generating");
      setTimeout(() => {
        setStage("done");
        toast.success("Image ready");
      }, 1100);
    }, 900);
  };

  const isLoading = stage === "polishing" || stage === "generating";

  return (
    <AppLayout title="Image Studio">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeader
            title="Image Studio"
            description="Generate platform-perfect imagery in seconds."
          />
          <div className="text-xs text-foreground/70 glass-panel rounded-lg px-3 py-1.5">
            Images this month:{" "}
            <span className="font-semibold text-foreground">47</span>{" "}
            <span className="text-foreground/60">(~$1.88)</span>
          </div>
        </div>

        {/* Platform selector */}
        <SurfaceCard className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60">
            Platform
          </div>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p)}
                className={cn(
                  "px-3 py-2 text-xs rounded-lg border transition-colors text-left",
                  platform.id === p.id
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-secondary/30 border-border/40 text-card-foreground/80 hover:bg-secondary/50",
                )}
              >
                <div className="font-semibold">{p.name}</div>
                <div className="text-[10px] opacity-70">
                  {p.w} × {p.h}
                </div>
              </button>
            ))}
          </div>
        </SurfaceCard>

        {/* Image type cards */}
        <SurfaceCard className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60">
            Image type
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {imageTypes.map((t) => {
              const Icon = t.icon;
              const active = imgType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setImgType(t.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                      : "border-border/40 bg-secondary/20 hover:bg-secondary/40",
                  )}
                >
                  <Icon className="h-5 w-5 mb-2 text-card-foreground" />
                  <div className="font-semibold text-card-foreground text-sm">
                    {t.name}
                  </div>
                  {t.subtypes && (
                    <div className="text-[11px] text-card-foreground/60 mt-1">
                      {t.subtypes.join(" · ")}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {imgType === "quote" && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
              {imageTypes[0].subtypes!.map((s) => {
                const Icon =
                  s === "Stat"
                    ? TrendingUp
                    : s === "Dictionary"
                      ? BookOpen
                      : s === "CTA"
                        ? Megaphone
                        : Sparkles;
                return (
                  <button
                    key={s}
                    onClick={() => setSubtype(s)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors",
                      subtype === s
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-secondary/30 border-border/40 text-card-foreground/80",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </SurfaceCard>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          {/* Left: content + prompt */}
          <SurfaceCard className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60">
                  Content (tap words to highlight)
                </label>
                <span className="text-[11px] text-card-foreground/60">
                  {highlights.size}/{maxKeywords} keywords
                </span>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the post copy this image supports…"
                className="min-h-[100px] bg-secondary/30 border-border/40 text-card-foreground placeholder:text-card-foreground/40"
              />
              {words.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-secondary/20 border border-border/30 text-sm leading-relaxed">
                  {words.map((w, i) => {
                    const clean = w.trim();
                    if (!clean) return <span key={i}>{w}</span>;
                    const active = highlights.has(clean.toLowerCase());
                    return (
                      <button
                        key={i}
                        onClick={() => toggleHighlight(clean.toLowerCase())}
                        className={cn(
                          "rounded px-0.5 transition-colors",
                          active
                            ? "bg-accent text-accent-foreground font-semibold"
                            : "hover:bg-secondary/50 text-card-foreground/80",
                        )}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60 block mb-2">
                Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={platformPlaceholders[platform.id]}
                className="min-h-[120px] bg-secondary/30 border-border/40 text-card-foreground placeholder:text-card-foreground/40"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {promptSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setPrompt((p) => (p ? `${p}, ${s.toLowerCase()}` : s))
                    }
                    className="px-2.5 py-1 text-[11px] rounded-full bg-secondary/30 border border-border/40 text-card-foreground/80 hover:bg-secondary/50"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-11"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              {stage === "polishing"
                ? "Improving prompt…"
                : stage === "generating"
                  ? "Generating image…"
                  : "Generate"}
            </Button>
          </SurfaceCard>

          {/* Right: result */}
          <SurfaceCard className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60">
                {platform.name} · {platform.w}×{platform.h}
              </span>
            </div>

            <div
              className="w-full max-w-full mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-accent/30 via-secondary/40 to-muted/40 grid place-items-center"
              style={{ aspectRatio: aspect, maxHeight: 460 }}
            >
              {stage === "done" ? (
                <div className="text-center text-card-foreground/70 p-6">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                  <div className="text-sm font-medium">Generated image</div>
                  <div className="text-xs opacity-70">{subtype} · {imgType}</div>
                </div>
              ) : isLoading ? (
                <div className="text-center text-card-foreground/70">
                  <div className="h-10 w-10 mx-auto mb-2 border-2 border-card-foreground/20 border-t-accent rounded-full animate-spin" />
                  <div className="text-sm">
                    {stage === "polishing" ? "Improving prompt…" : "Generating image…"}
                  </div>
                </div>
              ) : (
                <div className="text-center text-card-foreground/50">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                  <div className="text-sm">Your image will appear here</div>
                </div>
              )}
            </div>

            {stage === "done" && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button size="sm" onClick={() => toast.success("Used in next post")}>
                    <Check className="h-4 w-4" /> Use This
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleGenerate}>
                    <RotateCw className="h-4 w-4" /> Regenerate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStage("idle")}>
                    <Pencil className="h-4 w-4" /> Edit Prompt
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Downloading…")}
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-card-foreground/60 py-2 border-t border-border/30">
                    Assign to a post
                    <ChevronDown className="h-3.5 w-3.5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="rounded-lg border border-border/40 bg-secondary/20 p-2 inline-block">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </div>
                    {scheduleDate && (
                      <div className="mt-2 text-xs text-card-foreground/70">
                        Will attach to post on{" "}
                        <span className="font-semibold text-card-foreground">
                          {scheduleDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-card-foreground/60 py-2 border-t border-border/30">
                    Prompt used
                    <ChevronDown className="h-3.5 w-3.5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 text-xs">
                    <div className="rounded-lg bg-secondary/30 p-3">
                      <div className="font-semibold text-card-foreground/60 mb-1">
                        Original
                      </div>
                      <div className="text-card-foreground/80">{prompt}</div>
                    </div>
                    <div className="rounded-lg bg-accent/10 border border-accent/30 p-3">
                      <div className="font-semibold text-card-foreground/60 mb-1">
                        Polished
                      </div>
                      <div className="text-card-foreground/80">{polishedPrompt}</div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </SurfaceCard>
        </div>
      </div>
    </AppLayout>
  );
}
