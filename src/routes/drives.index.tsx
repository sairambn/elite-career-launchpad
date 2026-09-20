import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell, PageHeader } from "@/components/Shell";
import { drives, student } from "@/data/portal";

export const Route = createFileRoute("/drives/")({
  head: () => ({
    meta: [
      { title: "Open drives — Placement Desk" },
      {
        name: "description",
        content:
          "Every company drive on campus with CTC, eligibility cutoffs, rounds and deadlines, filtered against your profile.",
      },
      { property: "og:title", content: "Open drives — Placement Desk" },
      {
        property: "og:description",
        content: "CTC, eligibility cutoffs, rounds and deadlines for every campus drive.",
      },
      { property: "og:url", content: "/drives" },
    ],
    links: [{ rel: "canonical", href: "/drives" }],
  }),
  component: DrivesPage,
});

function DrivesPage() {
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    return drives
      .filter((d) => {
        const eligible = student.cgpa >= d.cgpaCutoff && d.branches.includes(student.branch);
        if (onlyEligible && !eligible) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          d.company.toLowerCase().includes(q) ||
          d.role.toLowerCase().includes(q) ||
          d.skills.some((s) => s.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.deadlineIn - b.deadlineIn);
  }, [onlyEligible, query]);

  return (
    <Shell>
      <PageHeader
        eyebrow="Ordered by deadline"
        title="Open drives"
        description="Eligibility is checked against your CGPA, branch and backlog record before you apply."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search company, role or skill"
          className="h-9 w-full max-w-xs rounded-md border border-input bg-surface px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring sm:w-72"
        />
        <button
          onClick={() => setOnlyEligible((v) => !v)}
          className={`h-9 rounded-md border px-3 text-[13px] transition-colors ${
            onlyEligible
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          Eligible only
        </button>
        <span className="font-mono text-[11px] text-muted-foreground">
          {list.length} of {drives.length} drives
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((d) => {
          const eligible = student.cgpa >= d.cgpaCutoff && d.branches.includes(student.branch);
          return (
            <Link
              key={d.id}
              to="/drives/$driveId"
              params={{ driveId: d.id }}
              className="panel block p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold">{d.company}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {d.role} · {d.location}
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                    d.deadlineIn <= 2
                      ? "bg-destructive/15 text-destructive"
                      : d.deadlineIn <= 6
                        ? "bg-warning/15 text-warning"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {d.deadlineIn}d left
                </span>
              </div>

              <p className="mt-4 font-display text-2xl font-semibold">{d.ctc}</p>
              <p className="font-mono text-[11px] text-muted-foreground">Closes {d.deadline}</p>

              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
                <Tag tone={eligible ? "success" : "warning"}>
                  {eligible ? "Eligible" : "Not eligible"}
                </Tag>
                <Tag>CGPA ≥ {d.cgpaCutoff}</Tag>
                <Tag>{d.branches.join(" / ")}</Tag>
                <Tag>{d.rounds.length} rounds</Tag>
              </div>
            </Link>
          );
        })}
      </div>
    </Shell>
  );
}

function Tag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "success" | "warning";
}) {
  const cls =
    tone === "success"
      ? "bg-success/15 text-success"
      : tone === "warning"
        ? "bg-warning/15 text-warning"
        : "bg-muted text-muted-foreground";
  return <span className={`rounded px-2 py-0.5 ${cls}`}>{children}</span>;
}
