import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, Upload, Search, Image as ImageIcon, Film, FileText } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — Content Studio" },
      { name: "description", content: "Library of brand images, videos, and files reused across content." },
    ],
  }),
  component: AssetsPage,
});

const folders = [
  { name: "All assets", count: 142 },
  { name: "Brand", count: 24 },
  { name: "Products", count: 56 },
  { name: "Team", count: 18 },
  { name: "Events", count: 32 },
  { name: "Stock", count: 12 },
];

const assets = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  name: `asset-${(i + 1).toString().padStart(3, "0")}`,
  type: i % 4 === 0 ? "video" : i % 5 === 0 ? "doc" : "image",
}));

function AssetsPage() {
  const [active, setActive] = useState("All assets");

  return (
    <AppLayout title="Assets">
      <div className="space-y-5">
        <SectionHeader
          title="Asset library"
          description="Reuse imagery, video, and files across all your content."
          action={
            <Button>
              <Upload className="h-4 w-4" /> Upload
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <SurfaceCard className="p-3 space-y-1 self-start">
            {folders.map((f) => (
              <button
                key={f.name}
                onClick={() => setActive(f.name)}
                className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active === f.name
                    ? "bg-accent text-accent-foreground"
                    : "text-card-foreground/80 hover:bg-secondary/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  {f.name}
                </span>
                <span className="text-xs opacity-70">{f.count}</span>
              </button>
            ))}
          </SurfaceCard>

          <div className="space-y-4">
            <SurfaceCard className="flex items-center gap-3 p-3">
              <Search className="h-4 w-4 text-card-foreground/60 ml-1" />
              <Input placeholder="Search assets…" className="border-0 bg-transparent focus-visible:ring-0 text-card-foreground" />
              <div className="flex gap-2">
                {["All", "Image", "Video", "Doc"].map((f) => (
                  <button key={f} className="text-xs px-2.5 py-1 rounded-md bg-secondary/40 text-card-foreground/80 hover:bg-secondary/60">{f}</button>
                ))}
              </div>
            </SurfaceCard>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {assets.map((a) => {
                const Icon = a.type === "video" ? Film : a.type === "doc" ? FileText : ImageIcon;
                return (
                  <div
                    key={a.id}
                    className="surface-card overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gradient-to-br from-accent/20 via-secondary/30 to-muted/20 grid place-items-center">
                      <Icon className="h-7 w-7 text-card-foreground/40" />
                    </div>
                    <div className="px-3 py-2">
                      <div className="text-xs font-medium text-card-foreground truncate">{a.name}</div>
                      <div className="text-[10px] text-card-foreground/60 uppercase">{a.type}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
