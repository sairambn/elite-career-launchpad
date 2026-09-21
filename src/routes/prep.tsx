import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader, Meter } from "@/components/Shell";
import { prepTracks } from "@/data/portal";

export const Route = createFileRoute("/prep")({
  head: () => ({
    meta: [
      { title: "Prep desk — Placement Desk" },
      {
        name: "description",
        content:
          "Structured preparation tracks for DSA, system design, SQL, aptitude and behavioural rounds with progress tracking.",
      },
      { property: "og:title", content: "Prep desk — Placement Desk" },
      {
        property: "og:description",
        content: "Preparation tracks for DSA, system design, SQL, aptitude and behavioural rounds.",
      },
      { property: "og:url", content: "/prep" },
    ],
    links: [{ rel: "canonical", href: "/prep" }],
  }),
  component: PrepPage,
});

const playbook = [
  {
    title: "The 48 hours before a technical round",
    steps: [
      "Re-read the job description and write the three topics it implies.",
      "Solve four problems in exactly those topics, out loud, on paper.",
      "Rebuild one of your own projects from memory on a whiteboard.",
      "Prepare two questions about the team's actual engineering problems.",
    ],
  },
  {
    title: "Answering 'tell me about yourself'",
    steps: [
      "One line on what you build, not where you study.",
      "One project with a number attached to the outcome.",
      "One sentence connecting that to this specific role.",
      "Stop at 90 seconds. Let them pick the thread.",
    ],
  },
];

export function PrepPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Preparation"
        title="Prep desk"
        description="Tracks are weighted by what the drives on your list actually test, not by generic syllabus order."
      />

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {prepTracks.map((t) => (
          <div key={t.title} className="panel p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{t.title}</p>
              <span className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t.tag}
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold">
              {t.progress}
              <span className="text-sm text-muted-foreground">%</span>
            </p>
            <div className="mt-2">
              <Meter value={t.progress} tone={t.progress >= 75 ? "success" : t.progress >= 40 ? "primary" : "warning"} />
            </div>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">{t.items}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {playbook.map((p) => (
          <section key={p.title} className="panel p-5">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <ol className="mt-3 space-y-2">
              {p.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-[13px] text-muted-foreground">
                  <span className="font-mono text-[11px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </Shell>
  );
}
