import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { applications, drives, student } from "@/data/portal";

export const Route = createFileRoute("/drives/$driveId")({
  loader: ({ params }) => {
    const drive = drives.find((d) => d.id === params.driveId);
    if (!drive) throw notFound();
    return { drive };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Drive unavailable — Placement Desk" }, { name: "robots", content: "noindex" }],
      };
    }
    const { drive } = loaderData;
    const title = `${drive.company} · ${drive.role} — Placement Desk`;
    const description = `${drive.ctc} · ${drive.location}. Eligibility CGPA ${drive.cgpaCutoff}, ${drive.branches.join("/")}. Closes ${drive.deadline}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/drives/${params.driveId}` },
      ],
      links: [{ rel: "canonical", href: `/drives/${params.driveId}` }],
    };
  },
  component: DriveDetail,
});

function DriveDetail() {
  const { drive } = Route.useLoaderData();
  const app = applications.find((a) => a.driveId === drive.id);
  const eligible = student.cgpa >= drive.cgpaCutoff && drive.branches.includes(student.branch);

  return (
    <Shell>
      <Link to="/drives" className="font-mono text-[11px] text-muted-foreground hover:text-foreground">
        ← All drives
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono">{drive.type}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{drive.company}</h1>
          <p className="mt-1 text-muted-foreground">
            {drive.role} · {drive.location}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-semibold">{drive.ctc}</p>
          <p className="font-mono text-[11px] text-warning">Closes {drive.deadline}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <section className="panel p-5">
            <h2 className="text-lg font-semibold">What to expect</h2>
            <p className="mt-2 text-sm text-muted-foreground">{drive.about}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {drive.skills.map((s) => (
                <span key={s} className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <h2 className="text-lg font-semibold">Rounds</h2>
            <ol className="mt-4 space-y-3">
              {drive.rounds.map((r, i) => (
                <li key={r} className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[11px] text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm">{r}</span>
                </li>
              ))}
            </ol>
          </section>

          {app ? (
            <section className="panel p-5">
              <h2 className="text-lg font-semibold">Your progress</h2>
              <ul className="mt-4 space-y-3">
                {app.history.map((h) => (
                  <li key={h.stage} className="flex items-center gap-3 text-sm">
                    <span className="w-14 font-mono text-[11px] text-muted-foreground">{h.date}</span>
                    <span className="rounded bg-success/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-success">
                      {h.stage}
                    </span>
                    <span className="text-muted-foreground">{h.note}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-[11px] text-primary">Next: {app.next}</p>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <section className="panel p-5">
            <h2 className="text-lg font-semibold">Eligibility</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row k="CGPA cutoff" v={`${drive.cgpaCutoff}`} ok={student.cgpa >= drive.cgpaCutoff} />
              <Row k="Branches" v={drive.branches.join(", ")} ok={drive.branches.includes(student.branch)} />
              <Row
                k="Backlogs"
                v={drive.backlogsAllowed ? "Allowed" : "Not allowed"}
                ok={drive.backlogsAllowed || student.backlogs === 0}
              />
              <Row k="Seats" v={`${drive.seats}`} />
              <Row k="Applicants" v={`${drive.applicants}`} />
            </dl>
            <button
              disabled={!eligible}
              className="mt-5 h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              {app ? "Application in progress" : eligible ? "Apply to this drive" : "Not eligible"}
            </button>
          </section>

          <section className="panel p-5">
            <h2 className="text-lg font-semibold">Before you apply</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This recruiter will open your GitHub and LinkedIn. Clear the outstanding fixes first.
            </p>
            <Link
              to="/profile"
              className="mt-4 inline-block font-mono text-[11px] text-primary hover:underline"
            >
              Open Profile Lab →
            </Link>
          </section>
        </aside>
      </div>
    </Shell>
  );
}

function Row({ k, v, ok }: { k: string; v: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd
        className={`font-mono text-[12px] ${
          ok === undefined ? "" : ok ? "text-success" : "text-destructive"
        }`}
      >
        {v}
      </dd>
    </div>
  );
}
