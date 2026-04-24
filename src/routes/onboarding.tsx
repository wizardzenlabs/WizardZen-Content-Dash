import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SurfaceCard } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — Content Studio" },
      { name: "description", content: "Quick setup to personalize your AI content engine." },
    ],
  }),
  component: OnboardingPage,
});

const steps = [
  { id: 1, title: "Your business" },
  { id: 2, title: "Brand voice" },
  { id: 3, title: "Connect platforms" },
  { id: 4, title: "You're ready" },
];

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const next = () => {
    if (step < 4) setStep(step + 1);
    else {
      toast.success("Setup complete!");
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground font-bold text-lg mb-3">✦</div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to Content Studio</h1>
          <p className="text-foreground/70 mt-1">Let's get you set up in under 2 minutes.</p>
        </div>

        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold ${
                  step > s.id
                    ? "bg-accent text-accent-foreground"
                    : step === s.id
                    ? "bg-accent text-accent-foreground ring-4 ring-accent/30"
                    : "bg-secondary/40 text-foreground/60"
                }`}
              >
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? "bg-accent" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <SurfaceCard className="space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-card-foreground">Tell us about your business</h2>
              <Input placeholder="Business name" className="bg-secondary/30 border-border/40" />
              <Input placeholder="Industry (e.g. cafe, dentist, agency)" className="bg-secondary/30 border-border/40" />
              <Textarea placeholder="What do you do, in one sentence?" className="bg-secondary/30 border-border/40 min-h-[100px]" />
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-card-foreground">Pick your brand voice</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { n: "Friendly", d: "Warm and conversational" },
                  { n: "Professional", d: "Polished and authoritative" },
                  { n: "Playful", d: "Witty and energetic" },
                ].map((v, i) => (
                  <button
                    key={v.n}
                    className={`text-left rounded-xl border p-4 transition-colors ${
                      i === 0 ? "border-accent bg-accent/10" : "border-border/40 bg-secondary/30 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="font-semibold text-card-foreground">{v.n}</div>
                    <div className="text-xs text-card-foreground/60 mt-1">{v.d}</div>
                  </button>
                ))}
              </div>
              <Textarea placeholder="Anything else we should know about your style?" className="bg-secondary/30 border-border/40 min-h-[80px]" />
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold text-card-foreground">Connect your platforms</h2>
              <p className="text-sm text-card-foreground/60">Pick the channels you publish to. You can add more later.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Instagram", "LinkedIn", "TikTok", "X", "Facebook", "YouTube"].map((p, i) => (
                  <button
                    key={p}
                    className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                      i < 3 ? "border-accent bg-accent/10 text-card-foreground" : "border-border/40 bg-secondary/30 text-card-foreground/80"
                    }`}
                  >{p}</button>
                ))}
              </div>
            </>
          )}
          {step === 4 && (
            <div className="text-center py-6 space-y-3">
              <div className="h-16 w-16 rounded-full bg-accent text-accent-foreground grid place-items-center mx-auto">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold text-card-foreground">You're all set!</h2>
              <p className="text-sm text-card-foreground/60 max-w-sm mx-auto">
                We've configured your workspace. Time to make your first post.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              Back
            </Button>
            <Button onClick={next}>
              {step === 4 ? "Go to dashboard" : "Continue"} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
