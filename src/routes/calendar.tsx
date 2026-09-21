import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/Shell";
import { drives, interviews } from "@/data/portal";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Interview calendar — Placement Desk" },
      {
        name: "description",
        content: "Every scheduled interview, test slot and pre-placement talk with time, mode and venue.",
      },
      { property: "og:title", content: "Interview calendar — Placement Desk" },
      {
        property: "og:description",
        content: "Interviews, test slots and pre-placement talks with time, mode and venue.",
      },
      { property: "og:url", content: "/calendar" },
    ],
    links: [{ rel: "canonical", href: "/calendar" }],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const deadlines = [...drives].sort((a, b) => a.deadlineIn - b.deadlineIn);

  return (
    <Shell>
      <PageHeader
        eyebrow="Next 14 days"
        title="Calendar"
        description="Interview slots on the left, application deadlines on the right. Nothing here is hidden behind a click."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="panel p-5">
          <h2 className="text-lg font-semibold">Scheduled</h2>
          <ul className="mt-4 divide-y divide-border">
            {interviews.map((i) => (
              <li key={`${i.date}-${i.company}`} className="flex items-center gap-4 py-3.5">
                <div className="w-12 shrink-0 rounded-md border border-border bg-surface-2 py-1.5 text-center">
                  <p className="label-mono">{i.day}</p>
                  <p className="font-display text-lg font-semibold leading-none">{i.date}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{i.company}</p>
                  <p className="truncate text-[13px] text-muted-foreground">
                    {i.label} · {i.mode}
                  </p>
                </div>
                <p className="font-mono text-[12px] text-primary">{i.time}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-5">
          <h2 className="text-lg font-semibold">Deadlines</h2>
          <ul className="mt-4 space-y-3">
            {deadlines.map((d) => (
              <li key={d.id} className="flex items-center gap-3">
                <span
                  className={`w-10 shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-[11px] ${
                    d.deadlineIn <= 2
                      ? "bg-destructive/15 text-destructive"
                      : d.deadlineIn <= 6
                        ? "bg-warning/15 text-warning"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {d.deadlineIn}d
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{d.company}</span>
                  <span className="block truncate font-mono text-[11px] text-muted-foreground">
                    {d.deadline}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
