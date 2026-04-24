import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  FileText,
  Sparkles,
  Mic,
  Copy,
  Code2,
  Calendar as CalendarIcon,
  Share2,
  Bold,
  Italic,
  Heading2,
  Link as LinkIcon,
  List,
  CheckCircle2,
  Image as ImageIcon,
  Instagram,
  Music2,
  Linkedin,
  Facebook,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create — Long-form emails and blog posts" },
      {
        name: "description",
        content: "Generate emails and blog posts in your brand voice, then turn them into social posts in one click.",
      },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  return (
    <AppLayout title="Create">
      <div className="space-y-6">
        <SectionHeader
          title="Long-form content"
          description="Write emails and blog posts in your voice — then distribute everywhere."
        />

        <Tabs defaultValue="email">
          <TabsList className="bg-secondary/30 grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="email" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Mail className="h-4 w-4 mr-1.5" /> Email
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <FileText className="h-4 w-4 mr-1.5" /> Blog Post
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <EmailTab />
          </TabsContent>
          <TabsContent value="blog" className="mt-4">
            <BlogTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

/* ============================== EMAIL TAB ============================== */

const EMAIL_CHIPS = [
  "Weekly Newsletter",
  "Product Announcement",
  "Sale / Promo",
  "Personal Story",
  "Tips and Value",
];

const EMAIL_TYPES = ["One-Time Send", "Welcome Sequence", "Nurture Sequence"] as const;

function EmailTab() {
  const [topic, setTopic] = useState("");
  const [recording, setRecording] = useState(false);
  const [emailType, setEmailType] = useState<(typeof EMAIL_TYPES)[number]>("One-Time Send");
  const [voice, setVoice] = useState<"personal" | "business">("business");

  const [generated, setGenerated] = useState(false);
  const [subject, setSubject] = useState("🌸 Spring menu drops Friday — here's what's on it");
  const [preview, setPreview] = useState("Lavender lattes, vegan citrus tart, and the return of strawberry matcha…");
  const [body, setBody] = useState(
    "Hi friend,\n\nFriday at 7am, our spring menu launches — and we couldn't be more excited.\n\nHighlights:\n• Lavender latte (locally sourced)\n• Vegan citrus tart\n• Strawberry matcha — back by popular demand\n\nWe built this menu from your feedback over the winter. Thank you.\n\nSee you Friday.",
  );
  const [ctaText, setCtaText] = useState("See the full menu");
  const [ps, setPs] = useState("P.S. First 20 customers get a free pastry sample 🍓");

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Tell us what to email about first");
      return;
    }
    setGenerated(true);
    toast.success("Email generated");
  };

  const copy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    toast.success(`${label} copied`);
  };

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
            What do you want to email about?
          </label>
          <div className="relative">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="A few sentences, bullet points, or a voice note transcript…"
              className="min-h-[120px] bg-secondary/20 border-border/40 text-card-foreground pr-14"
            />
            <button
              type="button"
              onClick={() => {
                setRecording((r) => !r);
                toast(recording ? "Stopped" : "Listening...");
              }}
              className={cn(
                "absolute top-2 right-2 h-10 w-10 rounded-full grid place-items-center transition-all",
                recording
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-primary text-primary-foreground hover:scale-105",
              )}
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {EMAIL_CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setTopic((t) => (t ? t + "\n\n" : "") + `[${c}] `)}
              className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card hover:bg-secondary/30 transition-colors text-card-foreground/80"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
              Email type
            </label>
            <div className="inline-flex flex-wrap rounded-lg border border-border/40 p-0.5 bg-secondary/20">
              {EMAIL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setEmailType(t)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    emailType === t
                      ? "bg-accent text-accent-foreground"
                      : "text-card-foreground/70 hover:text-card-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
              Voice
            </label>
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
        </div>

        <div className="flex justify-end">
          <Button onClick={handleGenerate}>
            <Sparkles className="h-4 w-4" /> Generate Email
          </Button>
        </div>
      </SurfaceCard>

      {generated && (
        <SurfaceCard className="space-y-4">
          <FieldEditor
            label="Subject Line"
            value={subject}
            onChange={setSubject}
            charCount
            onCopy={() => copy("Subject", subject)}
          />
          <FieldEditor
            label="Preview Text"
            value={preview}
            onChange={setPreview}
            charCount
            onCopy={() => copy("Preview", preview)}
          />
          <FieldEditor
            label="Body"
            value={body}
            onChange={setBody}
            multiline
            minHeight={220}
            onCopy={() => copy("Body", body)}
          />

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
              CTA Button Text
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Input
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="bg-secondary/20 border-border/40 text-card-foreground sm:max-w-xs"
              />
              <div className="rounded-lg bg-secondary/20 p-3">
                <button className="px-5 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm shadow-sm">
                  {ctaText || "Click here"}
                </button>
              </div>
            </div>
          </div>

          <FieldEditor
            label="P.S. Line"
            value={ps}
            onChange={setPs}
            onCopy={() => copy("P.S.", ps)}
          />

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
            <Button variant="secondary" onClick={() => copy("Email", `Subject: ${subject}\n\n${body}\n\n${ps}`)}>
              <Copy className="h-4 w-4" /> Copy All
            </Button>
            <Button variant="secondary" onClick={() => copy("HTML", `<h1>${subject}</h1><p>${body.replace(/\n/g, "<br/>")}</p>`)}>
              <Code2 className="h-4 w-4" /> Copy as HTML
            </Button>
            <Button variant="secondary" onClick={() => toast.success("Scheduled")}>
              <CalendarIcon className="h-4 w-4" /> Schedule
            </Button>
            <Button onClick={() => toast.success("Generating social posts from this email...")} className="ml-auto">
              <Share2 className="h-4 w-4" /> Generate Social Posts from This Email
            </Button>
          </div>
        </SurfaceCard>
      )}
    </div>
  );
}

/* ============================== BLOG TAB ============================== */

const BLOG_CHIPS = ["How-To", "Listicle", "Hot Take", "Case Study", "Ultimate Guide"];
const BLOG_LENGTHS = [
  { id: "short", label: "Short", words: "500–800" },
  { id: "standard", label: "Standard", words: "800–1200" },
  { id: "long", label: "Long", words: "1200–2000" },
] as const;

const SEO_CHECKS = [
  { label: "Keyword in title", done: true },
  { label: "Keyword in first paragraph", done: true },
  { label: "Meta description 140–160 chars", done: true },
  { label: "Slug under 60 chars", done: true },
  { label: "At least 2 H2 headings", done: true },
  { label: "Internal link added", done: false },
  { label: "Featured image alt text", done: false },
];

const DISTRIBUTION = [
  { id: "ig-carousel", label: "Instagram Carousel", icon: <Instagram className="h-4 w-4" /> },
  { id: "tiktok-script", label: "TikTok Script", icon: <Music2 className="h-4 w-4" /> },
  { id: "linkedin", label: "LinkedIn Post", icon: <Linkedin className="h-4 w-4" /> },
  { id: "pinterest", label: "Pinterest Pin", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "email", label: "Email Newsletter", icon: <Mail className="h-4 w-4" /> },
  { id: "facebook", label: "Facebook Post", icon: <Facebook className="h-4 w-4" /> },
];

function BlogTab() {
  const [topic, setTopic] = useState("");
  const [recording, setRecording] = useState(false);
  const [keyword, setKeyword] = useState("spring cafe menu 2026");
  const [length, setLength] = useState<(typeof BLOG_LENGTHS)[number]["id"]>("standard");
  const [voice, setVoice] = useState<"personal" | "business">("business");

  const [generated, setGenerated] = useState(false);
  const [seoTitle, setSeoTitle] = useState("Spring Cafe Menu 2026: Lavender, Matcha & Citrus Highlights");
  const [slug, setSlug] = useState("spring-cafe-menu-2026");
  const [meta, setMeta] = useState(
    "Discover our 2026 spring cafe menu — lavender latte, citrus tart, strawberry matcha. Available Friday.",
  );
  const [bodyDraft, setBodyDraft] = useState(
    "## Why we built this menu\n\nWe spent the winter listening to what you wanted next…\n\n## What's on it\n\n• Lavender latte\n• Vegan citrus tart\n• Strawberry matcha (returning)\n\n## When you can try it\n\nFriday at 7am — and every day after.",
  );
  const [faq, setFaq] = useState(
    "Q: When does the spring menu launch?\nA: Friday at 7am.\n\nQ: Is the citrus tart vegan?\nA: Yes — fully plant-based.",
  );
  const [selectedDist, setSelectedDist] = useState<Record<string, boolean>>({
    "ig-carousel": true,
    linkedin: true,
    email: true,
  });

  const distCount = useMemo(() => Object.values(selectedDist).filter(Boolean).length, [selectedDist]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Tell us what to write about first");
      return;
    }
    setGenerated(true);
    toast.success("Blog post drafted");
  };

  const copy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    toast.success(`${label} copied`);
  };

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
            What do you want to write about?
          </label>
          <div className="relative">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Outline, talking points, links to include…"
              className="min-h-[140px] bg-secondary/20 border-border/40 text-card-foreground pr-14"
            />
            <button
              type="button"
              onClick={() => {
                setRecording((r) => !r);
                toast(recording ? "Stopped" : "Listening...");
              }}
              className={cn(
                "absolute top-2 right-2 h-10 w-10 rounded-full grid place-items-center transition-all",
                recording
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-primary text-primary-foreground hover:scale-105",
              )}
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {BLOG_CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setTopic((t) => (t ? t + "\n\n" : "") + `[${c}] `)}
              className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card hover:bg-secondary/30 transition-colors text-card-foreground/80"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
              Target keyword
            </label>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. spring cafe menu"
              className="bg-secondary/20 border-border/40 text-card-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
              Voice
            </label>
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
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
            Length
          </label>
          <div className="inline-flex flex-wrap rounded-lg border border-border/40 p-0.5 bg-secondary/20">
            {BLOG_LENGTHS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLength(l.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  length === l.id
                    ? "bg-accent text-accent-foreground"
                    : "text-card-foreground/70 hover:text-card-foreground",
                )}
              >
                {l.label}{" "}
                <span className="opacity-60 ml-1">{l.words}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleGenerate}>
            <Sparkles className="h-4 w-4" /> Generate Blog Post
          </Button>
        </div>
      </SurfaceCard>

      {generated && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <SurfaceCard className="space-y-4">
              <FieldEditor
                label="SEO Title"
                value={seoTitle}
                onChange={setSeoTitle}
                charCount
                onCopy={() => copy("Title", seoTitle)}
              />
              <FieldEditor
                label="Slug"
                value={slug}
                onChange={setSlug}
                onCopy={() => copy("Slug", slug)}
              />
              <FieldEditor
                label="Meta Description"
                value={meta}
                onChange={setMeta}
                charCount
                onCopy={() => copy("Meta", meta)}
              />

              {/* Featured image area */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
                  Featured Image
                </label>
                <div className="aspect-[16/9] rounded-lg bg-secondary/15 border-2 border-dashed border-border/40 grid place-items-center text-center p-4">
                  <div>
                    <ImageIcon className="h-8 w-8 mx-auto text-card-foreground/40 mb-2" />
                    <div className="text-sm text-card-foreground/70">Drop a featured image or generate one</div>
                    <Button size="sm" variant="secondary" className="mt-2">
                      <Sparkles className="h-3.5 w-3.5" /> Generate image
                    </Button>
                  </div>
                </div>
              </div>

              {/* Body with toolbar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
                    Body
                  </label>
                  <button
                    onClick={() => copy("Body", bodyDraft)}
                    className="text-card-foreground/60 hover:text-card-foreground"
                    aria-label="Copy body"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="rounded-lg border border-border/40 bg-secondary/20 overflow-hidden">
                  <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border/30 bg-card/50">
                    {[Bold, Italic, Heading2, LinkIcon, List].map((Icon, i) => (
                      <button
                        key={i}
                        type="button"
                        className="h-7 w-7 grid place-items-center rounded hover:bg-secondary/40 text-card-foreground/70"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={bodyDraft}
                    onChange={(e) => setBodyDraft(e.target.value)}
                    className="min-h-[260px] border-0 bg-transparent text-card-foreground rounded-none resize-y"
                  />
                </div>
              </div>

              <FieldEditor
                label="FAQ Section"
                value={faq}
                onChange={setFaq}
                multiline
                minHeight={140}
                onCopy={() => copy("FAQ", faq)}
              />
            </SurfaceCard>

            {/* Distribution */}
            <SurfaceCard className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">Distribute everywhere</h3>
                  <p className="text-xs text-card-foreground/70">Turn this blog into posts for every channel.</p>
                </div>
                <Button onClick={() => toast.success(`Generating ${distCount} formats from this post`)}>
                  <Sparkles className="h-4 w-4" /> Generate All ({distCount})
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {DISTRIBUTION.map((d) => {
                  const on = !!selectedDist[d.id];
                  return (
                    <label
                      key={d.id}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                        on
                          ? "border-accent bg-accent/10"
                          : "border-border/40 bg-secondary/15 hover:bg-secondary/25",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-card grid place-items-center text-card-foreground">
                          {d.icon}
                        </div>
                        <div className="text-sm font-medium text-card-foreground">{d.label}</div>
                      </div>
                      <Checkbox
                        checked={on}
                        onCheckedChange={(v) =>
                          setSelectedDist((s) => ({ ...s, [d.id]: !!v }))
                        }
                      />
                    </label>
                  );
                })}
              </div>
            </SurfaceCard>
          </div>

          {/* SEO Checklist Sidebar */}
          <div className="space-y-4">
            <SurfaceCard className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-card-foreground">SEO Checklist</h3>
                <span className="text-xs text-card-foreground/60">
                  {SEO_CHECKS.filter((c) => c.done).length}/{SEO_CHECKS.length}
                </span>
              </div>
              <ul className="space-y-2">
                {SEO_CHECKS.map((c) => (
                  <li key={c.label} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      className={cn(
                        "h-4 w-4 mt-0.5 shrink-0",
                        c.done ? "text-accent" : "text-card-foreground/30",
                      )}
                    />
                    <span className={cn(c.done ? "text-card-foreground" : "text-card-foreground/60")}>
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== SHARED ============================== */

function FieldEditor({
  label,
  value,
  onChange,
  multiline,
  charCount,
  minHeight = 80,
  onCopy,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  charCount?: boolean;
  minHeight?: number;
  onCopy?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-card-foreground/70">
          {label}
        </label>
        <div className="flex items-center gap-2 text-[11px] text-card-foreground/60">
          {charCount && <span>{value.length} chars</span>}
          {onCopy && (
            <button onClick={onCopy} className="hover:text-card-foreground" aria-label={`Copy ${label}`}>
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ minHeight }}
          className="bg-secondary/20 border-border/40 text-card-foreground resize-y"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-secondary/20 border-border/40 text-card-foreground"
        />
      )}
    </div>
  );
}
