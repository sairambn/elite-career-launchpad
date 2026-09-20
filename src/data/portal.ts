export type Stage = "Applied" | "OA" | "Tech" | "HR" | "Offer";

export const STAGES: Stage[] = ["Applied", "OA", "Tech", "HR", "Offer"];

export type Drive = {
  id: string;
  company: string;
  role: string;
  location: string;
  type: "Full-time" | "Internship" | "Intern + PPO";
  ctc: string;
  deadline: string;
  deadlineIn: number;
  cgpaCutoff: number;
  branches: string[];
  backlogsAllowed: boolean;
  seats: number;
  applicants: number;
  rounds: string[];
  about: string;
  skills: string[];
};

export const student = {
  name: "Aarav Raghunathan",
  initials: "AR",
  roll: "21CS1042",
  branch: "CSE",
  cgpa: 8.41,
  backlogs: 0,
  gradYear: 2026,
  readiness: 78,
};

export const drives: Drive[] = [
  {
    id: "cobalt-sde1",
    company: "Cobalt Systems",
    role: "Software Engineer I",
    location: "Bengaluru",
    type: "Full-time",
    ctc: "₹22 LPA",
    deadline: "Fri, 09 Oct · 23:59",
    deadlineIn: 1,
    cgpaCutoff: 8.0,
    branches: ["CSE", "IT"],
    backlogsAllowed: false,
    seats: 12,
    applicants: 148,
    rounds: ["Online Assessment", "Tech Round 1", "Tech Round 2", "HR"],
    about:
      "Distributed storage team. Expect a heavy DSA screen followed by two systems-leaning technical rounds.",
    skills: ["DSA", "Go", "Distributed systems", "Linux"],
  },
  {
    id: "quanta-data",
    company: "Quanta Labs",
    role: "Data Engineer",
    location: "Hyderabad · Hybrid",
    type: "Full-time",
    ctc: "₹18 LPA",
    deadline: "Mon, 12 Oct · 18:00",
    deadlineIn: 4,
    cgpaCutoff: 7.5,
    branches: ["CSE", "IT", "ECE"],
    backlogsAllowed: false,
    seats: 20,
    applicants: 96,
    rounds: ["Online Assessment", "SQL + Modeling", "Hiring Manager"],
    about:
      "Builds the ingestion backbone for real-time telemetry. SQL depth matters more than raw algorithms here.",
    skills: ["SQL", "Python", "Airflow", "Warehousing"],
  },
  {
    id: "meridian-analyst",
    company: "Meridian Bank",
    role: "Quantitative Analyst",
    location: "Mumbai",
    type: "Full-time",
    ctc: "₹15 LPA",
    deadline: "Wed, 14 Oct · 12:00",
    deadlineIn: 6,
    cgpaCutoff: 7.0,
    branches: ["CSE", "IT", "ECE", "EEE", "MECH"],
    backlogsAllowed: true,
    seats: 30,
    applicants: 212,
    rounds: ["Aptitude", "Case Study", "Panel", "HR"],
    about:
      "Risk analytics desk. Strong aptitude and a clear case narrative beat heavy coding preparation.",
    skills: ["Statistics", "Excel", "Python", "Case framing"],
  },
  {
    id: "halcyon-ml",
    company: "Halcyon AI",
    role: "ML Engineer (Intern → PPO)",
    location: "Pune",
    type: "Intern + PPO",
    ctc: "₹28 LPA (PPO)",
    deadline: "Fri, 16 Oct · 23:59",
    deadlineIn: 8,
    cgpaCutoff: 8.5,
    branches: ["CSE"],
    backlogsAllowed: false,
    seats: 6,
    applicants: 74,
    rounds: ["Portfolio screen", "ML Fundamentals", "Applied round", "Founder chat"],
    about:
      "Applied research team. A public GitHub with reproducible projects is effectively a round of the process.",
    skills: ["PyTorch", "Transformers", "Evaluation", "Papers"],
  },
  {
    id: "vantage-backend",
    company: "Vantage Cloud",
    role: "Backend Engineer",
    location: "Remote (India)",
    type: "Full-time",
    ctc: "₹19 LPA",
    deadline: "Mon, 19 Oct · 20:00",
    deadlineIn: 11,
    cgpaCutoff: 7.2,
    branches: ["CSE", "IT", "ECE"],
    backlogsAllowed: true,
    seats: 15,
    applicants: 61,
    rounds: ["Online Assessment", "API design", "Tech deep dive", "HR"],
    about: "Platform team owning the public API. Expect API design over leetcode-style puzzles.",
    skills: ["Node/Go", "API design", "Postgres", "Testing"],
  },
  {
    id: "northwind-frontend",
    company: "Northwind Labs",
    role: "Frontend Engineer",
    location: "Bengaluru",
    type: "Full-time",
    ctc: "₹21 LPA",
    deadline: "Thu, 22 Oct · 23:59",
    deadlineIn: 14,
    cgpaCutoff: 7.8,
    branches: ["CSE", "IT"],
    backlogsAllowed: false,
    seats: 10,
    applicants: 88,
    rounds: ["Take-home build", "UI engineering round", "Craft review", "HR"],
    about:
      "Design-engineering culture. The take-home is graded on craft and accessibility, not feature count.",
    skills: ["React", "TypeScript", "CSS", "Accessibility"],
  },
];

export type Application = {
  driveId: string;
  company: string;
  role: string;
  stage: Stage;
  status: "active" | "offer" | "rejected";
  next: string;
  updated: string;
  history: { stage: Stage; note: string; date: string }[];
};

export const applications: Application[] = [
  {
    driveId: "cobalt-sde1",
    company: "Cobalt Systems",
    role: "Software Engineer I",
    stage: "Tech",
    status: "active",
    next: "Tech Round 2 · Thu 16:30",
    updated: "2h ago",
    history: [
      { stage: "Applied", note: "Application submitted", date: "Mon 03" },
      { stage: "OA", note: "Cleared · 84 percentile", date: "Wed 05" },
      { stage: "Tech", note: "Round 1 cleared", date: "Thu 06" },
    ],
  },
  {
    driveId: "quanta-data",
    company: "Quanta Labs",
    role: "Data Engineer",
    stage: "HR",
    status: "active",
    next: "HR conversation · Fri 11:00",
    updated: "Yesterday",
    history: [
      { stage: "Applied", note: "Application submitted", date: "Sep 28" },
      { stage: "OA", note: "Cleared · SQL 19/20", date: "Oct 01" },
      { stage: "Tech", note: "Modeling round cleared", date: "Oct 04" },
      { stage: "HR", note: "Scheduled", date: "Oct 10" },
    ],
  },
  {
    driveId: "meridian-analyst",
    company: "Meridian Bank",
    role: "Quantitative Analyst",
    stage: "OA",
    status: "active",
    next: "Aptitude test · Sat 09:00",
    updated: "3d ago",
    history: [
      { stage: "Applied", note: "Application submitted", date: "Oct 02" },
      { stage: "OA", note: "Slot confirmed", date: "Oct 07" },
    ],
  },
  {
    driveId: "halcyon-ml",
    company: "Halcyon AI",
    role: "ML Engineer",
    stage: "Applied",
    status: "active",
    next: "Portfolio screen pending",
    updated: "5d ago",
    history: [{ stage: "Applied", note: "Application submitted", date: "Oct 03" }],
  },
  {
    driveId: "northwind-frontend",
    company: "Northwind Labs",
    role: "Frontend Engineer",
    stage: "Offer",
    status: "offer",
    next: "Respond by Oct 20",
    updated: "Today",
    history: [
      { stage: "Applied", note: "Application submitted", date: "Sep 12" },
      { stage: "OA", note: "Take-home shortlisted", date: "Sep 18" },
      { stage: "Tech", note: "UI round cleared", date: "Sep 24" },
      { stage: "HR", note: "Culture round cleared", date: "Sep 30" },
      { stage: "Offer", note: "₹21 LPA offered", date: "Oct 08" },
    ],
  },
];

export const interviews = [
  { day: "Thu", date: "09", company: "Cobalt Systems", label: "Tech Round 2", time: "16:30", mode: "Video · Zoom" },
  { day: "Fri", date: "10", company: "Quanta Labs", label: "HR conversation", time: "11:00", mode: "Campus · Block C" },
  { day: "Sat", date: "11", company: "Meridian Bank", label: "Aptitude test", time: "09:00", mode: "Online proctored" },
  { day: "Mon", date: "13", company: "Vantage Cloud", label: "Pre-placement talk", time: "17:00", mode: "Auditorium" },
  { day: "Wed", date: "15", company: "Halcyon AI", label: "Portfolio screen", time: "14:15", mode: "Video · Meet" },
];

export const prepTracks = [
  { title: "Graphs & shortest paths", progress: 82, items: "41 / 50 problems", tag: "DSA" },
  { title: "System design: rate limiting", progress: 45, items: "5 / 11 modules", tag: "Design" },
  { title: "SQL window functions", progress: 90, items: "18 / 20 drills", tag: "Data" },
  { title: "Behavioural STAR bank", progress: 60, items: "9 / 15 stories", tag: "HR" },
  { title: "Aptitude: time & work", progress: 30, items: "6 / 20 sets", tag: "Aptitude" },
  { title: "Mock interviews", progress: 70, items: "7 / 10 booked", tag: "Mock" },
];

export type ProfileCheck = {
  id: string;
  title: string;
  weight: number;
  done: boolean;
  why: string;
  how: string;
};

export const githubChecks: ProfileCheck[] = [
  {
    id: "gh-readme",
    title: "Profile README with a one-line positioning statement",
    weight: 12,
    done: true,
    why: "Recruiters land on your profile root before any repo. Blank profiles read as inactive.",
    how: "Create a repo named exactly your username, add README.md: role you want, 3 strongest skills, 2 links.",
  },
  {
    id: "gh-pinned",
    title: "Six pinned repositories, ordered strongest first",
    weight: 14,
    done: true,
    why: "Pinned repos are the only projects most reviewers will ever open.",
    how: "Pin depth over breadth: 2 substantial projects, 1 library, 1 systems piece, 1 data piece, 1 open-source contribution.",
  },
  {
    id: "gh-readme-repo",
    title: "Every pinned repo has screenshots and a run-in-60-seconds section",
    weight: 14,
    done: false,
    why: "A reviewer who cannot run it in a minute grades it as unfinished.",
    how: "Each README: one screenshot or GIF, what it does in 2 lines, install + run commands, architecture note, live link.",
  },
  {
    id: "gh-commits",
    title: "Meaningful commit messages, no 'final final' history",
    weight: 8,
    done: false,
    why: "Commit history is the only unedited signal of how you actually work.",
    how: "Use imperative messages: 'add retry backoff to fetcher'. Squash junk history before pinning a repo.",
  },
  {
    id: "gh-tests",
    title: "At least one repo with tests and CI passing",
    weight: 12,
    done: false,
    why: "Tests separate coursework from engineering, especially for backend and platform roles.",
    how: "Add a test suite plus a GitHub Actions workflow. Show the passing badge in the README.",
  },
  {
    id: "gh-oss",
    title: "One merged open-source pull request",
    weight: 10,
    done: false,
    why: "A merged PR proves you can work in a codebase you did not write.",
    how: "Start with docs or small bug labels in a library you already use. Link the merged PR in your README.",
  },
  {
    id: "gh-activity",
    title: "Consistent contribution activity over the last 90 days",
    weight: 8,
    done: true,
    why: "Recency beats volume. A dead graph undercuts everything you claim in interviews.",
    how: "Commit something small on a fixed weekly cadence rather than one weekend burst.",
  },
  {
    id: "gh-profile-meta",
    title: "Bio, location, email and portfolio link filled in",
    weight: 6,
    done: true,
    why: "Recruiters search GitHub by location and skill. Missing fields drop you out of results.",
    how: "Fill bio with role + stack, add city, add a contactable email and one portfolio link.",
  },
  {
    id: "gh-topics",
    title: "Repo topics and descriptions set for discoverability",
    weight: 6,
    done: false,
    why: "Topics make repos surface in GitHub search and inside recruiter tooling.",
    how: "Add 4-6 topics per pinned repo and a one-sentence description with the stack named.",
  },
  {
    id: "gh-license",
    title: "License and contribution guide on flagship repos",
    weight: 5,
    done: false,
    why: "Signals that you think about a project as software other people might use.",
    how: "Add MIT LICENSE and a short CONTRIBUTING.md to your two strongest repos.",
  },
  {
    id: "gh-pages",
    title: "Live deployment linked from each buildable project",
    weight: 5,
    done: true,
    why: "A working link converts a skim into an actual evaluation.",
    how: "Deploy and put the URL in the repo's About field, not only in the README body.",
  },
];

export const linkedinChecks: ProfileCheck[] = [
  {
    id: "li-headline",
    title: "Headline states role target plus proof, not 'Student at ...'",
    weight: 14,
    done: false,
    why: "The headline is indexed by recruiter search and shown in every search result.",
    how: "Format: 'Backend Engineer · Go, Postgres · Built X handling Y' — role first, stack second, proof third.",
  },
  {
    id: "li-about",
    title: "About section: 3 short paragraphs with numbers",
    weight: 12,
    done: false,
    why: "Generic 'passionate learner' text is the single most common reason a profile reads as junior.",
    how: "Para 1: what you build. Para 2: two projects with measurable outcomes. Para 3: what you are looking for.",
  },
  {
    id: "li-photo",
    title: "Clear headshot and a banner that names your specialisation",
    weight: 8,
    done: true,
    why: "Profiles with a photo receive substantially more recruiter views.",
    how: "Plain background, face filling ~60% of frame. Banner: your specialisation in large type.",
  },
  {
    id: "li-experience",
    title: "Experience bullets written as action → tool → result",
    weight: 14,
    done: false,
    why: "Duty lists say what you were assigned; result lines say what you changed.",
    how: "'Cut API p95 from 800ms to 210ms by adding Redis caching' — verb, mechanism, measured delta.",
  },
  {
    id: "li-projects",
    title: "Projects section mirrors your pinned GitHub repos",
    weight: 10,
    done: true,
    why: "Recruiters rarely cross-check platforms. Keep the same story in both places.",
    how: "Add each pinned repo as a project with the repo link and the same one-line description.",
  },
  {
    id: "li-skills",
    title: "Top 3 skills pinned and matched to your target roles",
    weight: 8,
    done: true,
    why: "Recruiter filters run on the skills list, and only the top three are visible by default.",
    how: "Pin the three from your target job descriptions. Remove unrelated filler skills.",
  },
  {
    id: "li-url",
    title: "Custom profile URL",
    weight: 5,
    done: true,
    why: "A clean URL is what goes on your resume and email signature.",
    how: "Edit public profile URL to linkedin.com/in/firstname-lastname.",
  },
  {
    id: "li-recs",
    title: "Two recommendations from mentors or teammates",
    weight: 9,
    done: false,
    why: "Third-party text is the only part of the profile you did not write about yourself.",
    how: "Ask an internship mentor and a project teammate. Give them 3 bullets to work from.",
  },
  {
    id: "li-open",
    title: "Open-to-work configured for recruiters only",
    weight: 6,
    done: false,
    why: "Recruiter-only mode surfaces you in their search without a public badge.",
    how: "Set target titles, locations, and start date. Keep visibility to recruiters.",
  },
  {
    id: "li-activity",
    title: "Posted or commented substantively in the last 30 days",
    weight: 8,
    done: false,
    why: "Activity lifts profile distribution and gives interviewers something to open with.",
    how: "Write one short build log per project milestone. Two paragraphs beats a thread.",
  },
  {
    id: "li-education",
    title: "Education entry with coursework, CGPA and honours",
    weight: 6,
    done: true,
    why: "Campus recruiters filter on this before reading anything else.",
    how: "Add branch, graduation year, CGPA, and 4 relevant courses.",
  },
];

export function scoreOf(checks: ProfileCheck[]) {
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.filter((c) => c.done).reduce((s, c) => s + c.weight, 0);
  return Math.round((got / total) * 100);
}
