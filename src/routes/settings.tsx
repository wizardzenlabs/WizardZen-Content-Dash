import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Content Studio" },
      { name: "description", content: "Manage business profile, brand, voices, platforms, content rules and audience." },
    ],
  }),
  component: SettingsPage,
});

const tabs = ["business", "brand", "voices", "platforms", "content", "audience"] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-card-foreground/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function SettingsPage() {
  return (
    <AppLayout title="Settings">
      <div className="space-y-6">
        <SectionHeader title="Settings" description="Configure your business, brand, and content preferences." />

        <Tabs defaultValue="business">
          <TabsList className="bg-secondary/30 flex-wrap h-auto">
            {tabs.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="capitalize data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >{t}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="business" className="mt-4">
            <SurfaceCard className="grid gap-4 sm:grid-cols-2">
              <Field label="Business name"><Input defaultValue="Maple & Co." className="bg-secondary/30 border-border/40" /></Field>
              <Field label="Industry"><Input defaultValue="Cafe & bakery" className="bg-secondary/30 border-border/40" /></Field>
              <Field label="Website"><Input defaultValue="maple-co.example" className="bg-secondary/30 border-border/40" /></Field>
              <Field label="Timezone"><Input defaultValue="America/New_York" className="bg-secondary/30 border-border/40" /></Field>
              <div className="sm:col-span-2">
                <Field label="Description"><Textarea defaultValue="A neighborhood cafe specializing in seasonal drinks and house-baked pastries." className="bg-secondary/30 border-border/40 min-h-[100px]" /></Field>
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button onClick={() => toast.success("Business profile saved")}>Save changes</Button>
              </div>
            </SurfaceCard>
          </TabsContent>

          <TabsContent value="brand" className="mt-4">
            <SurfaceCard className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Primary"><Input type="color" defaultValue="#7C09C9" className="h-10 bg-secondary/30 border-border/40" /></Field>
                <Field label="Accent"><Input type="color" defaultValue="#AAF505" className="h-10 bg-secondary/30 border-border/40" /></Field>
                <Field label="Muted"><Input type="color" defaultValue="#DB0285" className="h-10 bg-secondary/30 border-border/40" /></Field>
              </div>
              <Field label="Logo"><div className="rounded-lg border border-dashed border-border/40 p-6 text-center text-sm text-card-foreground/60">Drop logo (PNG, SVG)</div></Field>
              <Field label="Brand keywords"><Input defaultValue="warm, neighborhood, seasonal, handcrafted" className="bg-secondary/30 border-border/40" /></Field>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Brand updated")}>Save changes</Button>
              </div>
            </SurfaceCard>
          </TabsContent>

          <TabsContent value="voices" className="mt-4">
            <SurfaceCard className="space-y-3">
              {[
                { name: "Friendly", desc: "Warm, casual, like talking to a regular." },
                { name: "Professional", desc: "Polished and informative for B2B contexts." },
                { name: "Playful", desc: "Witty, light, emoji-friendly." },
              ].map((v) => (
                <div key={v.name} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-secondary/30">
                  <div>
                    <div className="font-medium text-card-foreground">{v.name}</div>
                    <div className="text-xs text-card-foreground/60 mt-0.5">{v.desc}</div>
                  </div>
                  <Switch defaultChecked={v.name === "Friendly"} />
                </div>
              ))}
              <Button variant="outline" className="w-full">+ Add voice</Button>
            </SurfaceCard>
          </TabsContent>

          <TabsContent value="platforms" className="mt-4">
            <SurfaceCard className="space-y-2">
              {["Instagram", "LinkedIn", "TikTok", "X", "Facebook", "YouTube", "Pinterest"].map((p) => (
                <div key={p} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="font-medium text-card-foreground">{p}</div>
                  <Switch defaultChecked={["Instagram", "LinkedIn", "TikTok", "Facebook"].includes(p)} />
                </div>
              ))}
            </SurfaceCard>
          </TabsContent>

          <TabsContent value="content" className="mt-4">
            <SurfaceCard className="space-y-4">
              <Field label="Default post length"><Input defaultValue="Medium" className="bg-secondary/30 border-border/40" /></Field>
              <Field label="Banned words / topics"><Textarea placeholder="One per line…" className="bg-secondary/30 border-border/40" /></Field>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <div className="font-medium text-card-foreground">Always include hashtags</div>
                  <div className="text-xs text-card-foreground/60">Auto-append 3-5 relevant tags.</div>
                </div>
                <Switch defaultChecked />
              </div>
            </SurfaceCard>
          </TabsContent>

          <TabsContent value="audience" className="mt-4">
            <SurfaceCard className="space-y-4">
              <Field label="Primary audience"><Input defaultValue="25-45, urban professionals, coffee enthusiasts" className="bg-secondary/30 border-border/40" /></Field>
              <Field label="Audience pain points"><Textarea defaultValue="Limited time for quality breakfasts.&#10;Want something local instead of chain coffee." className="bg-secondary/30 border-border/40 min-h-[100px]" /></Field>
              <Field label="Reading level"><Input defaultValue="Grade 7-9 (conversational)" className="bg-secondary/30 border-border/40" /></Field>
            </SurfaceCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
