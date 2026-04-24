import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/polish")({
  head: () => ({
    meta: [
      { title: "Polish — Content Studio" },
      { name: "description", content: "Polish raw text into platform-ready posts for every social channel." },
    ],
  }),
  component: PolishPage,
});

const platforms = ["Instagram", "LinkedIn", "X", "Facebook", "TikTok"];

const samples: Record<string, string> = {
  Instagram: "✨ Big news ✨ Our spring menu drops Friday — think lavender lattes, citrus tarts, and the comeback of strawberry matcha 🍓\n\nSave this post so you don't miss it. Which one are you trying first? 👇\n\n#SpringMenu #LocalCafe #SmallBusiness",
  LinkedIn: "We're proud to announce our spring menu launch this Friday — a refresh built entirely from feedback our community shared over the winter season.\n\nA few highlights:\n• Lavender latte (locally sourced)\n• Citrus tart, vegan-friendly\n• Strawberry matcha returns by popular demand\n\nThank you to every customer who took the time to tell us what you wanted next.",
  X: "Spring menu drops Friday 🌸\n\nLavender lattes, citrus tarts, strawberry matcha — back by demand.\n\nWho's coming?",
  Facebook: "Mark your calendars 📅 Our brand new spring menu launches this Friday at 7am. Expect lavender lattes, vegan citrus tarts, and the long-awaited return of strawberry matcha. Save the date and bring a friend!",
  TikTok: "POV: your fav cafe just dropped the spring menu you've been begging for 🌸 lavender latte, citrus tart, strawberry matcha — ALL back. Friday. Be there. #fyp #cafetok",
};

function PolishPage() {
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!input.trim()) {
      toast.error("Add some text to polish first");
      return;
    }
    setGenerated(true);
    toast.success("Polished for 5 platforms");
  };

  const copy = (p: string) => {
    setCopied(p);
    toast.success(`${p} copied`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AppLayout title="Polish">
      <div className="space-y-6">
        <SectionHeader
          title="Turn rough notes into polished posts"
          description="Paste your raw idea — we'll rewrite it in your brand voice for each platform."
        />

        <SurfaceCard className="space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your draft here. Bullet points, voice memo transcripts, anything goes…"
            className="min-h-[140px] bg-secondary/30 border-border/40 text-card-foreground"
          />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-card-foreground/60">
              {input.length} characters · Tone: <span className="font-medium text-card-foreground">Friendly</span>
            </div>
            <Button onClick={handleGenerate}>
              <Sparkles className="h-4 w-4" /> Polish for all platforms
            </Button>
          </div>
        </SurfaceCard>

        {generated ? (
          <div className="grid gap-4 md:grid-cols-2">
            {platforms.map((p) => (
              <SurfaceCard key={p} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-secondary/40">{p}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => copy(p)}>
                    {copied === p ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-line text-card-foreground/90 leading-relaxed">
                  {samples[p]}
                </p>
              </SurfaceCard>
            ))}
          </div>
        ) : (
          <SurfaceCard className="text-center py-12 border-dashed">
            <Sparkles className="h-8 w-8 mx-auto text-card-foreground/40 mb-2" />
            <div className="text-sm text-card-foreground/60">
              Polished versions for each platform will appear here.
            </div>
          </SurfaceCard>
        )}
      </div>
    </AppLayout>
  );
}
