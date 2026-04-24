import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Content Studio" },
      { name: "description", content: "Generate thoughtful, brand-aligned responses to customer reviews." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [response, setResponse] = useState("");

  const handleGenerate = () => {
    if (!review.trim()) {
      toast.error("Paste a review first");
      return;
    }
    setResponse(
      "Thank you so much for taking the time to share this — it really means the world to our team. We're thrilled the lavender latte hit the spot, and we can't wait to welcome you back to try the rest of the spring menu. ☕💜",
    );
    toast.success("Response generated");
  };

  return (
    <AppLayout title="Reviews">
      <div className="space-y-6">
        <SectionHeader title="Review responses" description="Reply to customer reviews in your brand voice in seconds." />

        <div className="grid gap-4 lg:grid-cols-2">
          <SurfaceCard className="space-y-4">
            <div className="text-sm font-semibold text-card-foreground">The review</div>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Paste the customer review here…"
              className="min-h-[160px] bg-secondary/30 border-border/40"
            />
            <div>
              <div className="text-xs font-medium text-card-foreground/70 mb-2">Rating</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className="p-0.5"
                    aria-label={`${n} stars`}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        n <= rating ? "fill-accent text-accent" : "text-card-foreground/20"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={handleGenerate}>
              <Sparkles className="h-4 w-4" /> Generate response
            </Button>
          </SurfaceCard>

          <SurfaceCard className="space-y-3">
            <div className="text-sm font-semibold text-card-foreground">Suggested response</div>
            {response ? (
              <>
                <div className="rounded-lg bg-secondary/30 p-4 text-sm text-card-foreground leading-relaxed">
                  {response}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleGenerate}>Regenerate</Button>
                  <Button size="sm" onClick={() => toast.success("Copied to clipboard")}>Copy</Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-card-foreground/60 py-12 text-center border border-dashed border-border/40 rounded-lg">
                Your AI-drafted reply will appear here.
              </div>
            )}
          </SurfaceCard>
        </div>
      </div>
    </AppLayout>
  );
}
