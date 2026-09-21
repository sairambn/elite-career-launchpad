import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  real,
  jsonb,
  pgEnum,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const stageEnum = pgEnum("stage", [
  "Applied",
  "OA",
  "Tech",
  "HR",
  "Offer",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "active",
  "offer",
  "rejected",
]);

export const driveTypeEnum = pgEnum("drive_type", [
  "Full-time",
  "Internship",
  "Intern + PPO",
]);

// Linked to auth.users
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // matches auth.users.id
  email: text("email").notNull(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  roll: text("roll").notNull().unique(),
  branch: text("branch").notNull(),
  cgpa: real("cgpa").notNull().default(0),
  backlogs: integer("backlogs").notNull().default(0),
  gradYear: integer("grad_year").notNull(),
  readiness: integer("readiness").notNull().default(0),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const drives = pgTable(
  "drives",
  {
    id: text("id").primaryKey(),
    company: text("company").notNull(),
    role: text("role").notNull(),
    location: text("location").notNull(),
    type: driveTypeEnum("type").notNull(),
    ctc: text("ctc").notNull(),
    deadline: timestamp("deadline", { withTimezone: true }).notNull(),
    cgpaCutoff: real("cgpa_cutoff").notNull(),
    branches: text("branches").array().notNull(),
    backlogsAllowed: boolean("backlogs_allowed").notNull().default(false),
    seats: integer("seats").notNull(),
    applicants: integer("applicants").notNull().default(0),
    rounds: text("rounds").array().notNull(),
    about: text("about").notNull(),
    skills: text("skills").array().notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("drives_deadline_idx").on(t.deadline)],
);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    driveId: text("drive_id")
      .notNull()
      .references(() => drives.id, { onDelete: "cascade" }),
    stage: stageEnum("stage").notNull().default("Applied"),
    status: applicationStatusEnum("status").notNull().default("active"),
    nextAction: text("next_action"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("applications_user_idx").on(t.userId),
    index("applications_drive_idx").on(t.driveId),
  ],
);

export const applicationHistory = pgTable("application_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  stage: stageEnum("stage").notNull(),
  note: text("note").notNull(),
  happenedAt: timestamp("happened_at", { withTimezone: true }).defaultNow().notNull(),
});

export const interviews = pgTable(
  "interviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    driveId: text("drive_id").references(() => drives.id, { onDelete: "set null" }),
    company: text("company").notNull(),
    label: text("label").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    mode: text("mode").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("interviews_user_starts_idx").on(t.userId, t.startsAt)],
);

export const prepTracks = pgTable("prep_tracks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  progress: integer("progress").notNull().default(0),
  itemsLabel: text("items_label").notNull(),
  tag: text("tag").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const profileChecks = pgTable(
  "profile_checks",
  {
    id: text("id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    category: text("category").notNull(), // "github" | "linkedin"
    title: text("title").notNull(),
    weight: integer("weight").notNull(),
    done: boolean("done").notNull().default(false),
    why: text("why").notNull(),
    how: text("how").notNull(),
  },
  (t) => [primaryKey({ columns: [t.id, t.userId] })],
);

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  applications: many(applications),
  interviews: many(interviews),
  prepTracks: many(prepTracks),
  profileChecks: many(profileChecks),
}));

export const drivesRelations = relations(drives, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(profiles, { fields: [applications.userId], references: [profiles.id] }),
  drive: one(drives, { fields: [applications.driveId], references: [drives.id] }),
  history: many(applicationHistory),
}));

export const applicationHistoryRelations = relations(applicationHistory, ({ one }) => ({
  application: one(applications, {
    fields: [applicationHistory.applicationId],
    references: [applications.id],
  }),
}));
