import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader, EmptyState } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Folder,
  Upload,
  Search,
  Image as ImageIcon,
  Film,
  Music,
  FileImage,
  Plus,
  Grid3x3,
  List,
  Download,
  Trash2,
  Link2,
  FolderInput,
  Inbox,
  MessageSquareQuote,
  Layers,
  Pin,
  Mic,
  Mountain,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — Content Studio" },
      { name: "description", content: "Centralized library of brand images, videos, audio, and graphics for reuse across content." },
    ],
  }),
  component: AssetsPage,
});

type AssetType = "image" | "video" | "audio" | "gif";
type FolderKey =
  | "all"
  | "unfiled"
  | "quote-cards"
  | "carousels"
  | "pinterest"
  | "videos"
  | "voice-memos"
  | "backgrounds"
  | "logos";

type Asset = {
  id: string;
  name: string;
  type: AssetType;
  folder: FolderKey;
  date: string;
  size: string;
};

const FOLDERS: { key: FolderKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", label: "All Assets", Icon: Layers },
  { key: "unfiled", label: "Unfiled", Icon: Inbox },
  { key: "quote-cards", label: "Quote Cards", Icon: MessageSquareQuote },
  { key: "carousels", label: "Carousels", Icon: Layers },
  { key: "pinterest", label: "Pinterest Pins", Icon: Pin },
  { key: "videos", label: "Videos", Icon: Film },
  { key: "voice-memos", label: "Voice Memos", Icon: Mic },
  { key: "backgrounds", label: "Backgrounds", Icon: Mountain },
  { key: "logos", label: "Logos and Brand", Icon: Sparkles },
];

const ASSETS: Asset[] = [
  { id: "a1", name: "dragon-fruit-pour-01.jpg", type: "image", folder: "quote-cards", date: "Apr 18", size: "2.1 MB" },
  { id: "a2", name: "habanero-macro.jpg", type: "image", folder: "backgrounds", date: "Apr 17", size: "3.4 MB" },
  { id: "a3", name: "bottle-hero-purple.jpg", type: "image", folder: "logos", date: "Apr 16", size: "1.8 MB" },
  { id: "a4", name: "process-clip-bottling.mp4", type: "video", folder: "videos", date: "Apr 15", size: "24.6 MB" },
  { id: "a5", name: "founder-voice-memo-04.m4a", type: "audio", folder: "voice-memos", date: "Apr 15", size: "1.2 MB" },
  { id: "a6", name: "carousel-slide-01.png", type: "image", folder: "carousels", date: "Apr 14", size: "640 KB" },
  { id: "a7", name: "carousel-slide-02.png", type: "image", folder: "carousels", date: "Apr 14", size: "612 KB" },
  { id: "a8", name: "carousel-slide-03.png", type: "image", folder: "carousels", date: "Apr 14", size: "598 KB" },
  { id: "a9", name: "pin-recipes-roundup.png", type: "image", folder: "pinterest", date: "Apr 13", size: "1.1 MB" },
  { id: "a10", name: "pin-ritual-tip.png", type: "image", folder: "pinterest", date: "Apr 13", size: "990 KB" },
  { id: "a11", name: "quote-card-five.png", type: "image", folder: "quote-cards", date: "Apr 12", size: "720 KB" },
  { id: "a12", name: "tiktok-loop-cooking.gif", type: "gif", folder: "videos", date: "Apr 12", size: "4.8 MB" },
  { id: "a13", name: "wordmark-lime-on-purple.svg", type: "image", folder: "logos", date: "Apr 10", size: "12 KB" },
  { id: "a14", name: "scotch-bonnet-still.jpg", type: "image", folder: "unfiled", date: "Apr 09", size: "2.7 MB" },
  { id: "a15", name: "kitchen-bts-clip.mp4", type: "video", folder: "videos", date: "Apr 08", size: "31.2 MB" },
  { id: "a16", name: "purple-gradient-bg.jpg", type: "image", folder: "backgrounds", date: "Apr 07", size: "1.3 MB" },
  { id: "a17", name: "podcast-clip-01.m4a", type: "audio", folder: "voice-memos", date: "Apr 06", size: "2.4 MB" },
  { id: "a18", name: "logo-stamp-mono.png", type: "image", folder: "logos", date: "Apr 04", size: "84 KB" },
];

const FILTERS: { key: AssetType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
  { key: "audio", label: "Audio" },
  { key: "gif", label: "GIFs" },
];

function AssetsPage() {
  const [active, setActive] = useState<FolderKey>("all");
  const [filter, setFilter] = useState<AssetType | "all">("all");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const counts = useMemo(() => {
    const c: Record<FolderKey, number> = {
      all: ASSETS.length,
      unfiled: 0,
      "quote-cards": 0,
      carousels: 0,
      pinterest: 0,
      videos: 0,
      "voice-memos": 0,
      backgrounds: 0,
      logos: 0,
    };
    ASSETS.forEach((a) => {
      c[a.folder] = (c[a.folder] ?? 0) + 1;
    });
    return c;
  }, []);

  const visible = useMemo(() => {
    return ASSETS.filter((a) => {
      if (active !== "all" && a.folder !== active) return false;
      if (filter !== "all" && a.type !== filter) return false;
      if (search.trim()) return a.name.toLowerCase().includes(search.toLowerCase());
      return true;
    });
  }, [active, filter, search]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const clearSelection = () => setSelected([]);

  return (
    <AppLayout title="Assets">
      <div className="space-y-5">
        <SectionHeader
          title="Asset library"
          description="Reuse imagery, video, audio, and brand files across all your content."
          action={
            <Button onClick={() => toast.success("Upload modal would open")}>
              <Upload className="h-4 w-4" /> Upload
            </Button>
          }
        />

        {/* Mobile folder tabs */}
        <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {FOLDERS.map((f) => {
              const Icon = f.Icon;
              const isActive = active === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                    isActive ? "bg-accent text-accent-foreground" : "bg-card/90 text-card-foreground/80 hover:bg-card"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {f.label}
                  <span className="ml-1 opacity-60">{counts[f.key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          {/* Desktop sidebar */}
          <SurfaceCard className="p-3 space-y-1 self-start hidden lg:block">
            {FOLDERS.map((f) => {
              const Icon = f.Icon;
              const isActive = active === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-card-foreground/80 hover:bg-secondary/40"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{f.label}</span>
                  </span>
                  <span className="text-xs opacity-70">{counts[f.key]}</span>
                </button>
              );
            })}
            <button
              onClick={() => toast.success("New folder dialog would open")}
              className="w-full mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-card-foreground/70 hover:bg-secondary/40 border border-dashed border-border/40"
            >
              <Plus className="h-4 w-4" /> New Folder
            </button>
          </SurfaceCard>

          <div className="space-y-4">
            {/* Search + view toggle + filters */}
            <SurfaceCard className="p-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-card-foreground/60 ml-1" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search assets…"
                    className="border-0 bg-transparent focus-visible:ring-0 text-card-foreground"
                  />
                </div>
                <div className="inline-flex rounded-md border border-border/50 bg-secondary/20 p-0.5">
                  <button
                    onClick={() => setLayout("grid")}
                    className={`p-1.5 rounded ${layout === "grid" ? "bg-accent text-accent-foreground" : "text-card-foreground/60"}`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setLayout("list")}
                    className={`p-1.5 rounded ${layout === "list" ? "bg-accent text-accent-foreground" : "text-card-foreground/60"}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                      filter === f.key
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/40 text-card-foreground/80 hover:bg-secondary/60"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </SurfaceCard>

            {/* Empty state */}
            {visible.length === 0 ? (
              <EmptyState
                icon={<FolderOpen className="h-6 w-6" />}
                title="No assets here yet"
                description="Upload images, videos, audio, or graphics to start building your reusable library."
                action={
                  <Button onClick={() => toast.success("Upload modal would open")} className="mt-2">
                    <Upload className="h-4 w-4" /> Upload your first asset
                  </Button>
                }
              />
            ) : layout === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {visible.map((a) => (
                  <AssetGridCard
                    key={a.id}
                    asset={a}
                    selected={selected.includes(a.id)}
                    onToggle={() => toggle(a.id)}
                  />
                ))}
              </div>
            ) : (
              <SurfaceCard className="p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/20 text-[11px] text-card-foreground/70 uppercase tracking-wide">
                    <tr>
                      <th className="px-3 py-2.5 w-8"></th>
                      <th className="px-3 py-2.5 text-left">Name</th>
                      <th className="px-3 py-2.5 text-left">Type</th>
                      <th className="px-3 py-2.5 text-left">Date</th>
                      <th className="px-3 py-2.5 text-left">Size</th>
                      <th className="px-3 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((a) => (
                      <tr key={a.id} className="border-t border-border/20 hover:bg-secondary/15">
                        <td className="px-3 py-2">
                          <Checkbox checked={selected.includes(a.id)} onCheckedChange={() => toggle(a.id)} />
                        </td>
                        <td className="px-3 py-2 text-card-foreground flex items-center gap-2">
                          <TypeIcon type={a.type} className="h-4 w-4 text-card-foreground/60" />
                          {a.name}
                        </td>
                        <td className="px-3 py-2"><TypeBadge type={a.type} /></td>
                        <td className="px-3 py-2 text-card-foreground/70 text-xs">{a.date}</td>
                        <td className="px-3 py-2 text-card-foreground/70 text-xs">{a.size}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <IconBtn label="Download" onClick={() => toast.success("Downloaded")}><Download className="h-3.5 w-3.5" /></IconBtn>
                            <IconBtn label="Assign" onClick={() => toast.success("Assigned to post")}><Link2 className="h-3.5 w-3.5" /></IconBtn>
                            <IconBtn label="Delete" onClick={() => toast.success("Deleted")}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SurfaceCard>
            )}
          </div>
        </div>

        {/* Floating bulk action bar */}
        {selected.length > 0 && (
          <div className="sticky bottom-4 z-20">
            <div className="mx-auto max-w-2xl flex items-center gap-2 rounded-xl bg-card text-card-foreground shadow-lg border border-border/30 p-2.5">
              <span className="text-xs text-card-foreground/70 px-2">{selected.length} selected</span>
              <div className="flex-1" />
              <Button size="sm" variant="outline" onClick={() => toast.success("Move-to-folder modal would open")}>
                <FolderInput className="h-3.5 w-3.5" /> Move
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Downloading…")}>
                <Download className="h-3.5 w-3.5" /> Download All
              </Button>
              <Button size="sm" variant="destructive" onClick={() => { toast.success("Deleted"); clearSelection(); }}>
                <Trash2 className="h-3.5 w-3.5" /> Delete All
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function TypeIcon({ type, className }: { type: AssetType; className?: string }) {
  const Icon = type === "video" ? Film : type === "audio" ? Music : type === "gif" ? FileImage : ImageIcon;
  return <Icon className={className} />;
}

function TypeBadge({ type }: { type: AssetType }) {
  const map: Record<AssetType, string> = {
    image: "bg-sky-50 text-sky-700 border-sky-200",
    video: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    audio: "bg-amber-50 text-amber-700 border-amber-200",
    gif: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border uppercase ${map[type]}`}>
      {type}
    </span>
  );
}

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="p-1.5 rounded hover:bg-secondary/40 text-card-foreground/70 hover:text-card-foreground"
    >
      {children}
    </button>
  );
}

function AssetGridCard({ asset, selected, onToggle }: { asset: Asset; selected: boolean; onToggle: () => void }) {
  return (
    <div
      className={`surface-card overflow-hidden group relative cursor-pointer transition-shadow ${
        selected ? "ring-2 ring-accent" : "hover:shadow-md"
      }`}
    >
      {/* Checkbox */}
      <div
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`absolute top-2 left-2 z-10 transition-opacity ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        <div className="bg-card/95 rounded p-0.5 shadow-sm">
          <Checkbox checked={selected} />
        </div>
      </div>

      <div className="aspect-square bg-gradient-to-br from-accent/20 via-secondary/30 to-muted/20 grid place-items-center relative">
        <TypeIcon type={asset.type} className="h-7 w-7 text-card-foreground/40" />
        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); toast.success("Downloaded"); }} className="p-1.5 rounded bg-white/95 text-slate-700 hover:bg-white" title="Download">
            <Download className="h-3.5 w-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); toast.success("Assigned"); }} className="p-1.5 rounded bg-white/95 text-slate-700 hover:bg-white" title="Assign to Post">
            <Link2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); toast.success("Deleted"); }} className="p-1.5 rounded bg-white/95 text-red-600 hover:bg-white ml-auto" title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="text-xs font-medium text-card-foreground truncate flex-1">{asset.name}</div>
          <TypeBadge type={asset.type} />
        </div>
        <div className="flex items-center justify-between text-[10px] text-card-foreground/60">
          <span>{asset.date}</span>
          <span>{asset.size}</span>
        </div>
      </div>
    </div>
  );
}
