import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Mic,
  Plus,
  X,
  Copy,
  Check,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Instagram,
  Music2,
  AtSign,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/polish")({
  head: () => ({
    meta: [
      { title: "Polish — Turn raw thoughts into platform-ready posts" },
      {
        name: "description",
        content:
          "Speak or type a rough idea, add evidence, and polish it into ready-to-post content for every channel.",
      },
    ],
  }),
  component: PolishPage,
});

type Platform = {
  id: string;
  name: string;
  icon: React.ReactNode;
  ratio?: string;
  hasImage: boolean;
};

const PLATFORMS: Platform[] = [
  { id: "threads", name: "Threads", icon: <AtSign className="h-4 w-4" />, hasImage: false },
  { id: "ig-post", name: "Instagram Post", icon: <Instagram className="h-4 w-4" />, ratio: "1080×1350", hasImage: true },
  { id: "ig-reels", name: "Instagram Reels", icon: <Instagram className="h-4 w-4" />, ratio: "1080×1920", hasImage: true },
  { id: "tiktok", name: "TikTok", icon: <Music2 className="h-4 w-4" />, ratio: "1080×1920", hasImage: true },
];

type PlatformMapping = { platform: string; contentType: string; label: string };

const PLATFORM_MAP: Record<string, PlatformMapping> = {
  threads:    { platform: "threads",   contentType: "post", label: "Post" },
  "ig-post":  { platform: "instagram", contentType: "post", label: "Caption" },
  "ig-reels": { platform: "instagram", contentType: "reel", label: "Caption" },
  tiktok:     { platform: "tiktok",    contentType: "post", label: "Content" },
};

const EVIDENCE_CHIPS: { label: string; template: string }[] = [
  { label: "Add a stat", template: "📊 Stat: [e.g. 73% of customers said…]" },
  { label: "Add a quote", template: '💬 Quote: "[exact quote]" — [name]' },
  { label: "Add a price", template: "💰 Price: $[amount] (was $[original])" },
  { label: "Add a date", template: "📅 Date: [day, month + time]" },
  { label: "Add a testimonial", template: '⭐ Testimonial: "[customer words]" — [first name]' },
  { label: "Add a source", template: "🔗 Source: [URL or publication name]" },
];

function PolishPage() {
  const [idea, setIdea] = useState("");
  const [evidence, setEvidence] = useState("");
  const [recording, setRecording] = useState(false);

  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PLATFORMS.map((p) => [p.id, ["threads", "tiktok"].includes(p.id)])),
  );
  const [imageOn, setImageOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PLATFORMS.map((p) => [p.id, p.hasImage])),
  );
  const [oneImageForAll, setOneImageForAll] = useState(false);

  const [voice, setVoice] = useState<"personal" | "business">("business");
  const [scheduleDate, setScheduleDate] = useState("");
  const [keyDetailsOpen, setKeyDetailsOpen] = useState(false);
  const [keyDetails, setKeyDetails] = useState("");

  type PlatformResult = { contentId?: string; fields: { label: string; value: string }[] };
  const [results, setResults] = useState<Record<string, PlatformResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [scheduleSelected, setScheduleSelected] = useState<Record<string, boolean>>({});

  const wordCount = useMemo(() => idea.trim().split(/\s+/).filter(Boolean).length, [idea]);
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const imagesCount = PLATFORMS.filter((p) => selected[p.id] && p.hasImage && imageOn[p.id]).length;

  const handleMicToggle = () => {
    if (recording) {
      setRecording(false);
      setIdea((cur) => (cur ? cur + " " : "") + "(...transcribed thought captured.)");
      toast.success("Transcript captured");
    } else {
      setRecording(true);
      toast("Listening... speak naturally");
    }
  };

  const insertEvidence = (template: string) => {
    setEvidence((cur) => (cur ? cur + "\n" : "") + template);
  };

  const togglePlatform = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const toggleImage = (id: string) => setImageOn((s) => ({ ...s, [id]: !s[id] }));
  const setAllSelected = (val: boolean) =>
    setSelected(Object.fromEntries(PLATFORMS.map((p) => [p.id, val])));
  const setAllImages = (val: boolean) =>
    setImageOn(Object.fromEntries(PLATFORMS.map((p) => [p.id, p.hasImage && val])));

  const handleGenerate = async () => {
    if (!idea.trim()) { toast.error("Add a thought to polish first"); return; }
    if (selectedCount === 0) { toast.error("Pick at least one platform"); return; }

    setLoading(true);
    setResults(null);

    const voiceName = voice === "personal" ? "Five" : "Wizard Zen Labs";
    const activePlatforms = PLATFORMS.filter((p) => selected[p.id]);

    try {
      const entries = await Promise.all(
        activePlatforms.map(async (p) => {
          const mapping = PLATFORM_MAP[p.id];
          const { data, error } = await supabase.functions.invoke("generate-content", {
            body: {
              prompt: idea,
              platform: mapping.platform,
              voiceName,
              contentType: mapping.contentType,
              facts: evidence.trim() || undefined,
            },
          });
          if (error) throw new Error(`${p.name}: ${error.message}`);
          return [p.id, { contentId: data.id, fields: [{ label: mapping.label, value: data.content }] }] as [string, PlatformResult];
        }),
      );
      setResults(Object.fromEntries(entries));
      toast.success(`Polished for ${activePlatforms.length} platform${activePlatforms.length > 1 ? "s" : ""}`);
    } catch (err) {
      toast.error((err as Error).message || "Generation failed — try again");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 1500);
  };

  const scheduledCount = Object.values(scheduleSelected).filter(Boolean).length;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-32">
        <SectionHeader
          title="Polish"
          description={`Turn a rough thought into ready-to-post content for ${selectedCount} platform${selectedCount === 1 ? "" : "s"}${imagesCount ? `, ${imagesCount} with images` : ""}.`}
        />

        <SurfaceCard className="space-y-4">
          <div className="flex flex-col items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleMicToggle}
              aria-label={recording ? "Stop recording" : "Start recording"}
              className={cn(
                "relative h-16 w-16 rounded-full grid place-items-center transition-all",
                recording
                  ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
                  : "bg-accent text-accent-foreground hover:scale-105",
              )}
            >
              {recording && (
                <span className="absolute inset-0 rounded-full bg-destructive/40 animate-ping" />
              )}
              <Mic className="h-6 w-6 relative" />
            </button>

            {recording ? (
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-destructive rounded-full animate-pulse"
                      style={{ height: `${30 + (i % 3) * 25}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-destructive">Listening...</span>
              </div>
            ) : (
              <p className="text-xs text-card-foreground/60">Tap to start talking</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
                Your Idea
              </label>
              <div className="flex items-center gap-3 text-[11px] text-card-foreground/60">
                <span>{wordCount} words</span>
                {idea && (
                  <button
                    type="button"
                    onClick={() => setIdea("")}
                    className="inline-flex items-center gap-1 hover:text-card-foreground"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
            </div>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Talk or type your rough thought here..."
              className="min-h-[250px] bg-secondary/20 border-border/40 text-card-foreground resize-y"
            />
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <div className="bg-card px-2">
                <div className="h-7 w-7 rounded-full bg-accent/20 grid place-items-center text-card-foreground">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div
            className="space-y-2 rounded-lg border border-accent/20 p-3"
            style={{ backgroundColor: "color-mix(in oklab, var(--accent) 8%, transparent)" }}
          >
            <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
              Your Evidence
            </label>
            <Textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Facts, stats, or details to weave in (optional)"
              className="min-h-[150px] bg-card border-border/40 text-card-foreground resize-y"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {EVIDENCE_CHIPS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => insertEvidence(c.template)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card hover:bg-secondary/30 transition-colors text-card-foreground/80"
                >
                  + {c.label}
                </button>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-sm font-semibold text-card-foreground">Where should this go?</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button onClick={() => setAllSelected(true)} className="px-2.5 py-1 rounded-md hover:bg-secondary/30 text-card-foreground/80">Select All</button>
              <span className="text-card-foreground/30">·</span>
              <button onClick={() => setAllSelected(false)} className="px-2.5 py-1 rounded-md hover:bg-secondary/30 text-card-foreground/80">Clear All</button>
              <span className="text-card-foreground/30">·</span>
              <button onClick={() => setAllImages(true)} className="px-2.5 py-1 rounded-md hover:bg-secondary/30 text-card-foreground/80">All Images ON</button>
              <span className="text-card-foreground/30">·</span>
              <button onClick={() => setAllImages(false)} className="px-2.5 py-1 rounded-md hover:bg-secondary/30 text-card-foreground/80">All Images OFF</button>
              <span className="text-card-foreground/30">·</span>
              <label className="flex items-center gap-2 px-2 py-1 cursor-pointer">
                <Switch checked={oneImageForAll} onCheckedChange={setOneImageForAll} />
                <span className="text-card-foreground/80">One Image for All</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map((p) => {
              const isSelected = selected[p.id];
              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-xl border p-3 transition-all cursor-pointer space-y-2",
                    isSelected
                      ? "border-accent bg-accent/10 ring-1 ring-accent/40"
                      : "border-border/40 bg-secondary/15 hover:bg-secondary/25",
                  )}
                  onClick={() => togglePlatform(p.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="h-8 w-8 rounded-lg bg-card grid place-items-center text-card-foreground">
                      {p.icon}
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => togglePlatform(p.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-card-foreground leading-tight">{p.name}</div>
                    {p.ratio && <div className="text-[10px] text-card-foreground/60 mt-0.5">{p.ratio}</div>}
                  </div>
                  {p.hasImage ? (
                    <div
                      className="flex items-center justify-between pt-1 border-t border-border/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[11px] text-card-foreground/70 inline-flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Image
                      </span>
                      <Switch checked={!!imageOn[p.id]} onCheckedChange={() => toggleImage(p.id)} />
                    </div>
                  ) : (
                    <div className="text-[10px] text-card-foreground/50 pt-1 border-t border-border/30">
                      Text only
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">Voice</label>
              <div className="inline-flex rounded-lg border border-border/40 p-0.5 bg-secondary/20">
                {([["personal", "Five"], ["business", "Wizard Zen"]] as const).map(([v, label]) => (
                  <button
                    key={v}
                    onClick={() => setVoice(v)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                      voice === v
                        ? "bg-accent text-accent-foreground"
                        : "text-card-foreground/70 hover:text-card-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" /> Schedule for
              </label>
              <Input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="bg-secondary/20 border-border/40 text-card-foreground h-9"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setKeyDetailsOpen((o) => !o)}
              className="flex items-center gap-1.5 text-xs font-medium text-card-foreground/80 hover:text-card-foreground"
            >
              {keyDetailsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              Key details to preserve
            </button>
            {keyDetailsOpen && (
              <Input
                value={keyDetails}
                onChange={(e) => setKeyDetails(e.target.value)}
                placeholder="e.g. always mention 'family-owned since 1998', never use the word 'cheap'"
                className="mt-2 bg-secondary/20 border-border/40 text-card-foreground"
              />
            )}
          </div>
        </SurfaceCard>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          size="lg"
          className="w-full text-base h-12 font-semibold"
        >
          {loading ? "Generating..." : `Polish This (${selectedCount} platform${selectedCount === 1 ? "" : "s"}${imagesCount ? `, ${imagesCount} with images` : ""})`}
        </Button>

        {results && (
          <div className="space-y-4">
            <SectionHeader title="Polished results" description="Edit, copy, or schedule each one." />
            {PLATFORMS.filter((p) => selected[p.id]).map((p) => {
              const r = results[p.id];
              if (!r) return null;
              return (
                <SurfaceCard key={p.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-accent/15 grid place-items-center text-card-foreground">
                        {p.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-card-foreground">{p.name}</div>
                        {p.ratio && imageOn[p.id] && p.hasImage && (
                          <div className="text-[10px] text-card-foreground/60">Image · {p.ratio}</div>
                        )}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-card-foreground/80 cursor-pointer">
                      <Checkbox
                        checked={!!scheduleSelected[p.id]}
                        onCheckedChange={(v) => setScheduleSelected((s) => ({ ...s, [p.id]: !!v }))}
                      />
                      Schedule
                    </label>
                  </div>

                  <div className="space-y-3">
                    {r.fields.map((f) => (
                      <div key={f.label} className="rounded-lg bg-secondary/15 border border-border/30 p-3">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-card-foreground/60">
                            {f.label}
                          </div>
                          <button
                            onClick={() => copyText(`${p.id}-${f.label}`, f.value)}
                            className="text-card-foreground/60 hover:text-card-foreground"
                          >
                            {copied === `${p.id}-${f.label}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <div className="text-sm text-card-foreground whitespace-pre-line leading-relaxed">
                          {f.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </SurfaceCard>
              );
            })}
          </div>
        )}

        {!results && (
          <SurfaceCard className="text-center py-12 border-dashed">
            <MessageSquare className="h-8 w-8 mx-auto text-card-foreground/40 mb-2" />
            <div className="text-sm text-card-foreground/60">
              Polished versions for each platform will appear here.
            </div>
          </SurfaceCard>
        )}
      </div>

      {results && (
        <div className="fixed bottom-0 left-0 right-0 md:left-60 z-30 border-t border-border/40 bg-card/95 backdrop-blur px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="text-xs text-card-foreground/70">
              {scheduledCount} selected for scheduling
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => toast.success("Saved as drafts")}>
                Save as Drafts
              </Button>
              <Button
                onClick={() => {
                  if (scheduledCount === 0) { toast.error("Select at least one to schedule"); return; }
                  toast.success(`${scheduledCount} scheduled`);
                }}
              >
                <CalendarIcon className="h-4 w-4" /> Schedule Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
