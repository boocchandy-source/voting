import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  announcements,
  candidates,
  electionSettings,
  positions,
  students,
} from "./schema";

const POSITION_NAMES = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Auditor",
  "P.I.O.",
];

const CANDIDATES: { name: string; position: string; course: string; tagline: string }[] = [
  { name: "Maria Clara Santos", position: "President", course: "BSIT 3rd year", tagline: "Leadership with integrity, progress for all." },
  { name: "Jose Miguel Reyes", position: "President", course: "BSBA 4th year", tagline: "A stronger student voice in every decision." },
  { name: "Ana Beatriz Lim", position: "Vice President", course: "BSA 3rd year", tagline: "Working beside you, leading with you." },
  { name: "Mark Anthony Cruz", position: "Vice President", course: "BSCS 2nd year", tagline: "Action over promises, results over words." },
  { name: "Sofia Isabel Torres", position: "Secretary", course: "BAC 3rd year", tagline: "Organized records, transparent service." },
  { name: "Daniel Garcia Reyes", position: "Secretary", course: "BSIT 2nd year", tagline: "Every document in order, every voice heard." },
  { name: "Katrina Uy Villanueva", position: "Treasurer", course: "BSA 4th year", tagline: "Honest funds, clear reports, zero doubt." },
  { name: "Paolo Miguel Aquino", position: "Treasurer", course: "BSBA 3rd year", tagline: "Your fees, accounted for to the last centavo." },
  { name: "Rosa Maria Delgado", position: "Auditor", course: "BSA 2nd year", tagline: "Independent eyes on every transaction." },
  { name: "Kevin Tan Sy", position: "Auditor", course: "BSIT 4th year", tagline: "Accuracy you can verify, anytime." },
  { name: "Angela Marie Flores", position: "P.I.O.", course: "BAC 2nd year", tagline: "News you need, when you need it." },
  { name: "Rafael Jose Mendoza", position: "P.I.O.", course: "BSCS 3rd year", tagline: "Connecting the council to every student." },
];

const ANNOUNCEMENTS = [
  {
    title: "Student elections are now open",
    body: "Voting is officially open from October 1 to October 7, 2026. Log in to the voting portal, review the candidates, and cast your vote. Your voice matters — be part of a better tomorrow.",
    publishedAt: new Date("2026-10-01T08:00:00"),
    isLatest: true,
  },
  {
    title: "Meet the candidates forum on Oct 3",
    body: "Get to know your candidates at the open forum on October 3, 2:00 PM at the TCC Gymnasium. Each candidate will present their platform followed by an open question-and-answer portion.",
    publishedAt: new Date("2026-10-02T09:00:00"),
    isLatest: false,
  },
  {
    title: "Voting ends Oct 7 at 5:00 PM",
    body: "Reminder: the voting period closes on October 7, 2026 at 5:00 PM sharp. Votes submitted after the deadline will not be counted. Tabulation and proclamation follow on October 8.",
    publishedAt: new Date("2026-10-05T09:00:00"),
    isLatest: false,
  },
];

async function ensureStudent(
  studentId: string,
  lastname: string,
  firstname: string,
  password: string,
  isAdmin: boolean
) {
  const existing = await db
    .select()
    .from(students)
    .where(eq(students.studentId, studentId));
  if (existing.length > 0) {
    console.log(`student ${studentId} already exists, skipping`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(students).values({
    studentId,
    lastname,
    firstname,
    passwordHash,
    isAdmin,
    status: "approved",
  });
  console.log(`seeded student ${studentId}${isAdmin ? " (admin)" : ""}`);
}

async function main() {
  // Positions
  const positionIds: Record<string, number> = {};
  for (let i = 0; i < POSITION_NAMES.length; i++) {
    const name = POSITION_NAMES[i];
    const existing = await db
      .select()
      .from(positions)
      .where(eq(positions.name, name));
    if (existing.length > 0) {
      positionIds[name] = existing[0].id;
    } else {
      const [row] = await db
        .insert(positions)
        .values({ name, sortOrder: i })
        .returning();
      positionIds[name] = row.id;
      console.log(`seeded position ${name}`);
    }
  }

  // Candidates
  for (const c of CANDIDATES) {
    const existing = await db
      .select()
      .from(candidates)
      .where(eq(candidates.name, c.name));
    if (existing.length === 0) {
      await db.insert(candidates).values({
        positionId: positionIds[c.position],
        name: c.name,
        course: c.course,
        tagline: c.tagline,
      });
      console.log(`seeded candidate ${c.name}`);
    }
  }

  // Announcements
  for (const a of ANNOUNCEMENTS) {
    const existing = await db
      .select()
      .from(announcements)
      .where(eq(announcements.title, a.title));
    if (existing.length === 0) {
      await db.insert(announcements).values(a);
      console.log(`seeded announcement "${a.title}"`);
    }
  }

  // Election window (admin can change this from the admin dashboard)
  const existingSettings = await db.select().from(electionSettings);
  if (existingSettings.length === 0) {
    await db.insert(electionSettings).values({
      votingStart: new Date("2026-10-01T08:00:00"),
      votingEnd: new Date("2026-10-07T17:00:00"),
    });
    console.log("seeded election settings");
  }

  // Demo accounts (change passwords after first login)
  await ensureStudent("00005050", "Dela Cruz", "Juan", "student123", false);
  await ensureStudent("admin", "Admin", "System", "admin123", true);
  await ensureStudent("00004932", "Booc", "Chandy", "informationtecnology", true);

  console.log("seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
