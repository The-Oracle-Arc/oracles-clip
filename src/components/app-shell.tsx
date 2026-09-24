import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Clapperboard,
  Coins,
  Factory,
  Home,
  Layers3,
  Plus,
  Settings,
  Share2,
  Library,
  CircleHelp,
} from "lucide-react";
import { Wordmark } from "@/components/mark";
import { cn } from "@/lib/utils";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";
import { useState, type ReactNode } from "react";

const PRIMARY = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/create", label: "Create", icon: Plus },
  { to: "/content", label: "Content", icon: Library },
  { to: "/publish", label: "Publish", icon: Share2 },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/earnings", label: "Earnings", icon: Coins },
];

const SECONDARY = [
  { to: "/series", label: "Series", icon: Layers3 },
  { to: "/platforms", label: "Platforms", icon: Clapperboard },
  { to: "/engine", label: "Engine Room", icon: Factory },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: CircleHelp },
];

const MOBILE = [
  { to: "/create", label: "Create", icon: Plus },
  { to: "/content", label: "Content", icon: Library },
  { to: "/publish", label: "Publish", icon: Share2 },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/earnings", label: "Earnings", icon: Coins },
];

function NavLink({
  to,
  label,
  icon: Icon,
  collapsed,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  collapsed?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to || pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
        active ? "bg-forest text-forest-fg" : "text-ink-soft hover:bg-mist hover:text-ink",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className={cn(collapsed && "sr-only")}>{label}</span>
    </Link>
  );
}

export function AppShell({
  children,
  demoMode,
  unread,
  isOperator,
}: {
  children: ReactNode;
  demoMode?: boolean;
  unread?: number;
  isOperator?: boolean;
}) {
  const { user } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);
  const initial = (user?.displayName || user?.primaryEmail || "C").charAt(0).toUpperCase();

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-paper md:flex">
        <div className="flex h-16 items-center px-5">
          <Link to="/home">
            <Wordmark />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {PRIMARY.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
          <div className="my-3 h-px bg-line" />
          {SECONDARY.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
          {isOperator ? <NavLink to="/admin" label="Operations" icon={Factory} /> : null}
        </nav>
        <div className="border-t border-line p-3">
          {demoMode ? (
            <div className="mb-2 rounded-md bg-amber/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-amber">
              Demo mode
            </div>
          ) : null}
          <div className="flex items-center gap-2 px-1">
            <div className="grid size-9 place-items-center rounded-full bg-mist text-sm font-medium">{initial}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{user?.displayName ?? "Account"}</div>
              <button
                type="button"
                className="text-xs text-stone hover:text-ink"
                disabled={signingOut}
                onClick={() => {
                  setSigningOut(true);
                  void signOut("/").catch(() => setSigningOut(false));
                }}
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur md:hidden">
          <Link to="/home">
            <Wordmark />
          </Link>
          <Link to="/settings" className="relative grid size-10 place-items-center rounded-full bg-mist">
            {initial}
            {unread ? <span className="absolute right-1 top-1 size-2 rounded-full bg-forest" /> : null}
          </Link>
        </header>
        <main className="px-4 pb-28 pt-5 md:px-8 md:pb-12 md:pt-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {MOBILE.map((item) => {
            return <MobileItem key={item.to} {...item} />;
          })}
        </div>
      </nav>
    </div>
  );
}

function MobileItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to || pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]",
        active ? "text-forest" : "text-stone",
      )}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}
