import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { student } from "@/data/portal";
import { useProfile, useSession } from "@/hooks/use-portal-data";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Overview" },
  { to: "/drives", label: "Drives" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/calendar", label: "Calendar" },
  { to: "/prep", label: "Prep" },
  { to: "/profile", label: "Profile Lab" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { user, loading } = useSession();
  const { data: profile } = useProfile();
  const initials = profile?.initials ?? student.initials;
  const gradYear = profile?.grad_year ?? student.gradYear;

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-6 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-primary font-display text-[13px] font-bold text-primary-foreground">
              P
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Placement Desk
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
              Season closes in 14 days
            </span>
            {!loading && !user ? (
              <Link
                to="/auth"
                className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign in
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-secondary font-mono text-[11px] text-foreground">
                  {initials}
                </span>
                {user && (
                  <button
                    onClick={signOut}
                    className="hidden text-[12px] text-muted-foreground hover:text-foreground sm:inline"
                  >
                    Sign out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-5 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="shrink-0 rounded-md px-2.5 py-1 text-[12px] text-muted-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1320px] px-5 py-8">{children}</main>
      <footer className="mx-auto max-w-[1320px] px-5 pb-10 pt-4">
        <p className="label-mono">Placement Desk · Batch of {gradYear}</p>
      </footer>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-7">
      <p className="label-mono">{eyebrow}</p>
      <h1 className="mt-2 text-balance text-3xl font-semibold sm:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function Meter({ value, tone = "primary" }: { value: number; tone?: "primary" | "success" | "warning" }) {
  const bg =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full ${bg}`} style={{ width: `${value}%` }} />
    </div>
  );
}
