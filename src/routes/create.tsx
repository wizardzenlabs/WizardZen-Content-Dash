import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SurfaceCard, SectionHeader } from "@/components/layout/Primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create — Content Studio" },
      { name: "description", content: "Generate emails and blog posts with AI tailored to your brand voice." },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  return (
    <AppLayout title="Create">
      <div className="space-y-6">
        <SectionHeader title="Long-form content" description="Generate emails and blog posts in your brand voice." />

        <Tabs defaultValue="email">
          <TabsList className="bg-secondary/30">
            <TabsTrigger value="email" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Mail className="h-4 w-4 mr-1" /> Email
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <FileText className="h-4 w-4 mr-1" /> Blog post
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <SurfaceCard className="space-y-4">
              <div>
                <label className="text-xs font-medium text-card-foreground/70">Subject line idea</label>
                <Input placeholder="e.g. Spring menu drops this Friday" className="mt-1 bg-secondary/30 border-border/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-card-foreground/70">What's it about?</label>
                <Textarea placeholder="Bullet points, key info, target audience…" className="mt-1 min-h-[120px] bg-secondary/30 border-border/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-card-foreground/70">Tone</label>
                  <Input defaultValue="Warm & inviting" className="mt-1 bg-secondary/30 border-border/40" />
                </div>
                <div>
                  <label className="text-xs font-medium text-card-foreground/70">Length</label>
                  <Input defaultValue="Medium (150-250 words)" className="mt-1 bg-secondary/30 border-border/40" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Email draft generated")}>
                  <Sparkles className="h-4 w-4" /> Generate email
                </Button>
              </div>
            </SurfaceCard>
          </TabsContent>

          <TabsContent value="blog" className="mt-4">
            <SurfaceCard className="space-y-4">
              <div>
                <label className="text-xs font-medium text-card-foreground/70">Working title</label>
                <Input placeholder="e.g. 5 reasons our spring menu is your new favorite" className="mt-1 bg-secondary/30 border-border/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-card-foreground/70">Outline or notes</label>
                <Textarea placeholder="Headings, talking points, links to include…" className="mt-1 min-h-[140px] bg-secondary/30 border-border/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-card-foreground/70">Target keyword</label>
                  <Input placeholder="spring cafe menu" className="mt-1 bg-secondary/30 border-border/40" />
                </div>
                <div>
                  <label className="text-xs font-medium text-card-foreground/70">Word count</label>
                  <Input defaultValue="800" className="mt-1 bg-secondary/30 border-border/40" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Blog post drafted")}>
                  <Sparkles className="h-4 w-4" /> Generate blog post
                </Button>
              </div>
            </SurfaceCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
