import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 32 }).notNull().unique(),
  lastname: varchar("lastname", { length: 100 }).notNull(),
  firstname: varchar("firstname", { length: 100 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  hasVoted: boolean("has_voted").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  // pending → waiting for admin approval, approved → can log in, rejected → blocked
  status: varchar("status", { length: 16 }).notNull().default("approved"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  positionId: integer("position_id")
    .notNull()
    .references(() => positions.id),
  name: varchar("name", { length: 128 }).notNull(),
  course: varchar("course", { length: 64 }).notNull(),
  tagline: text("tagline").notNull().default(""),
});

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id),
    positionId: integer("position_id")
      .notNull()
      .references(() => positions.id),
    candidateId: integer("candidate_id")
      .notNull()
      .references(() => candidates.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("votes_student_position_unique").on(t.studentId, t.positionId)]
);

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  isLatest: boolean("is_latest").notNull().default(false),
});

// Single-row table (id = 1) holding the admin-controlled election window.
export const electionSettings = pgTable("election_settings", {
  id: serial("id").primaryKey(),
  votingStart: timestamp("voting_start").notNull(),
  votingEnd: timestamp("voting_end").notNull(),
});

// Admin-declared winner per position (overrides vote counts in results).
export const electionWinners = pgTable(
  "election_winners",
  {
    id: serial("id").primaryKey(),
    positionId: integer("position_id")
      .notNull()
      .references(() => positions.id)
      .unique(),
    candidateId: integer("candidate_id")
      .notNull()
      .references(() => candidates.id),
  }
);
