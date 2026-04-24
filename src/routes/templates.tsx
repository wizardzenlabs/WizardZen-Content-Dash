import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Content Studio" },
      { name: "description", content: "Reusable post templates organized by goal and channel." },
    ],
  }),
  component: TemplatesPage,
});

const categories = ["All", "Promotions", "Announcements", "Tips & how-to", "Behind the scenes", "User content", "Holidays"];

const templates = [
  { title: "Flash sale", category: "Promotions", uses: 24 },
  { title: "Product launch", category: "Announcements", uses: 18 },
  { title: "Quick tip", category: "Tips & how-to", uses: 47 },
  { title: "Team spotlight", category: "Behind the scenes", uses: 12 },
  { title: "Customer review", category: "User content", uses: 33 },
  { title: "Holiday greeting", category: "Holidays", uses: 8 },
  { title: "Event reminder", category: "Announcements", uses: 15 },
  { title: "Tutorial carousel", category: "Tips & how-to", uses: 29 },
  { title: "Day in the life", category: "Behind the scenes", uses: 6 },
];

function TemplatesPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? templates : templates.filter((t) => t.category === active);

  return (
    <AppLayout title="Templates">
      <div className="space-y-5">
        <SectionHeader
          title="Templates"
          description="Start from a proven structure — fully editable in your brand voice."
          action={
            <Button onClick={() => toast.success("New template created")}>
              <Plus className="h-4 w-4" /> New template
            </Button>
          }
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                active === c
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-secondary/30 border-border/40 text-foreground/80 hover:bg-secondary/50"
              }`}
            >{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <SurfaceCard key={t.title} className="space-y-3 cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-accent/25 via-secondary/30 to-muted/20 grid place-items-center">
                <LayoutTemplate className="h-8 w-8 text-card-foreground/40" />
              </div>
              <div>
                <div className="font-semibold text-card-foreground">{t.title}</div>
                <div className="flex items-center justify-between mt-1 text-xs text-card-foreground/60">
                  <span>{t.category}</span>
                  <span>Used {t.uses} times</span>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
