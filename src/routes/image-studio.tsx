import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Sparkles, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/image-studio")({
  head: () => ({
    meta: [
      { title: "Image Studio — Content Studio" },
      { name: "description", content: "Generate on-brand social images sized for every platform." },
    ],
  }),
  component: ImageStudioPage,
});

const platforms = ["Instagram square", "Instagram story", "LinkedIn", "TikTok cover", "X header"];
const types = ["Photo", "Illustration", "Infographic", "Quote card", "Product"];

function ImageStudioPage() {
  const [platform, setPlatform] = useState(platforms[0]);
  const [type, setType] = useState(types[0]);
  const [generated, setGenerated] = useState(false);

  return (
    <AppLayout title="Image Studio">
      <div className="space-y-6">
        <SectionHeader title="Image Studio" description="Generate platform-perfect imagery in seconds." />

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <SurfaceCard className="space-y-4">
            <div>
              <label className="text-xs font-medium text-card-foreground/70 block mb-2">Platform</label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      platform === p
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-secondary/30 border-border/40 text-card-foreground/80"
                    }`}
                  >{p}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-card-foreground/70 block mb-2">Image type</label>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      type === t
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-secondary/30 border-border/40 text-card-foreground/80"
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-card-foreground/70 block mb-2">Prompt</label>
              <Textarea
                placeholder="A cozy cafe table with a lavender latte, soft morning light, minimal styling…"
                className="min-h-[120px] bg-secondary/30 border-border/40"
              />
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setGenerated(true);
                toast.success("Generating 4 variations…");
              }}
            >
              <Sparkles className="h-4 w-4" /> Generate
            </Button>
          </SurfaceCard>

          <SurfaceCard className="min-h-[420px]">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="bg-secondary/40">{platform} · {type}</Badge>
              {generated && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" /> Download all
                </Button>
              )}
            </div>
            {generated ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gradient-to-br from-accent/30 via-secondary/30 to-muted/30 grid place-items-center"
                  >
                    <ImageIcon className="h-8 w-8 text-card-foreground/30" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[360px] grid place-items-center text-center">
                <div>
                  <ImageIcon className="h-10 w-10 mx-auto text-card-foreground/30 mb-2" />
                  <p className="text-sm text-card-foreground/60">Your generated images will appear here</p>
                </div>
              </div>
            )}
          </SurfaceCard>
        </div>
      </div>
    </AppLayout>
  );
}
