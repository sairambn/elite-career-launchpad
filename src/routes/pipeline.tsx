import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/Shell";
import { applications, STAGES, type Stage } from "@/data/portal";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "Application pipeline — Placement Desk" },
      {
        name: "description",
        content:
          "Track every application round by round: applied, online assessment, technical rounds, HR and offers.",
      },
      { property: "og:title", content: "Application pipeline — Placement Desk" },
      {
        property: "og:description",
        content: "Round-by-round status for every company you applied to.",
      },
      { property: "og:url", content: "/pipeline" },
    ],
    links: [{ rel: "canonical", href: "/pipeline" }],
  }),
  component: PipelinePage,
});

function stageIndex(stage: Stage) {
  return STAGES.indexOf(stage);
}

function PipelinePage() {
  return (
    <Shell>
      <PageHeader
        eyebrow={`${applications.length} tracked applications`}
        title="Pipeline"
        description="Each row is one application, with every round it has cleared and the one it is sitting in now."
      />

      <div className="space-y-3">
        {applications.map((a) => {
          const idx = stageIndex(a.stage);
          return (
            <article key={a.driveId} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    to="/drives/$driveId"
                    params={{ driveId: a.driveId }}
                    className="font-display text-lg font-semibold hover:text-primary"
                  >
                    {a.company}
                  </Link>
                  <p className="text-[13px] text-muted-foreground">{a.role}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-mono text-[11px] ${
                      a.status === "offer" ? "text-success" : "text-primary"
                    }`}
                  >
                    {a.next}
                  </p>
                  <p className="label-mono mt-1">updated {a.updated}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
                {STAGES.map((s, i) => {
                  const done = i < idx;
                  const current = i === idx;
                  return (
                    <div
                      key={s}
                      className={`min-w-[104px] flex-1 rounded-md border px-3 py-2 ${
                        current
                          ? a.status === "offer"
                            ? "border-success/50 bg-success/10"
                            : "border-primary/50 bg-primary/10"
                          : done
                            ? "border-border bg-surface-2"
                            : "border-dashed border-border bg-transparent"
                      }`}
                    >
                      <p className="label-mono">{s}</p>
                      <p
                        className={`mt-0.5 text-[12px] ${
                          done || current ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {a.history.find((h) => h.stage === s)?.date ?? "—"}
                      </p>
                    </div>
                  );
                })}
              </div>

              <ul className="mt-4 space-y-1.5">
                {a.history.map((h) => (
                  <li key={h.stage} className="flex gap-3 text-[13px]">
                    <span className="w-14 font-mono text-[11px] text-muted-foreground">{h.date}</span>
                    <span className="text-muted-foreground">{h.note}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </Shell>
  );
}
