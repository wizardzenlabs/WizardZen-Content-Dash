import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  PenLine,
  Image as ImageIcon,
  Film,
  Folder,
  LayoutTemplate,
  Star,
  BarChart3,
  Settings,
  Moon,
  Sun,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/polish", label: "Polish", icon: Sparkles },
  { to: "/create", label: "Create", icon: PenLine },
  { to: "/image-studio", label: "Image Studio", icon: ImageIcon },
  { to: "/video-studio", label: "Video Studio", icon: Film },
  { to: "/assets", label: "Assets", icon: Folder },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const mobilePrimary = navItems.slice(0, 4);
const mobileMore = navItems.slice(4);

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return (
    <button
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 px-2 py-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold">
        ✦
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-sidebar-foreground">Content Studio</div>
        <div className="text-[11px] text-sidebar-foreground/60">AI Engine</div>
      </div>
    </div>
  );
}

function SidebarLink({
  to,
  label,
  Icon,
  active,
}: {
  to: string;
  label: string;
  Icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  const location = useLocation();
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col gap-2 border-r border-sidebar-border bg-sidebar p-3">
        <BrandMark />
        <nav className="mt-2 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <SidebarLink
              key={item.to}
              to={item.to}
              label={item.label}
              Icon={item.icon}
              active={isActive(item.to)}
            />
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-sidebar-border p-3 text-xs text-sidebar-foreground/70">
          <div className="font-medium text-sidebar-foreground mb-1">Pro plan</div>
          <div>23 / 100 generations used this month</div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/80 backdrop-blur px-4 lg:px-8 h-14">
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-sm">
                ✦
              </div>
              <span className="font-semibold text-sm">Content Studio</span>
            </div>
            <h1 className="hidden lg:block text-base font-semibold text-foreground">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground grid place-items-center text-sm font-semibold">
              JS
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-10">
          {title && (
            <h1 className="lg:hidden mb-4 text-2xl font-bold tracking-tight">{title}</h1>
          )}
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-sidebar text-sidebar-foreground">
        <div className="grid grid-cols-5">
          {mobilePrimary.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium",
                  active ? "text-accent" : "text-sidebar-foreground/70",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-sidebar-foreground/70">
                <MoreHorizontal className="h-5 w-5" />
                More
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sidebar border-sidebar-border text-sidebar-foreground">
              <SheetHeader>
                <SheetTitle className="text-sidebar-foreground">More</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {mobileMore.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4 text-xs"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
