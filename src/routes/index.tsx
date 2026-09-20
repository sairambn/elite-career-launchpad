import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader, Meter } from "@/components/Shell";
import {
  applications,
  drives,
  interviews,
  student,
  STAGES,
  githubChecks,
  linkedinChecks,
  scoreOf,
} from "@/data/portal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Placement Desk" },
      {
        name: "description",
        content:
          "Your placement command centre: deadlines, application pipeline, interview schedule and profile readiness in one view.",
      },
      { property: "og:title", content: "Overview — Placement Desk" },
      {
        property: "og:description",
        content: "Deadlines, pipeline, interviews and profile readiness in one view.",
      },
      { property: "og:url", content: "/" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const counts = STAGES.map((stage) => ({
    stage,
    n: applications.filter((a) => a.stage === stage).length,
  }));
  const urgent = [...drives].sort((a, b) => a.deadlineIn - b.deadlineIn).slice(0, 3);
  const gh = scoreOf(githubChecks);
  const li = scoreOf(linkedinChecks);

  return (
    <Shell>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-64 grid-backdrop" />
        <div className="relative">
          <PageHeader
            eyebrow={`${student.roll} · ${student.branch} · CGPA ${student.cgpa}`}
            title={`Three interviews stand between you and a signed offer, ${student.name.split(" ")[0]}.`}
            description="Everything below is ordered by what expires soonest, not by what is easiest to look at."
          />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Stat label="Readiness" value={`${student.readiness}`} suffix="/100" meter={student.readiness} />
        <Stat label="Live applications" value="4" suffix="active" />
        <Stat label="Offers in hand" value="1" suffix="₹21 LPA" tone="success" />
        <Stat label="Next deadline" value="1" suffix="day · Cobalt" tone="warning" />
      </section>

      <section className="panel mt-4 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Pipeline</h2>
          <Link to="/pipeline" className="font-mono text-[11px] text-primary hover:underline">
            Open tracker →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {counts.map(({ stage, n }) => (
            <div
              key={stage}
              className={`rounded-md border p-3 ${
                stage === "Offer" ? "border-success/40 bg-success/10" : "border-border bg-surface-2"
              }`}
            >
              <p className="label-mono">{stage}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{n}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Closing soonest</h2>
            <Link to="/drives" className="font-mono text-[11px] text-primary hover:underline">
              All drives →
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {urgent.map((d) => {
              const eligible = student.cgpa >= d.cgpaCutoff && d.branches.includes(student.branch);
              return (
                <li key={d.id}>
                  <Link
                    to="/drives/$driveId"
                    params={{ driveId: d.id }}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-surface-2"
                  >
                    <div className="w-12 shrink-0 text-center">
                      <p className="font-display text-xl font-semibold leading-none">
                        {d.deadlineIn}
                      </p>
                      <p className="label-mono mt-1">{d.deadlineIn === 1 ? "day" : "days"}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{d.company}</p>
                      <p className="truncate text-[13px] text-muted-foreground">
                        {d.role} · {d.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-semibold">{d.ctc}</p>
                      <p
                        className={`font-mono text-[11px] ${
                          eligible ? "text-success" : "text-warning"
                        }`}
                      >
                        {eligible ? "Eligible" : `Needs CGPA ${d.cgpaCutoff}`}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="mb-4 text-lg font-semibold">This week</h2>
          <ul className="space-y-3">
            {interviews.slice(0, 4).map((i) => (
              <li key={`${i.date}-${i.company}`} className="flex items-start gap-3">
                <span className="w-9 shrink-0 font-mono text-[11px] text-muted-foreground">
                  {i.day} {i.date}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{i.company}</span>
                  <span className="block truncate text-[12px] text-muted-foreground">{i.label}</span>
                </span>
                <span className="font-mono text-[11px] text-primary">{i.time}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/calendar"
            className="mt-4 inline-block font-mono text-[11px] text-primary hover:underline"
          >
            Full calendar →
          </Link>
        </div>
      </section>

      <section className="panel mt-4 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Profile Lab</h2>
          <Link to="/profile" className="font-mono text-[11px] text-primary hover:underline">
            Fix your profiles →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ScoreCard
            name="GitHub"
            score={gh}
            open={githubChecks.filter((c) => !c.done).length}
            note="Recruiters open your pinned repos before your resume."
          />
          <ScoreCard
            name="LinkedIn"
            score={li}
            open={linkedinChecks.filter((c) => !c.done).length}
            note="Your headline is what recruiter search actually indexes."
          />
        </div>
      </section>
    </Shell>
  );
}

function Stat({
  label,
  value,
  suffix,
  meter,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  meter?: number;
  tone?: "success" | "warning";
}) {
  const color = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="panel p-4">
      <p className="label-mono">{label}</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className={`font-display text-3xl font-semibold ${color}`}>{value}</span>
        {suffix ? <span className="text-[12px] text-muted-foreground">{suffix}</span> : null}
      </p>
      {meter !== undefined ? (
        <div className="mt-3">
          <Meter value={meter} />
        </div>
      ) : null}
    </div>
  );
}

function ScoreCard({
  name,
  score,
  open,
  note,
}: {
  name: string;
  score: number;
  open: number;
  note: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface-2 p-4">
      <div className="flex items-baseline justify-between">
        <p className="font-medium">{name}</p>
        <p className="font-display text-2xl font-semibold">
          {score}
          <span className="text-sm text-muted-foreground">/100</span>
        </p>
      </div>
      <div className="mt-3">
        <Meter value={score} tone={score >= 75 ? "success" : score >= 50 ? "primary" : "warning"} />
      </div>
      <p className="mt-3 text-[12px] text-muted-foreground">{note}</p>
      <p className="mt-1 font-mono text-[11px] text-primary">{open} fixes outstanding</p>
    </div>
  );
}
