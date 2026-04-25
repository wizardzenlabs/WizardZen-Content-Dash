import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Sparkles, Copy, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Content Studio" },
      {
        name: "description",
        content: "Generate thoughtful, brand-aligned responses to customer reviews.",
      },
    ],
  }),
  component: ReviewsPage,
});

type Source = "Google" | "Facebook" | "Yelp" | "TripAdvisor" | "Other";

type ReviewItem = {
  id: string;
  source: Source;
  rating: number;
  text: string;
  response: string;
  date: string;
};

const sources: Source[] = ["Google", "Facebook", "Yelp", "TripAdvisor", "Other"];

const seedHistory: ReviewItem[] = [
  {
    id: "r1",
    source: "Google",
    rating: 5,
    text: "Lavender latte was unreal and the staff remembered my name on visit two. New favourite spot in the neighborhood.",
    response:
      "Thank you so much, Priya — Sam will be glowing all day reading this. Save us a seat next Saturday, the rhubarb scones are coming back. ☕💜",
    date: "Apr 22",
  },
  {
    id: "r2",
    source: "Yelp",
    rating: 2,
    text: "Waited 20 minutes for an oat cap and it came out lukewarm. Cute space but the line is brutal at 9am.",
    response:
      "We hear you, and a lukewarm cap is never on our menu. We're piloting a second steam wand next week — DM us and your next round is on the house.",
    date: "Apr 19",
  },
  {
    id: "r3",
    source: "Facebook",
    rating: 4,
    text: "Great pastries, friendly team. Wish there were a few more savoury options in the morning rush.",
    response:
      "Thanks Marc! A breakfast galette is in test kitchen as we speak — first weekend of May, you'll be the first to know.",
    date: "Apr 15",
  },
  {
    id: "r4",
    source: "TripAdvisor",
    rating: 3,
    text: "Coffee was good, music was a touch loud for a Sunday morning. Would come back for the matcha.",
    response:
      "Appreciate the honest note on the volume — Sundays just got their own quieter playlist. Matcha's waiting for you.",
    date: "Apr 12",
  },
];

function ratingColor(r: number) {
  if (r >= 4) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (r === 3) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-rose-700 bg-rose-50 border-rose-200";
}

function StarRow({
  value,
  onChange,
  size = "h-6 w-6",
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: string;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          disabled={!onChange}
          className={cn(!onChange && "cursor-default")}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              size,
              n <= value
                ? "fill-amber-400 text-amber-400"
                : "text-card-foreground/20",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsPage() {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState<Source>("Google");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState<ReviewItem[]>(seedHistory);
  const [filter, setFilter] = useState<"all" | "positive" | "negative">("all");

  const generate = () => {
    if (!review.trim()) {
      toast.error("Paste a review first");
      return;
    }
    const draft =
      rating >= 4
        ? "Thank you for taking the time to share this — it genuinely makes our week. We'll pass the kind words on to the team and can't wait to welcome you back soon."
        : rating === 3
          ? "Thanks for the honest feedback. We'd love a chance to make the next visit a clear win — reach out and the next round is on us."
          : "We're really sorry this fell short. That isn't the experience we want anyone to leave with. Please reach out directly so we can make it right.";
    setResponse(draft);
    toast.success("Response drafted");
  };

  const saveToHistory = () => {
    if (!review.trim() || !response.trim()) return;
    const item: ReviewItem = {
      id: `r${Date.now()}`,
      source,
      rating,
      text: review.trim(),
      response: response.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    setHistory((h) => [item, ...h]);
    setReview("");
    setResponse("");
    toast.success("Saved to history");
  };

  const filtered = useMemo(() => {
    if (filter === "positive") return history.filter((h) => h.rating >= 4);
    if (filter === "negative") return history.filter((h) => h.rating <= 2);
    return history;
  }, [history, filter]);

  return (
    <AppLayout title="Reviews">
      <div className="space-y-6">
        <SectionHeader
          title="Review responses"
          description="Reply to customer reviews in your brand voice in seconds."
        />

        <SurfaceCard className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60 mb-2 block">
              The review
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Paste the customer review here…"
              className="min-h-[140px] bg-secondary/30 border-border/40 text-card-foreground placeholder:text-card-foreground/40"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60 mb-2">
                Rating
              </div>
              <StarRow value={rating} onChange={setRating} size="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60 mb-2">
                Source
              </div>
              <Select value={source} onValueChange={(v) => setSource(v as Source)}>
                <SelectTrigger className="bg-secondary/30 border-border/40 text-card-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generate} className="h-10">
              <Sparkles className="h-4 w-4" /> Generate Response
            </Button>
          </div>

          {response && (
            <div className="space-y-3 pt-3 border-t border-border/30">
              <div className="text-xs font-semibold uppercase tracking-wider text-card-foreground/60">
                Suggested reply (editable)
              </div>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[140px] bg-accent/10 border-accent/30 text-card-foreground"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(response);
                    toast.success("Copied");
                  }}
                >
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={generate}>
                  <RotateCw className="h-4 w-4" /> Regenerate
                </Button>
                <Button size="sm" onClick={saveToHistory}>
                  Save to history
                </Button>
              </div>
            </div>
          )}
        </SurfaceCard>

        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <h3 className="text-base font-semibold text-foreground">
              Review history
            </h3>
            <div className="inline-flex rounded-lg border border-border/40 bg-secondary/20 p-1">
              {(["all", "positive", "negative"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors",
                    filter === f
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {filtered.map((item) => (
              <SurfaceCard key={item.id} className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-md border",
                        ratingColor(item.rating),
                      )}
                    >
                      {item.rating}.0 ★
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-secondary/40 text-card-foreground/80 border border-border/30">
                      {item.source}
                    </span>
                  </div>
                  <span className="text-xs text-card-foreground/50">
                    {item.date}
                  </span>
                </div>
                <StarRow value={item.rating} size="h-4 w-4" />
                <p className="text-sm text-card-foreground/80 leading-relaxed">
                  "{item.text}"
                </p>
                <div className="rounded-lg bg-secondary/30 border border-border/30 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-card-foreground/50 mb-1">
                    Your reply
                  </div>
                  <p className="text-sm text-card-foreground leading-relaxed">
                    {item.response}
                  </p>
                </div>
              </SurfaceCard>
            ))}
            {filtered.length === 0 && (
              <SurfaceCard className="lg:col-span-2 text-center py-10 text-card-foreground/60 text-sm">
                No reviews match this filter yet.
              </SurfaceCard>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
