import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Pencil,
  Copy as CopyIcon,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Content Studio" },
      {
        name: "description",
        content: "Reusable post templates organized by goal and channel.",
      },
    ],
  }),
  component: TemplatesPage,
});

const categories = [
  "All",
  "Social",
  "Email",
  "Blog",
  "Hooks",
  "CTAs",
  "Custom",
] as const;
type Category = (typeof categories)[number];

const allPlatforms = [
  "Instagram",
  "TikTok",
  "Threads",
  "LinkedIn",
  "Facebook",
  "Pinterest",
  "Email",
  "Blog",
];

type Template = {
  id: string;
  name: string;
  type: Exclude<Category, "All">;
  preview: string;
  body: string;
  platforms: string[];
};

const starters: Template[] = [
  {
    id: "t1",
    name: "Product Launch",
    type: "Social",
    preview: "Big news drop with hook → benefit → CTA + countdown.",
    body: "🚨 {product_name} is here.\n\nWe built it because {pain_point}.\n\nWhat you get:\n• {benefit_1}\n• {benefit_2}\n• {benefit_3}\n\nLive {launch_date}. Tap the link to be first in.",
    platforms: ["Instagram", "Threads", "LinkedIn"],
  },
  {
    id: "t2",
    name: "Customer Testimonial",
    type: "Social",
    preview: "Pull-quote framed by context and a soft CTA.",
    body: '"{quote}"\n\n— {customer_name}, {customer_title}\n\n{context_sentence}\n\nWant the same? {cta}',
    platforms: ["Instagram", "Facebook", "LinkedIn"],
  },
  {
    id: "t3",
    name: "Behind the Scenes",
    type: "Social",
    preview: "Show the human side — process, team, mess.",
    body: "Here's what {date} actually looked like behind the counter.\n\n{moment_1}\n{moment_2}\n{moment_3}\n\nThe reason we keep doing it: {why}",
    platforms: ["Instagram", "TikTok", "Threads"],
  },
  {
    id: "t4",
    name: "Myth Buster",
    type: "Hooks",
    preview: "Strong contrarian opener that earns the scroll-stop.",
    body: "Most people think {common_belief}.\n\nHere's what's actually true: {real_truth}.\n\nAnd why it matters for you: {payoff}",
    platforms: ["Threads", "LinkedIn", "TikTok"],
  },
  {
    id: "t5",
    name: "Quick Tip",
    type: "Social",
    preview: "One-screen value drop with a memorable closer.",
    body: "Quick tip for {audience}:\n\n{tip}\n\nTry it this week and tell me how it lands. 👇",
    platforms: ["Instagram", "LinkedIn", "Threads"],
  },
  {
    id: "t6",
    name: "Weekend CTA",
    type: "CTAs",
    preview: "Friday-flavoured nudge to convert weekend foot traffic.",
    body: "It's a {weekend_vibe} kind of weekend.\n\nWe'll be {what_youre_doing} from {open_time} — {close_time}.\n\n{special_offer}\n\nSee you there.",
    platforms: ["Instagram", "Facebook"],
  },
  {
    id: "t7",
    name: "Email Welcome",
    type: "Email",
    preview: "First touch — warm intro, expectation-set, one ask.",
    body: "Subject: Welcome in, {first_name}\n\nHi {first_name},\n\nReally glad you're here. A quick note on what to expect from this list…\n\n{expectation_1}\n{expectation_2}\n\nAnd one tiny ask: {first_action}.\n\n— {sender_name}",
    platforms: ["Email"],
  },
  {
    id: "t8",
    name: "Blog Intro Hook",
    type: "Blog",
    preview: "Three-sentence intro structure proven to keep readers.",
    body: "{specific_observation}\n\nMost {audience} respond to this by {default_response} — and it costs them {cost}.\n\nIn this post I'll show you {promise}, with {evidence_type} from {source}.",
    platforms: ["Blog"],
  },
];

const typeColor: Record<Exclude<Category, "All">, string> = {
  Social: "bg-sky-100 text-sky-700 border-sky-200",
  Email: "bg-purple-100 text-purple-700 border-purple-200",
  Blog: "bg-teal-100 text-teal-700 border-teal-200",
  Hooks: "bg-amber-100 text-amber-700 border-amber-200",
  CTAs: "bg-rose-100 text-rose-700 border-rose-200",
  Custom: "bg-slate-100 text-slate-700 border-slate-200",
};

function highlightVars(text: string) {
  const parts = text.split(/(\{[^}]+\})/g);
  return parts.map((p, i) =>
    p.startsWith("{") && p.endsWith("}") ? (
      <span
        key={i}
        className="px-1 rounded bg-accent/20 text-accent-foreground font-mono text-[11px]"
      >
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function TemplatesPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Category>("All");
  const [items, setItems] = useState<Template[]>(starters);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    type: "Social" as Exclude<Category, "All">,
    platforms: [] as string[],
    body: "",
  });

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.type === active)),
    [items, active],
  );

  const toggleDraftPlatform = (p: string) =>
    setDraft((d) => ({
      ...d,
      platforms: d.platforms.includes(p)
        ? d.platforms.filter((x) => x !== p)
        : [...d.platforms, p],
    }));

  const createTemplate = () => {
    if (!draft.name.trim() || !draft.body.trim()) {
      toast.error("Add a name and body");
      return;
    }
    const t: Template = {
      id: `t${Date.now()}`,
      name: draft.name.trim(),
      type: draft.type,
      platforms: draft.platforms,
      preview: draft.body.split("\n")[0]?.slice(0, 80) || "—",
      body: draft.body.trim(),
    };
    setItems((prev) => [t, ...prev]);
    setOpen(false);
    setDraft({ name: "", type: "Social", platforms: [], body: "" });
    toast.success("Template created");
  };

  const useTemplate = (t: Template) => {
    toast.success(`Loaded "${t.name}" into Polish`);
    navigate({ to: "/polish" });
  };

  const duplicate = (t: Template) => {
    setItems((prev) => [{ ...t, id: `t${Date.now()}`, name: `${t.name} (copy)` }, ...prev]);
    toast.success("Duplicated");
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success("Deleted");
  };

  return (
    <AppLayout title="Templates">
      <div className="space-y-5">
        <SectionHeader
          title="Templates"
          description="Start from a proven structure — fully editable in your brand voice."
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" /> Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>New template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, name: e.target.value }))
                      }
                      placeholder="e.g. Tuesday Tip"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={draft.type}
                      onValueChange={(v) =>
                        setDraft((d) => ({
                          ...d,
                          type: v as Exclude<Category, "All">,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c !== "All")
                          .map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Platforms</Label>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {allPlatforms.map((p) => {
                        const on = draft.platforms.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => toggleDraftPlatform(p)}
                            className={cn(
                              "px-2.5 py-1 text-xs rounded-full border transition-colors",
                              on
                                ? "bg-accent text-accent-foreground border-accent"
                                : "bg-secondary border-border text-foreground/80",
                            )}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">
                      Body (use {"{variable}"} placeholders)
                    </Label>
                    <Textarea
                      value={draft.body}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, body: e.target.value }))
                      }
                      placeholder="Hi {first_name}, here's {tip}…"
                      className="min-h-[160px] font-mono text-xs"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createTemplate}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-colors",
                active === c
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-secondary/30 border-border/40 text-foreground/80 hover:bg-secondary/50",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <SurfaceCard key={t.id} className="space-y-3 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-card-foreground truncate">
                    {t.name}
                  </div>
                  <span
                    className={cn(
                      "inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider",
                      typeColor[t.type],
                    )}
                  >
                    {t.type}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary/50 text-card-foreground/60"
                      aria-label="Template options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast("Edit coming soon")}>
                      <Pencil className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicate(t)}>
                      <CopyIcon className="h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => remove(t.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-card-foreground/70 leading-relaxed">
                {t.preview}
              </p>

              <div className="rounded-md bg-secondary/30 p-2.5 text-xs text-card-foreground/80 leading-relaxed max-h-24 overflow-hidden">
                {highlightVars(t.body.split("\n").slice(0, 3).join("\n"))}
                {t.body.split("\n").length > 3 && (
                  <span className="text-card-foreground/40"> …</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {t.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/40 text-card-foreground/70 border border-border/30"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <Button
                size="sm"
                className="mt-auto"
                onClick={() => useTemplate(t)}
              >
                <Sparkles className="h-3.5 w-3.5" /> Use Template
              </Button>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
