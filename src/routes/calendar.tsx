import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  FileText,
  Music2,
  CalendarDays,
  Columns3,
  ListChecks,
  Copy,
  Check,
  Flag,
  Trash2,
  GripVertical,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Content Studio" },
      { name: "description", content: "Plan, review, and schedule social content across calendar, kanban, and task list views." },
    ],
  }),
  component: CalendarPage,
});

// ---------- Types & mock data ----------

type Status = "generated" | "review" | "approved" | "posted" | "flagged";
type VoiceKey = "personal" | "business";
type PlatformKey =
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "facebook"
  | "threads"
  | "pinterest"
  | "email"
  | "blog";

type ContentItem = {
  id: string;
  day: number; // day of month
  status: Status;
  platform: PlatformKey;
  voice: VoiceKey;
  preview: string;
  hasImage: boolean;
  scheduledAt: string; // display string
  sequence?: string;
};

const STATUS_META: Record<Status, { label: string; bar: string; dot: string; chip: string }> = {
  generated: {
    label: "Generated",
    bar: "bg-slate-400",
    dot: "bg-slate-400",
    chip: "bg-slate-100 text-slate-700 border-slate-200",
  },
  review: {
    label: "In Review",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
    chip: "bg-amber-50 text-amber-800 border-amber-200",
  },
  approved: {
    label: "Approved",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  posted: {
    label: "Posted",
    bar: "bg-sky-500",
    dot: "bg-sky-500",
    chip: "bg-sky-50 text-sky-700 border-sky-200",
  },
  flagged: {
    label: "Flagged",
    bar: "bg-red-500",
    dot: "bg-red-500",
    chip: "bg-red-50 text-red-700 border-red-200",
  },
};

const STATUS_ORDER: Status[] = ["generated", "review", "approved", "posted", "flagged"];

const PLATFORM_META: Record<PlatformKey, { label: string; Icon: React.ComponentType<{ className?: string }>; accent?: string }> = {
  instagram: { label: "Instagram", Icon: Instagram },
  tiktok: { label: "TikTok", Icon: Music2 },
  linkedin: { label: "LinkedIn", Icon: Linkedin },
  facebook: { label: "Facebook", Icon: Facebook },
  threads: { label: "Threads", Icon: Music2 },
  pinterest: { label: "Pinterest", Icon: ImageIcon },
  email: { label: "Email", Icon: Mail, accent: "border-l-purple-500" },
  blog: { label: "Blog", Icon: FileText, accent: "border-l-teal-500" },
};

const PERSONAL_NAME = "Five";
const BUSINESS_NAME = "Wizard Zen";

const INITIAL_ITEMS: ContentItem[] = [
  { id: "c1", day: 2, status: "approved", platform: "instagram", voice: "business", preview: "dragon fruit heat that doesn't quit — bottle drop friday", hasImage: true, scheduledAt: "Apr 2 · 10:00", sequence: "Spring drop" },
  { id: "c2", day: 4, status: "review", platform: "linkedin", voice: "personal", preview: "running a CBD brand solo while holding a 9-to-5 — what i learned this week", hasImage: false, scheduledAt: "Apr 4 · 09:00" },
  { id: "c3", day: 4, status: "generated", platform: "tiktok", voice: "business", preview: "pour test: scotch bonnet on eggs, cbd ritual edition", hasImage: true, scheduledAt: "Apr 4 · 17:30" },
  { id: "c4", day: 5, status: "posted", platform: "facebook", voice: "business", preview: "weekend bundle live — two bottles, one ritual", hasImage: true, scheduledAt: "Apr 5 · 12:00" },
  { id: "c5", day: 5, status: "approved", platform: "email", voice: "business", preview: "your weekly drop is here — open for the dragon fruit story", hasImage: false, scheduledAt: "Apr 5 · 08:00", sequence: "Newsletter" },
  { id: "c6", day: 9, status: "review", platform: "instagram", voice: "personal", preview: "real talk: black women in hemp/cbd deserve honest info", hasImage: false, scheduledAt: "Apr 9 · 11:00" },
  { id: "c7", day: 12, status: "flagged", platform: "threads", voice: "personal", preview: "the unsexy part of building a brand nobody talks about", hasImage: false, scheduledAt: "Apr 12 · 08:30" },
  { id: "c8", day: 14, status: "generated", platform: "pinterest", voice: "business", preview: "pin: 5 ways to ritualize hot sauce on weeknight dinners", hasImage: true, scheduledAt: "Apr 14 · 15:00" },
  { id: "c9", day: 16, status: "approved", platform: "blog", voice: "business", preview: "ultimate guide: cbd in food, why format matters more than dose", hasImage: true, scheduledAt: "Apr 16 · 14:00", sequence: "Pillar content" },
  { id: "c10", day: 18, status: "posted", platform: "instagram", voice: "business", preview: "behind the bottle — two-phase production explained", hasImage: true, scheduledAt: "Apr 18 · 10:00" },
  { id: "c11", day: 22, status: "review", platform: "tiktok", voice: "business", preview: "live q&a with five — what's actually in the sauce", hasImage: true, scheduledAt: "Apr 22 · 19:00" },
  { id: "c12", day: 24, status: "generated", platform: "linkedin", voice: "personal", preview: "wholesale pitch deck, version 4 — what changed and why", hasImage: false, scheduledAt: "Apr 24 · 09:30" },
  { id: "c13", day: 26, status: "approved", platform: "email", voice: "personal", preview: "nurture email 2: the build, honestly", hasImage: false, scheduledAt: "Apr 26 · 07:00", sequence: "Nurture" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ---------- Page ----------

type ViewMode = "calendar" | "kanban" | "tasks";
type VoiceFilter = "all" | "personal" | "business";

function CalendarPage() {
  const [items, setItems] = useState<ContentItem[]>(INITIAL_ITEMS);
  const [view, setView] = useState<ViewMode>("calendar");
  const [voiceFilter, setVoiceFilter] = useState<VoiceFilter>("all");
  const [splitView, setSplitView] = useState(false);

  const filtered = useMemo(() => {
    if (splitView || voiceFilter === "all") return items;
    return items.filter((i) => i.voice === voiceFilter);
  }, [items, voiceFilter, splitView]);

  const cycleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const next = STATUS_ORDER[(STATUS_ORDER.indexOf(i.status) + 1) % STATUS_ORDER.length];
        return { ...i, status: next };
      }),
    );
  };

  const setStatus = (id: string, status: Status) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const removeItems = (ids: string[]) => {
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
  };

  return (
    <AppLayout title="Calendar">
      <div className="space-y-5">
        <SectionHeader
          title="Content calendar"
          description="One source of truth across personal and business voices."
          action={
            <div className="inline-flex rounded-lg border border-border bg-secondary/30 p-1">
              <ViewBtn active={view === "calendar"} onClick={() => setView("calendar")} icon={<CalendarDays className="h-3.5 w-3.5" />} label="Calendar" />
              <ViewBtn active={view === "kanban"} onClick={() => setView("kanban")} icon={<Columns3 className="h-3.5 w-3.5" />} label="Kanban" />
              <ViewBtn active={view === "tasks"} onClick={() => setView("tasks")} icon={<ListChecks className="h-3.5 w-3.5" />} label="Tasks" />
            </div>
          }
        />

        {/* Voice switcher */}
        <SurfaceCard className="p-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg bg-secondary/40 p-1">
            <VoicePill active={voiceFilter === "all"} onClick={() => setVoiceFilter("all")} label="All Content" />
            <VoicePill active={voiceFilter === "personal"} onClick={() => setVoiceFilter("personal")} label={`${PERSONAL_NAME} Only`} />
            <VoicePill active={voiceFilter === "business"} onClick={() => setVoiceFilter("business")} label={`${BUSINESS_NAME} Only`} />
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-card-foreground/80">
            <span>Split view</span>
            <Switch checked={splitView} onCheckedChange={setSplitView} />
          </div>
        </SurfaceCard>

        {view === "calendar" && (
          splitView ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <CalendarView items={filtered.filter((i) => i.voice === "personal")} title={`${PERSONAL_NAME} — personal`} onCycleStatus={cycleStatus} />
              <CalendarView items={filtered.filter((i) => i.voice === "business")} title={`${BUSINESS_NAME} — business`} onCycleStatus={cycleStatus} />
            </div>
          ) : (
            <CalendarView items={filtered} onCycleStatus={cycleStatus} />
          )
        )}

        {view === "kanban" && (
          splitView ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <KanbanView items={filtered.filter((i) => i.voice === "personal")} title={`${PERSONAL_NAME}`} onSetStatus={setStatus} />
              <KanbanView items={filtered.filter((i) => i.voice === "business")} title={`${BUSINESS_NAME}`} onSetStatus={setStatus} />
            </div>
          ) : (
            <KanbanView items={filtered} onSetStatus={setStatus} />
          )
        )}

        {view === "tasks" && (
          <TaskListView items={filtered} onSetStatus={setStatus} onDelete={removeItems} />
        )}
      </div>
    </AppLayout>
  );
}

// ---------- Shared bits ----------

function ViewBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
        active ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function VoicePill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
        active ? "bg-card text-card-foreground shadow-sm" : "text-card-foreground/70 hover:text-card-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function VoiceBadge({ voice }: { voice: VoiceKey }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
        voice === "personal"
          ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
          : "bg-indigo-50 text-indigo-700 border-indigo-200"
      }`}
    >
      {voice === "personal" ? PERSONAL_NAME : BUSINESS_NAME}
    </span>
  );
}

function PlatformIcon({ platform, className }: { platform: PlatformKey; className?: string }) {
  const Icon = PLATFORM_META[platform].Icon;
  return <Icon className={className ?? "h-3.5 w-3.5"} />;
}

function StatusChip({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${m.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

// ---------- Calendar view ----------

function CalendarView({ items, title, onCycleStatus }: { items: ContentItem[]; title?: string; onCycleStatus: (id: string) => void }) {
  const [mode, setMode] = useState<"week" | "month">("month");
  const total = items.length;
  const done = items.filter((i) => i.status === "posted" || i.status === "approved").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const cells = mode === "month" ? 35 : 7;

  return (
    <SurfaceCard className="p-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border/30">
        <div>
          <div className="text-sm font-semibold text-card-foreground">{title ?? "April 2025"}</div>
          <div className="text-xs text-card-foreground/60">{done} of {total} approved or posted</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border/50 bg-secondary/20 p-1">
            <button onClick={() => setMode("week")} className={`px-2.5 py-1 text-xs rounded-md ${mode === "week" ? "bg-accent text-accent-foreground" : "text-card-foreground/70"}`}>Week</button>
            <button onClick={() => setMode("month")} className={`px-2.5 py-1 text-xs rounded-md ${mode === "month" ? "bg-accent text-accent-foreground" : "text-card-foreground/70"}`}>Month</button>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
          <Button size="sm"><Plus className="h-3.5 w-3.5" /> New</Button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between text-[11px] text-card-foreground/60 mb-1">
          <span>Weekly progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border/30 bg-secondary/20 mt-3">
        {DAYS.map((d) => (
          <div key={d} className="px-3 py-2 text-[11px] font-semibold text-card-foreground/70 text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: cells }).map((_, i) => {
          const day = i + 1;
          const dayItems = day <= 30 ? items.filter((it) => it.day === day) : [];
          return (
            <div key={i} className="min-h-[130px] border-r border-b border-border/20 p-2 last:border-r-0 group">
              <div className="text-[11px] font-medium text-card-foreground/60 mb-1.5">{day <= 30 ? day : ""}</div>
              <div className="space-y-1.5">
                {dayItems.map((it) => (
                  <CalendarCard key={it.id} item={it} onCycleStatus={onCycleStatus} />
                ))}
                {day <= 30 && dayItems.length === 0 && (
                  <button
                    onClick={() => toast.success("Generation started for this day")}
                    className="w-full border border-dashed border-border/40 rounded-md py-3 flex flex-col items-center justify-center gap-1 text-[10px] text-card-foreground/40 hover:text-card-foreground/80 hover:border-accent/60 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Generate for this day
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}

function CalendarCard({ item, onCycleStatus }: { item: ContentItem; onCycleStatus: (id: string) => void }) {
  const meta = STATUS_META[item.status];
  const accent = PLATFORM_META[item.platform].accent;

  return (
    <div
      className={`relative flex gap-1.5 rounded-md bg-secondary/15 hover:bg-secondary/30 transition-colors overflow-hidden border-l-4 border-l-transparent ${accent ?? ""}`}
    >
      <button
        aria-label="Cycle status"
        onClick={() => onCycleStatus(item.id)}
        className={`w-1 self-stretch ${meta.bar} hover:opacity-80 transition-opacity`}
      />
      <div className="flex-1 min-w-0 py-1.5 pr-1.5">
        <div className="flex items-center gap-1 mb-0.5">
          <PlatformIcon platform={item.platform} className="h-3 w-3 text-card-foreground/70" />
          <VoiceBadge voice={item.voice} />
          {item.hasImage && <ImageIcon className="h-3 w-3 text-card-foreground/50 ml-auto" />}
        </div>
        <div className="text-[11px] text-card-foreground leading-snug truncate">{item.preview.slice(0, 50)}</div>
      </div>
    </div>
  );
}

// ---------- Kanban view ----------

function KanbanView({ items, title, onSetStatus }: { items: ContentItem[]; title?: string; onSetStatus: (id: string, s: Status) => void }) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const onDrop = (status: Status) => {
    if (draggingId) {
      onSetStatus(draggingId, status);
      toast.success(`Moved to ${STATUS_META[status].label}`);
      setDraggingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {title && <div className="text-sm font-semibold text-foreground/80">{title}</div>}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {STATUS_ORDER.map((status) => {
          const list = items.filter((i) => i.status === status);
          const meta = STATUS_META[status];
          return (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(status)}
              className="rounded-xl bg-card/95 border border-border/30 shadow-sm flex flex-col min-h-[300px]"
            >
              <div className="flex items-center justify-between p-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  <span className="text-xs font-semibold text-card-foreground">{meta.label}</span>
                </div>
                <Badge variant="secondary" className="bg-secondary/40 text-card-foreground/80 text-[10px] h-5">
                  {list.length}
                </Badge>
              </div>
              <div className="p-2 space-y-2 flex-1">
                {list.map((it) => (
                  <KanbanCard key={it.id} item={it} onDragStart={() => setDraggingId(it.id)} />
                ))}
                {list.length === 0 && (
                  <div className="text-[11px] text-card-foreground/40 italic text-center py-6">Drop cards here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanCard({ item, onDragStart }: { item: ContentItem; onDragStart: () => void }) {
  const accent = PLATFORM_META[item.platform].accent;
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={() => toast.info("Edit drawer would open here")}
      className={`group rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors p-2.5 cursor-grab active:cursor-grabbing border-l-4 border-l-transparent ${accent ?? ""}`}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <GripVertical className="h-3 w-3 text-card-foreground/30" />
        <PlatformIcon platform={item.platform} className="h-3.5 w-3.5 text-card-foreground/70" />
        <VoiceBadge voice={item.voice} />
        {item.hasImage && <ImageIcon className="h-3 w-3 text-card-foreground/50 ml-auto" />}
      </div>
      <div className="text-[12px] text-card-foreground leading-snug mb-1.5">{item.preview.slice(0, 60)}</div>
      <div className="text-[10px] text-card-foreground/50">{item.scheduledAt}</div>
    </div>
  );
}

// ---------- Task list view ----------

type GroupBy = "none" | "date" | "platform" | "voice" | "status" | "sequence";

function TaskListView({ items, onSetStatus, onDelete }: { items: ContentItem[]; onSetStatus: (id: string, s: Status) => void; onDelete: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [groupOpen, setGroupOpen] = useState(false);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? items.filter((i) => i.preview.toLowerCase().includes(q)) : items;
  }, [items, search]);

  const groups = useMemo(() => {
    if (groupBy === "none") return [{ key: "All content", list: visible }];
    const map = new Map<string, ContentItem[]>();
    visible.forEach((i) => {
      let key = "—";
      if (groupBy === "date") key = `Apr ${i.day}`;
      else if (groupBy === "platform") key = PLATFORM_META[i.platform].label;
      else if (groupBy === "voice") key = i.voice === "personal" ? PERSONAL_NAME : BUSINESS_NAME;
      else if (groupBy === "status") key = STATUS_META[i.status].label;
      else if (groupBy === "sequence") key = i.sequence ?? "Standalone";
      const arr = map.get(key) ?? [];
      arr.push(i);
      map.set(key, arr);
    });
    return Array.from(map.entries()).map(([key, list]) => ({ key, list }));
  }, [visible, groupBy]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected(selected.length === visible.length ? [] : visible.map((i) => i.id));
  };

  return (
    <div className="space-y-3">
      <SurfaceCard className="p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-card-foreground/60 ml-1" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content…"
            className="border-0 bg-transparent focus-visible:ring-0 text-card-foreground"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setGroupOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-secondary/40 text-card-foreground/80 hover:bg-secondary/60"
          >
            Group by: <span className="font-medium capitalize">{groupBy}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {groupOpen && (
            <div className="absolute right-0 mt-1 w-40 rounded-lg border border-border bg-popover text-popover-foreground shadow-md z-10 p-1">
              {(["none", "date", "platform", "voice", "status", "sequence"] as GroupBy[]).map((g) => (
                <button
                  key={g}
                  onClick={() => { setGroupBy(g); setGroupOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded capitalize ${groupBy === g ? "bg-accent text-accent-foreground" : "hover:bg-secondary/40"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/20 text-[11px] text-card-foreground/70 uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2.5 text-left w-8">
                <Checkbox checked={selected.length > 0 && selected.length === visible.length} onCheckedChange={toggleAll} />
              </th>
              <th className="px-2 py-2.5 text-left w-8"></th>
              <th className="px-2 py-2.5 text-left w-10">Plat</th>
              <th className="px-3 py-2.5 text-left">Content</th>
              <th className="px-3 py-2.5 text-left">Voice</th>
              <th className="px-3 py-2.5 text-left">Scheduled</th>
              <th className="px-3 py-2.5 text-left w-10">Img</th>
              <th className="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <>
                {groupBy !== "none" && (
                  <tr key={`g-${g.key}`} className="bg-secondary/10">
                    <td colSpan={8} className="px-3 py-1.5 text-[11px] font-semibold text-card-foreground/70 uppercase tracking-wide">
                      {g.key} <span className="text-card-foreground/40">· {g.list.length}</span>
                    </td>
                  </tr>
                )}
                {g.list.map((it) => (
                  <tr key={it.id} className="border-t border-border/20 hover:bg-secondary/15">
                    <td className="px-3 py-2.5">
                      <Checkbox checked={selected.includes(it.id)} onCheckedChange={() => toggle(it.id)} />
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={`inline-block h-2 w-2 rounded-full ${STATUS_META[it.status].dot}`} title={STATUS_META[it.status].label} />
                    </td>
                    <td className="px-2 py-2.5 text-card-foreground/70">
                      <PlatformIcon platform={it.platform} className="h-4 w-4" />
                    </td>
                    <td className="px-3 py-2.5 text-card-foreground">{it.preview.slice(0, 80)}</td>
                    <td className="px-3 py-2.5"><VoiceBadge voice={it.voice} /></td>
                    <td className="px-3 py-2.5 text-card-foreground/70 text-xs">{it.scheduledAt}</td>
                    <td className="px-3 py-2.5">
                      {it.hasImage ? <ImageIcon className="h-3.5 w-3.5 text-card-foreground/60" /> : <span className="text-card-foreground/30 text-xs">—</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { navigator.clipboard.writeText(it.preview); toast.success("Copied"); }} className="p-1.5 rounded hover:bg-secondary/40 text-card-foreground/70" title="Copy">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onSetStatus(it.id, "approved")} className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600" title="Approve">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onSetStatus(it.id, "flagged")} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Flag">
                          <Flag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-sm text-card-foreground/60">No content matches your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </SurfaceCard>

      {/* Floating bulk action bar */}
      {selected.length > 0 && (
        <div className="sticky bottom-4 z-20">
          <div className="mx-auto max-w-2xl flex items-center gap-2 rounded-xl bg-card text-card-foreground shadow-lg border border-border/30 p-2.5">
            <span className="text-xs text-card-foreground/70 px-2">{selected.length} selected</span>
            <div className="flex-1" />
            <Button size="sm" variant="outline" onClick={() => { selected.forEach((id) => onSetStatus(id, "approved")); toast.success("Approved all"); setSelected([]); }}>
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => { selected.forEach((id) => onSetStatus(id, "flagged")); toast.success("Flagged"); setSelected([]); }}>
              <Flag className="h-3.5 w-3.5" /> Flag
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Reschedule modal would open")}>
              <CalendarDays className="h-3.5 w-3.5" /> Reschedule
            </Button>
            <Button size="sm" variant="destructive" onClick={() => { onDelete(selected); toast.success("Deleted"); setSelected([]); }}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
