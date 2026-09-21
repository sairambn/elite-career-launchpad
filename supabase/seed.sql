-- Seed data for Elite Career Launchpad
-- Run AFTER the migration and AFTER creating at least one test user.
-- Replace the UUID below with a real auth.users.id from your project.

-- ========== DRIVES (public, run anytime) ==========
insert into public.drives (id, company, role, location, type, ctc, deadline, cgpa_cutoff, branches, backlogs_allowed, seats, applicants, rounds, about, skills)
values
  (
    'cobalt-sde1',
    'Cobalt Systems',
    'Software Engineer I',
    'Bengaluru',
    'Full-time',
    '₹22 LPA',
    '2025-10-09 23:59:00+05:30',
    8.0,
    array['CSE', 'IT'],
    false,
    12,
    148,
    array['Online Assessment', 'Tech Round 1', 'Tech Round 2', 'HR'],
    'Distributed storage team. Expect a heavy DSA screen followed by two systems-leaning technical rounds.',
    array['DSA', 'Go', 'Distributed systems', 'Linux']
  ),
  (
    'quanta-data',
    'Quanta Labs',
    'Data Engineer',
    'Hyderabad · Hybrid',
    'Full-time',
    '₹18 LPA',
    '2025-10-12 18:00:00+05:30',
    7.5,
    array['CSE', 'IT', 'ECE'],
    false,
    20,
    96,
    array['Online Assessment', 'SQL + Modeling', 'Hiring Manager'],
    'Builds the ingestion backbone for real-time telemetry. SQL depth matters more than raw algorithms here.',
    array['SQL', 'Python', 'Airflow', 'Warehousing']
  ),
  (
    'meridian-analyst',
    'Meridian Bank',
    'Quantitative Analyst',
    'Mumbai',
    'Full-time',
    '₹15 LPA',
    '2025-10-14 12:00:00+05:30',
    7.0,
    array['CSE', 'IT', 'ECE', 'EEE', 'MECH'],
    true,
    30,
    212,
    array['Aptitude', 'Case Study', 'Panel', 'HR'],
    'Risk analytics desk. Strong aptitude and a clear case narrative beat heavy coding preparation.',
    array['Statistics', 'Excel', 'Python', 'Case framing']
  ),
  (
    'halcyon-ml',
    'Halcyon AI',
    'ML Engineer (Intern → PPO)',
    'Pune',
    'Intern + PPO',
    '₹28 LPA (PPO)',
    '2025-10-16 23:59:00+05:30',
    8.5,
    array['CSE'],
    false,
    6,
    74,
    array['Portfolio screen', 'ML Fundamentals', 'Applied round', 'Founder chat'],
    'Applied research team. A public GitHub with reproducible projects is effectively a round of the process.',
    array['PyTorch', 'Transformers', 'Evaluation', 'Papers']
  ),
  (
    'vantage-backend',
    'Vantage Cloud',
    'Backend Engineer',
    'Remote (India)',
    'Full-time',
    '₹19 LPA',
    '2025-10-19 20:00:00+05:30',
    7.2,
    array['CSE', 'IT', 'ECE'],
    true,
    15,
    61,
    array['Online Assessment', 'API design', 'Tech deep dive', 'HR'],
    'Platform team owning the public API. Expect API design over leetcode-style puzzles.',
    array['Node/Go', 'API design', 'Postgres', 'Testing']
  ),
  (
    'northwind-frontend',
    'Northwind Labs',
    'Frontend Engineer',
    'Bengaluru',
    'Full-time',
    '₹21 LPA',
    '2025-10-22 23:59:00+05:30',
    7.8,
    array['CSE', 'IT'],
    false,
    10,
    88,
    array['Take-home build', 'UI engineering round', 'Craft review', 'HR'],
    'Design-engineering culture. The take-home is graded on craft and accessibility, not feature count.',
    array['React', 'TypeScript', 'CSS', 'Accessibility']
  )
on conflict (id) do nothing;

-- ========== DEMO USER DATA ==========
-- 1. Create a user in Supabase Auth dashboard (or sign up in the app)
-- 2. Copy that user's UUID
-- 3. Uncomment and replace YOUR_USER_UUID below, then run the rest

/*
-- Example (replace UUID):
do $$
declare
  uid uuid := 'YOUR_USER_UUID_HERE';
begin
  insert into public.profiles (id, email, name, initials, roll, branch, cgpa, backlogs, grad_year, readiness)
  values (uid, 'aarav@example.com', 'Aarav Raghunathan', 'AR', '21CS1042', 'CSE', 8.41, 0, 2026, 78)
  on conflict (id) do update set
    name = excluded.name,
    initials = excluded.initials,
    roll = excluded.roll,
    branch = excluded.branch,
    cgpa = excluded.cgpa,
    readiness = excluded.readiness;

  insert into public.applications (user_id, drive_id, stage, status, next_action)
  values
    (uid, 'cobalt-sde1', 'Tech', 'active', 'Tech Round 2 · Thu 16:30'),
    (uid, 'quanta-data', 'HR', 'active', 'HR conversation · Fri 11:00'),
    (uid, 'meridian-analyst', 'OA', 'active', 'Aptitude test · Sat 09:00'),
    (uid, 'vantage-backend', 'Applied', 'active', 'Online Assessment pending'),
    (uid, 'halcyon-ml', 'Offer', 'offer', 'Offer letter review')
  on conflict (user_id, drive_id) do nothing;
end $$;
*/
