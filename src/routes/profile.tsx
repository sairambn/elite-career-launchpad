import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell, PageHeader, Meter } from "@/components/Shell";
import { githubChecks, linkedinChecks, type ProfileCheck } from "@/data/portal";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile Lab: GitHub & LinkedIn — Placement Desk" },
      {
        name: "description",
        content:
          "Score and fix your GitHub and LinkedIn profiles with weighted, recruiter-tested checks and exact rewrites for each one.",
      },
      { property: "og:title", content: "Profile Lab: GitHub & LinkedIn — Placement Desk" },
      {
        property: "og:description",
        content: "Weighted, recruiter-tested checks and exact fixes for your GitHub and LinkedIn profiles.",
      },
      { property: "og:url", content: "/profile" },
    ],
    links: [{ rel: "canonical", href: "/profile" }],
  }),
  component: ProfileLab,
});

const rewrites = {
  github: [
    { label: "Weak", text: "My projects. Learning web development." },
    {
      label: "Strong",
      text: "Backend engineer (grad 2026). Go + Postgres. Built a job queue processing 40k tasks/day — see pinned repos.",
    },
  ],
  linkedin: [
    { label: "Weak", text: "Student at ABC Institute of Technology | Passionate coder | Tech enthusiast" },
    {
      label: "Strong",
      text: "Backend Engineer · Go, Postgres, Kafka | Cut API p95 from 800ms to 210ms at Quanta | CSE '26",
    },
  ],
};

function ProfileLab() {
  const [gh, setGh] = useState<ProfileCheck[]>(githubChecks);
  const [li, setLi] = useState<ProfileCheck[]>(linkedinChecks);
  const [tab, setTab] = useState<"github" | "linkedin">("github");

  const checks = tab === "github" ? gh : li;
  const setChecks = tab === "github" ? setGh : setLi;

  const score = useMemo(() => {
    const total = checks.reduce((s, c) => s + c.weight, 0);
    const got = checks.filter((c) => c.done).reduce((s, c) => s + c.weight, 0);
    return Math.round((got / total) * 100);
  }, [checks]);

  const ghScore = useMemo(() => pct(gh), [gh]);
  const liScore = useMemo(() => pct(li), [li]);

  const open = [...checks].filter((c) => !c.done).sort((a, b) => b.weight - a.weight);
  const cleared = checks.filter((c) => c.done);

  function toggle(id: string) {
    setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Profile Lab"
        title="Your GitHub and LinkedIn are the two rounds nobody schedules."
        description="Every check is weighted by how much recruiters actually act on it. Work top-down: the highest-weight fix first."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Summary name="GitHub" score={ghScore} active={tab === "github"} onClick={() => setTab("github")} />
        <Summary name="LinkedIn" score={liScore} active={tab === "linkedin"} onClick={() => setTab("linkedin")} />
      </div>

      <section className="panel mt-4 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {tab === "github" ? "GitHub" : "LinkedIn"} · {open.length} fixes outstanding
          </h2>
          <p className="font-mono text-[11px] text-muted-foreground">
            score {score}/100 · weighted
          </p>
        </div>
        <div className="mt-3">
          <Meter value={score} tone={score >= 75 ? "success" : score >= 50 ? "primary" : "warning"} />
        </div>

        <ul className="mt-5 space-y-2.5">
          {open.map((c) => (
            <CheckRow key={c.id} check={c} onToggle={() => toggle(c.id)} />
          ))}
        </ul>

        {cleared.length ? (
          <>
            <p className="label-mono mt-6">Already done</p>
            <ul className="mt-2.5 space-y-2.5">
              {cleared.map((c) => (
                <CheckRow key={c.id} check={c} onToggle={() => toggle(c.id)} />
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section className="panel mt-4 p-5">
        <h2 className="text-lg font-semibold">
          {tab === "github" ? "Profile README opener" : "Headline"}, rewritten
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {rewrites[tab].map((r) => (
            <div
              key={r.label}
              className={`rounded-md border p-4 ${
                r.label === "Strong"
                  ? "border-success/40 bg-success/10"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <p
                className={`font-mono text-[10px] uppercase tracking-widest ${
                  r.label === "Strong" ? "text-success" : "text-destructive"
                }`}
              >
                {r.label}
              </p>
              <p className="mt-2 text-sm">{r.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-muted-foreground">
          The difference is not tone. It is that the second version names a stack, a measurable result
          and a graduation year — the three things a recruiter filters on.
        </p>
      </section>
    </Shell>
  );
}

function pct(checks: ProfileCheck[]) {
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.filter((c) => c.done).reduce((s, c) => s + c.weight, 0);
  return Math.round((got / total) * 100);
}

function Summary({
  name,
  score,
  active,
  onClick,
}: {
  name: string;
  score: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`panel p-5 text-left transition-colors ${active ? "border-primary/60" : "hover:border-border"}`}
    >
      <div className="flex items-baseline justify-between">
        <p className="font-medium">{name}</p>
        <p className="font-display text-3xl font-semibold">
          {score}
          <span className="text-sm text-muted-foreground">/100</span>
        </p>
      </div>
      <div className="mt-3">
        <Meter value={score} tone={score >= 75 ? "success" : score >= 50 ? "primary" : "warning"} />
      </div>
    </button>
  );
}

function CheckRow({ check, onToggle }: { check: ProfileCheck; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={`rounded-md border p-4 ${check.done ? "border-border bg-surface-2" : "border-border"}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          aria-label={check.done ? "Mark as not done" : "Mark as done"}
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border text-[11px] ${
            check.done
              ? "border-success bg-success/20 text-success"
              : "border-border text-transparent hover:border-primary"
          }`}
        >
          ✓
        </button>
        <div className="min-w-0 flex-1">
          <button onClick={() => setOpen((v) => !v)} className="block w-full text-left">
            <span className={`text-sm ${check.done ? "text-muted-foreground line-through" : ""}`}>
              {check.title}
            </span>
          </button>
          {open ? (
            <div className="mt-3 space-y-2 border-l-2 border-primary/40 pl-3">
              <p className="text-[13px] text-muted-foreground">
                <span className="label-mono mr-2">Why</span>
                {check.why}
              </p>
              <p className="text-[13px]">
                <span className="label-mono mr-2">Fix</span>
                {check.how}
              </p>
            </div>
          ) : null}
        </div>
        <span className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          +{check.weight}
        </span>
      </div>
    </li>
  );
}
