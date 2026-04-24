import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  Facebook,
  Linkedin,
  AtSign,
  Image as ImageIcon,
  Globe,
  Mail,
  FileText,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  { id: "ig-post", name: "Instagram Post", icon: <Instagram className="h-4 w-4" />, ratio: "1080×1350", hasImage: true },
  { id: "ig-reels", name: "Instagram Reels", icon: <Instagram className="h-4 w-4" />, ratio: "1080×1920", hasImage: true },
  { id: "tiktok", name: "TikTok", icon: <Music2 className="h-4 w-4" />, ratio: "1080×1920", hasImage: true },
  { id: "facebook", name: "Facebook", icon: <Facebook className="h-4 w-4" />, ratio: "1200×630", hasImage: true },
  { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="h-4 w-4" />, ratio: "1200×627", hasImage: true },
  { id: "threads", name: "Threads", icon: <AtSign className="h-4 w-4" />, ratio: "1080×1080", hasImage: true },
  { id: "pinterest", name: "Pinterest", icon: <ImageIcon className="h-4 w-4" />, ratio: "1000×1500", hasImage: true },
  { id: "gbp", name: "Google Business", icon: <Globe className="h-4 w-4" />, hasImage: false },
  { id: "email", name: "Email", icon: <Mail className="h-4 w-4" />, hasImage: false },
  { id: "blog", name: "Blog", icon: <FileText className="h-4 w-4" />, hasImage: false },
];

const EVIDENCE_CHIPS: { label: string; template: string }[] = [
  { label: "Add a stat", template: "📊 Stat: [e.g. 73% of customers said…]" },
  { label: "Add a quote", template: '💬 Quote: "[exact quote]" — [name]' },
  { label: "Add a price", template: "💰 Price: $[amount] (was $[original])" },
  { label: "Add a date", template: "📅 Date: [day, month + time]" },
  { label: "Add a testimonial", template: '⭐ Testimonial: "[customer words]" — [first name]' },
  { label: "Add a source", template: "🔗 Source: [URL or publication name]" },
];

function PolishPage() {
  // Idea + evidence
  const [idea, setIdea] = useState("");
  const [evidence, setEvidence] = useState("");
  const [recording, setRecording] = useState(false);

  // Platform state
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PLATFORMS.map((p) => [p.id, ["ig-post", "linkedin", "tiktok"].includes(p.id)])),
  );
  const [imageOn, setImageOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PLATFORMS.map((p) => [p.id, p.hasImage])),
  );
  const [oneImageForAll, setOneImageForAll] = useState(false);

  // Controls
  const [voice, setVoice] = useState<"personal" | "business">("business");
  const [scheduleDate, setScheduleDate] = useState("");
  const [keyDetailsOpen, setKeyDetailsOpen] = useState(false);
  const [keyDetails, setKeyDetails] = useState("");

  // Results
  const [results, setResults] = useState<typeof MOCK_RESULTS | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [scheduleSelected, setScheduleSelected] = useState<Record<string, boolean>>({});

  const wordCount = useMemo(() => idea.trim().split(/\s+/).filter(Boolean).length, [idea]);
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const imagesCount = PLATFORMS.filter((p) => selected[p.id] && p.hasImage && imageOn[p.id]).length;

  // Handlers
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

  const handleGenerate = () => {
    if (!idea.trim()) {
      toast.error("Add a thought to polish first");
      return;
    }
    if (selectedCount === 0) {
      toast.error("Pick at least one platform");
      return;
    }
    setResults(MOCK_RESULTS);
    toast.success(`Polished for ${selectedCount} platform${selectedCount > 1 ? "s" : ""}`);
  };

  const copyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 1500);
  };

  const scheduledCount = Object.values(scheduleSelected).filter(Boolean).length;

  return (
    <AppLayout title="Polish">
      <div className="space-y-6 pb-24">
        <SectionHeader
          title="Polish a rough thought into ready-to-post content"
          description="Talk it out or type it. Add the facts. We'll rewrite it for every platform you care about."
        />

        {/* IDEA CARD */}
        <SurfaceCard className="space-y-4">
          {/* Mic */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleMicToggle}
              aria-label={recording ? "Stop recording" : "Start recording"}
              className={cn(
                "relative h-16 w-16 rounded-full grid place-items-center transition-all shadow-md",
                recording
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-primary text-primary-foreground hover:scale-105",
              )}
            >
              {recording && (
                <span className="absolute inset-0 rounded-full bg-destructive/40 animate-ping" />
              )}
              <Mic className="h-7 w-7 relative" />
            </button>

            {recording ? (
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <span className="flex items-end gap-0.5 h-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="w-1 bg-destructive rounded-full animate-pulse"
                      style={{
                        height: `${30 + (i % 3) * 20}%`,
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </span>
                Listening...
              </div>
            ) : (
              <div className="text-xs text-card-foreground/60">Tap to start talking</div>
            )}
          </div>

          {/* Idea textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
                Your Idea
              </label>
              <div className="flex items-center gap-3 text-xs text-card-foreground/60">
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

          {/* Divider with + */}
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

          {/* Evidence textarea */}
          <div className="space-y-2 rounded-lg bg-accent/8 border border-accent/20 p-3" style={{ backgroundColor: "color-mix(in oklab, var(--accent) 8%, transparent)" }}>
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

        {/* PLATFORM SELECTOR */}
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
                    {p.ratio && (
                      <div className="text-[10px] text-card-foreground/60 mt-0.5">{p.ratio}</div>
                    )}
                  </div>
                  {p.hasImage ? (
                    <div
                      className="flex items-center justify-between pt-1 border-t border-border/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[11px] text-card-foreground/70 inline-flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Image
                      </span>
                      <Switch
                        checked={!!imageOn[p.id]}
                        onCheckedChange={() => toggleImage(p.id)}
                      />
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

        {/* CONTROLS */}
        <SurfaceCard className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">Voice</label>
              <div className="inline-flex rounded-lg border border-border/40 p-0.5 bg-secondary/20">
                {(["personal", "business"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVoice(v)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors",
                      voice === v
                        ? "bg-accent text-accent-foreground"
                        : "text-card-foreground/70 hover:text-card-foreground",
                    )}
                  >
                    {v}
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

        {/* GENERATE */}
        <Button
          onClick={handleGenerate}
          size="lg"
          className="w-full text-base h-12 font-semibold"
        >
          Polish This ({selectedCount} platform{selectedCount === 1 ? "" : "s"}, {imagesCount} with image{imagesCount === 1 ? "" : "s"})
        </Button>

        {/* RESULTS */}
        {results && (
          <div className="space-y-4">
            <SectionHeader title="Polished results" description="Edit, copy, or schedule each one." />

            {PLATFORMS.filter((p) => selected[p.id]).map((p) => {
              const r = results[p.id as keyof typeof results];
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
                            aria-label={`Copy ${f.label}`}
                          >
                            {copied === `${p.id}-${f.label}` ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
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

      {/* STICKY FOOTER */}
      {results && (
        <div className="fixed bottom-0 left-0 right-0 md:left-60 z-30 border-t border-border/40 bg-card/95 backdrop-blur px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="text-xs text-card-foreground/70">
              {scheduledCount} selected for scheduling
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => toast.success("Saved as drafts")}
              >
                Save as Drafts
              </Button>
              <Button
                onClick={() => {
                  if (scheduledCount === 0) {
                    toast.error("Select at least one to schedule");
                    return;
                  }
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

const MOCK_RESULTS = {
  "ig-post": {
    fields: [
      { label: "Caption", value: "✨ Big news ✨ Our spring menu drops Friday — think lavender lattes, citrus tarts, and the comeback of strawberry matcha 🍓\n\nSave this post so you don't miss it. Which one are you trying first? 👇" },
      { label: "Hashtags", value: "#SpringMenu #LocalCafe #SmallBusiness #CafeLife #SeasonalDrinks" },
    ],
  },
  "ig-reels": {
    fields: [
      { label: "Hook (first 3s)", value: "POV: your favorite cafe just dropped the spring menu" },
      { label: "Caption", value: "Lavender lattes, citrus tarts, and strawberry matcha 🌸 Friday at 7am. Save this so you don't forget." },
      { label: "Hashtags", value: "#Reels #SpringMenu #CafeReels #FYP" },
    ],
  },
  tiktok: {
    fields: [
      { label: "Hook (first 3s)", value: "Stop scrolling — the spring menu you've been begging for is BACK." },
      { label: "SEO title", value: "spring menu cafe 2026 lavender latte strawberry matcha" },
      { label: "Caption (with SEO wall)", value: "Lavender latte. Citrus tart. Strawberry matcha. All back Friday at 7am 🌸\n\n.\n.\n.\nspring menu, cafe near me, lavender latte recipe, matcha cafe, small business cafe" },
      { label: "Hashtags", value: "#fyp #cafetok #springmenu #matchatok #smallbusiness" },
      { label: "On-screen text", value: "0–3s: SPRING MENU IS BACK\n3–7s: lavender latte 🪻\n7–11s: citrus tart 🍋\n11–15s: strawberry matcha 🍓" },
      { label: "Audio suggestion", value: "Trending: 'aesthetic cafe' lo-fi (matches mood + 30k recent uses)" },
      { label: "Cover text", value: "SPRING MENU\n7AM FRIDAY" },
    ],
  },
  facebook: {
    fields: [
      { label: "Post", value: "Mark your calendars 📅 Our brand new spring menu launches this Friday at 7am. Expect lavender lattes, vegan citrus tarts, and the long-awaited return of strawberry matcha. Save the date and bring a friend!" },
    ],
  },
  linkedin: {
    fields: [
      { label: "Post", value: "We're proud to announce our spring menu launch this Friday — a refresh built entirely from feedback our community shared over the winter season.\n\nA few highlights:\n• Lavender latte (locally sourced)\n• Citrus tart, vegan-friendly\n• Strawberry matcha returns by popular demand\n\nThank you to every customer who took the time to tell us what you wanted next." },
    ],
  },
  threads: {
    fields: [
      { label: "Post", value: "spring menu drops friday 🌸 lavender latte, citrus tart, strawberry matcha. who's coming?" },
    ],
  },
  pinterest: {
    fields: [
      { label: "Pin title", value: "Spring Cafe Menu 2026: Lavender Lattes & Strawberry Matcha" },
      { label: "Description", value: "Discover our new spring drinks and pastries — lavender latte, citrus tart, and strawberry matcha. Available Friday." },
    ],
  },
  gbp: {
    fields: [
      { label: "Update", value: "Our spring menu launches Friday at 7am! Stop in for lavender lattes, citrus tarts, and strawberry matcha." },
    ],
  },
  email: {
    fields: [
      { label: "Subject", value: "🌸 Spring menu drops Friday — here's what's on it" },
      { label: "Body", value: "Hi friend,\n\nFriday at 7am, our spring menu launches — and we couldn't be more excited.\n\nHighlights:\n• Lavender latte\n• Vegan citrus tart\n• Strawberry matcha (back by demand)\n\nSee you Friday." },
    ],
  },
  blog: {
    fields: [
      { label: "Title", value: "What's on the Spring 2026 Menu (and Why)" },
      { label: "Excerpt", value: "We refreshed the menu based on what you told us all winter. Here's the full lineup, launching Friday." },
    ],
  },
};
