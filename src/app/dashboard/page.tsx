"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

const ELECTION_END = new Date("2026-10-07T17:00:00").getTime();

type Section =
  | "Dashboard"
  | "My Vote"
  | "Candidates"
  | "Election Details"
  | "Announcements"
  | "Results"
  | "Help & Support";

type Candidate = {
  id: number;
  name: string;
  course: string;
  tagline: string;
};

type BallotPosition = {
  id: number;
  name: string;
  candidates: Candidate[];
};

type AnnouncementItem = {
  id: number;
  title: string;
  body: string;
  date: string;
  latest: boolean;
};

type Me = {
  firstname: string;
  lastname: string;
  studentId: string;
  hasVoted: boolean;
  isAdmin: boolean;
};

type ResultPosition = {
  id: number;
  name: string;
  total: number;
  candidates: { id: number; name: string; course: string; votes: number; winner?: boolean }[];
};

const NAV_ITEMS: { label: Section; icon: React.ReactNode }[] = [
  {
    label: "Dashboard",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 9-8 9 8" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M10 21v-6h4v6" />
      </svg>
    ),
  },
  {
    label: "My Vote",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="m8.5 12.5 2.5 2.5 5-5.5" />
      </svg>
    ),
  },
  {
    label: "Candidates",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="8.5" cy="8" r="2.5" />
        <circle cx="15.5" cy="9.5" r="2" />
        <path d="M3.5 19c.6-3 2.8-4.5 5-4.5s4.4 1.5 5 4.5" />
        <path d="M14.5 14.7c2 .2 3.8 1.4 4.4 3.8" />
      </svg>
    ),
  },
  {
    label: "Election Details",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    label: "Announcements",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11v3l4 1 2 5h2l-1-5 9 3V6L8 10H3v1Z" />
        <path d="M19 6v12" />
      </svg>
    ),
  },
  {
    label: "Results",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="white">
        <rect x="3" y="14" width="3.4" height="6" rx="0.6" />
        <rect x="8" y="11" width="3.4" height="9" rx="0.6" />
        <rect x="12.6" y="7.5" width="3.4" height="12.5" rx="0.6" />
        <rect x="17.2" y="3.5" width="3.4" height="16.5" rx="0.6" />
      </svg>
    ),
  },
  {
    label: "Help & Support",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.6-2.4 2-2.4 3.3" />
        <circle cx="12" cy="16.8" r="0.4" fill="currentColor" />
      </svg>
    ),
  },
];

const STATS: { title: string; value: string; link: string; target: Section; icon: React.ReactNode }[] = [
  {
    title: "Total Candidates",
    value: "",
    link: "View Candidates →",
    target: "Candidates",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="8.5" cy="8" r="2.5" />
        <circle cx="15.5" cy="9.5" r="2" />
        <path d="M3.5 19c.6-3 2.8-4.5 5-4.5s4.4 1.5 5 4.5" />
        <path d="M14.5 14.7c2 .2 3.8 1.4 4.4 3.8" />
      </svg>
    ),
  },
  {
    title: "Voting Status",
    value: "",
    link: "Cast Your Vote →",
    target: "My Vote",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="m8 12.5 2.8 2.8L16.5 9" />
      </svg>
    ),
  },
  {
    title: "Election Period",
    value: "Oct 1 – Oct 7, 2026",
    link: "View Details →",
    target: "Election Details",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round">
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
        <path d="M7.5 14h3M7.5 17h6" />
      </svg>
    ),
  },
  {
    title: "Announcements",
    value: "",
    link: "Read Now →",
    target: "Announcements",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3.5h11a2 2 0 0 1 2 2v13l-3.5-2.5h-9.5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2Z" />
        <path d="M9 8.5h6M9 12h6" />
      </svg>
    ),
  },
];

const TIMELINE: { date: string; event: string; done: boolean }[] = [
  { date: "Sep 22 – 26", event: "Filing of certificates of candidacy", done: true },
  { date: "Oct 1 · 8:00 AM", event: "Voting period opens", done: true },
  { date: "Oct 3 · 2:00 PM", event: "Candidate forum at the TCC Gymnasium", done: false },
  { date: "Oct 7 · 5:00 PM", event: "Voting period ends", done: false },
  { date: "Oct 8", event: "Tabulation of votes and proclamation of winners", done: false },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Who is allowed to vote?",
    a: "All officially enrolled students of Torres Capitol College for the current semester are allowed to vote, using their assigned student account.",
  },
  {
    q: "How do I cast my vote?",
    a: "Go to My Vote, select one candidate per position on the ballot, review your choices, then press Submit Ballot. Your vote is final once submitted.",
  },
  {
    q: "Can I change my vote after submitting?",
    a: "No. Each student is allowed to cast one (1) vote only, and submitted ballots cannot be changed. Please review your selections carefully.",
  },
  {
    q: "When will the results be released?",
    a: "Votes are tabulated after the voting period ends on October 7, and winners are proclaimed on October 8. Results will appear in the Results section.",
  },
  {
    q: "Who do I contact if I have a problem?",
    a: "For account or technical issues, visit the ICT Office, or send us a message through the Contact page and our team will assist you.",
  },
];

function slugify(s: Section) {
  return s.toLowerCase().replace(/[^a-z]+/g, "-");
}

function sectionFromHash(): Section {
  if (typeof window === "undefined") return "Dashboard";
  const h = window.location.hash.replace("#", "");
  return NAV_ITEMS.find((n) => slugify(n.label) === h)?.label ?? "Dashboard";
}

function formatRange(startMs: number, endMs: number) {
  const f = (ms: number) =>
    new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${f(startMs)} – ${f(endMs)}, ${new Date(endMs).getFullYear()}`;
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function useCountdown(end: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, end - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    window.location.href = "/";
  }
}

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-[18px] border border-white/15 bg-[#0d1117]/55 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl ${className}`}>
      {children}
    </div>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-4 text-[11px] sm:text-[13px] font-light tracking-[0.42em] text-white/85">
        <span className="h-px w-10 bg-white/70" />
        {eyebrow}
      </p>
      <h1 className="mt-2 sm:mt-3 font-display leading-[1.06] text-[clamp(1.6rem,4.5vw,2.8rem)] text-white">
        {title}
      </h1>
      <p className="mt-2 max-w-[560px] text-[13.5px] sm:text-[15px] leading-[1.55] text-white/85 font-light">
        {sub}
      </p>
    </div>
  );
}

function Sidebar({
  active,
  onSelect,
  name,
  role,
}: {
  active: Section;
  onSelect: (s: Section) => void;
  name: string;
  role: string;
}) {
  return (
    <aside className="dash-side fixed left-0 top-0 hidden h-screen w-[248px] xl:w-[264px] shrink-0 flex-col border-r border-white/10 bg-[#0d1117] px-5 py-6 lg:flex">
      <Link href="/" className="flex shrink-0 items-center gap-3 px-1">
        <Image
          src="/tcc-logo.png"
          alt="Torres Capitol College logo"
          width={120}
          height={128}
          className="h-[52px] w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        />
        <div className="font-display text-[13px] leading-[1.25] tracking-[0.06em] text-white">
          TORRES
          <br />
          CAPITOL
          <br />
          COLLEGE
        </div>
      </Link>

      <nav className="mt-8 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(item.label)}
            className={`flex shrink-0 items-center gap-3.5 rounded-[12px] border px-4 py-3 text-left text-[14.5px] transition ${
              active === item.label
                ? "border-white/50 bg-white/10 font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                : "border-transparent font-normal text-white/75 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-4 shrink-0 border-t border-white/15 pt-4">
        <div className="flex items-center gap-3">
          <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.6" />
              <path d="M5 20c1-3.8 3.7-5.5 7-5.5s6 1.7 7 5.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-white">{name}</p>
            <p className="text-[12px] font-light text-white/60">{role}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            className="shrink-0 p-1.5 text-white/70 transition hover:text-white"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

function DashboardHome({
  go,
  count,
  name,
  hasVoted,
  candidateCount,
  announcements,
  electionStart,
  electionEnd,
}: {
  go: (s: Section) => void;
  count: { days: number; hours: number; minutes: number; seconds: number };
  name: string;
  hasVoted: boolean;
  candidateCount: number;
  announcements: AnnouncementItem[];
  electionStart: number;
  electionEnd: number;
}) {
  const units = [
    { value: count.days, label: "Days" },
    { value: count.hours, label: "Hours" },
    { value: count.minutes, label: "Minutes" },
    { value: count.seconds, label: "Seconds" },
  ];
  const latest = announcements.find((a) => a.latest) ?? announcements[0];
  const stats = STATS.map((s) => {
    if (s.title === "Total Candidates") return { ...s, value: String(candidateCount) };
    if (s.title === "Voting Status")
      return { ...s, value: hasVoted ? "Voted" : "Not Voted" };
    if (s.title === "Announcements")
      return { ...s, value: String(announcements.length) };
    if (s.title === "Election Period")
      return { ...s, value: formatRange(electionStart, electionEnd) };
    return s;
  });
  return (
    <>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="dash-eyebrow flex items-center gap-4 text-[11px] sm:text-[13px] font-light tracking-[0.42em] text-white/85">
            <span className="h-px w-10 bg-white/70" />
            STUDENT ELECTIONS
          </p>
          <h1 className="mt-2 sm:mt-3 font-display leading-[1.06] text-[clamp(1.7rem,5vw,3.2rem)]">
            <span className="dash-title block text-white">Welcome Back,</span>
            <span className="dash-title block text-white">{name}</span>
          </h1>
          <p className="dash-sub mt-2.5 max-w-[480px] text-[13.5px] sm:text-[15px] leading-[1.55] text-white/85 font-light">
            Your voice matters. Be part of a better tomorrow.
          </p>
        </div>

        <div className="dash-count w-full max-w-[420px] shrink-0 rounded-[18px] border border-white/20 bg-[#0d1117]/55 px-5 sm:px-6 py-4 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl xl:w-[380px]">
          <p className="flex items-center gap-2.5 text-[13.5px] sm:text-[14px] font-medium text-white/90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round">
              <rect x="3.5" y="5" width="17" height="16" rx="2" />
              <path d="M3.5 10h17M8 3v4M16 3v4" />
            </svg>
            Voting Ends In
          </p>
          <div className="mt-2.5 grid grid-cols-4 gap-2 text-center">
            {units.map((u) => (
              <div key={u.label}>
                <p className="text-[26px] sm:text-[32px] font-bold leading-none tabular-nums text-white">
                  {u.value}
                </p>
                <p className="mt-1.5 text-[11.5px] sm:text-[12.5px] font-light text-white/70">
                  {u.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-5 grid gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.title}
            className="dash-stat rounded-[18px] border border-white/15 bg-[#0d1117]/55 p-4 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          >
            <div className="flex items-start gap-3.5">
              <span className="shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <p className="text-[13px] sm:text-[13.5px] font-normal text-white/85">
                  {s.title}
                </p>
                <p className="mt-1 truncate text-[19px] sm:text-[21px] font-bold text-white">
                  {s.value || "…"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => go(s.target)}
              className="mt-3 inline-block text-[12.5px] sm:text-[13px] font-medium text-white/85 transition hover:text-white"
            >
              {s.link}
            </button>
          </div>
        ))}
      </section>

      <section className="dash-banner mt-3.5 sm:mt-4 flex items-center gap-4 rounded-[18px] border border-white/15 bg-[#0d1117]/55 p-4 sm:px-6 sm:py-5 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <span className="hidden shrink-0 sm:block">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11v3l4 1 2 5h2l-1-5 9 3V6L8 10H3v1Z" />
            <path d="M19 6v12" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] sm:text-[14.5px] font-semibold text-white">
            Latest Announcement
          </p>
          <p className="mt-0.5 truncate text-[12.5px] sm:text-[13.5px] font-light text-white/80">
            {latest ? latest.title + ". " + latest.body : "Loading announcements…"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => go("Announcements")}
          className="shrink-0 text-[12.5px] sm:text-[13.5px] font-medium text-white/85 transition hover:text-white"
        >
          View All →
        </button>
      </section>
    </>
  );
}

function MyVoteSection({
  positions,
  voted,
  onVoted,
}: {
  positions: BallotPosition[];
  voted: boolean;
  onVoted: () => void;
}) {
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [myPicks, setMyPicks] = useState<{ positionName: string; candidateName: string }[] | null>(null);

  useEffect(() => {
    if (!voted) return;
    fetch("/api/vote")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setMyPicks(d.picks);
      })
      .catch(() => {});
  }, [voted]);

  const complete = positions.length > 0 && positions.every((p) => picks[p.id]);

  if (voted) {
    return (
      <div className="flex flex-col gap-5">
        <SectionHead
          eyebrow="MY VOTE"
          title="Vote Submitted"
          sub="Thank you for participating in the student elections."
        />
        <Card className="mx-auto flex w-full max-w-[560px] flex-col items-center px-6 py-10 text-center">
          <Image
            src="/tcc-logo.png"
            alt="Torres Capitol College logo"
            width={160}
            height={171}
            className="h-[72px] w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          />
          <p className="mt-4 flex items-center gap-2 text-[18px] font-bold text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m4.5 12.5 5 5L19.5 7" />
            </svg>
            Ballot cast successfully!
          </p>
          <div className="mt-4 w-full space-y-2 text-left">
            {(myPicks ?? []).map((p) => (
              <div key={p.positionName} className="flex items-center justify-between gap-3 rounded-[10px] border border-white/12 bg-white/[0.04] px-4 py-2.5">
                <span className="text-[12.5px] font-medium text-white/70">{p.positionName}</span>
                <span className="truncate text-[13.5px] font-semibold text-white">{p.candidateName}</span>
              </div>
            ))}
            {myPicks !== null && myPicks.length === 0 && (
              <p className="text-center text-[13px] font-light text-white/60">
                Your ballot is recorded.
              </p>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        eyebrow="MY VOTE"
        title="Official Ballot"
        sub="Select one candidate per position, review your choices, then submit. Your vote is final."
      />
      {positions.length === 0 ? (
        <Card className="p-6 text-center text-[14px] font-light text-white/70">
          Loading ballot…
        </Card>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!complete || submitting) return;
            setSubmitting(true);
            setError("");
            try {
              const res = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  picks: positions.map((p) => ({
                    positionId: p.id,
                    candidateId: picks[p.id],
                  })),
                }),
              });
              const data = await res.json();
              if (!res.ok) {
                setError(data.error ?? "Could not submit your ballot.");
                return;
              }
              onVoted();
            } catch {
              setError("Could not submit your ballot. Check your connection.");
            } finally {
              setSubmitting(false);
            }
          }}
          className="flex flex-col gap-4"
        >
          {positions.map((position) => (
            <Card key={position.id} className="p-4 sm:p-5">
              <p className="text-[14px] sm:text-[15px] font-bold tracking-wide text-white">
                {position.name}
                <span className="ml-2 text-[12px] font-light text-white/55">
                  {(() => {
                    const c = position.candidates.find((x) => x.id === picks[position.id]);
                    return c ? "— " + c.name : "— select one";
                  })()}
                </span>
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {position.candidates.map((c) => {
                  const selected = picks[position.id] === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPicks((prev) => ({ ...prev, [position.id]: c.id }))}
                      className={`flex items-center gap-3.5 rounded-[12px] border px-4 py-3 text-left transition ${
                        selected
                          ? "border-white/60 bg-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                          : "border-white/12 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition ${
                          selected ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {selected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m4 12.5 5 5L20 6.5" />
                          </svg>
                        )}
                      </span>
                      <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-white/12 text-[13px] font-bold text-white">
                        {initials(c.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold text-white">{c.name}</span>
                        <span className="block truncate text-[12px] font-light text-white/60">{c.course}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
          {error && (
            <p className="rounded-[10px] border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-[13px] font-medium text-red-200">
              {error}
            </p>
          )}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] font-light text-white/65">
              {Object.keys(picks).length} of {positions.length} positions selected
            </p>
            <button
              type="submit"
              disabled={!complete || submitting}
              className={`inline-flex items-center justify-center gap-3 rounded-[12px] px-10 py-3.5 text-[15px] font-bold transition ${
                complete && !submitting
                  ? "bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:bg-white/90"
                  : "cursor-not-allowed bg-white/20 text-white/50"
              }`}
            >
              {submitting ? "Submitting…" : "Submit Ballot"}
              {!submitting && <span className="text-[18px] leading-none">→</span>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function CandidatesSection({ positions }: { positions: BallotPosition[] }) {
  const [filter, setFilter] = useState<string>("All");
  const names = positions.map((p) => p.name);
  const list = positions.flatMap((p) =>
    (filter === "All" || p.name === filter
      ? p.candidates.map((c) => ({ ...c, position: p.name }))
      : [])
  );
  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        eyebrow="CANDIDATES"
        title="Meet the Candidates"
        sub="Review every candidate's platform before you vote."
      />
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["All", ...names].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFilter(p)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[13px] backdrop-blur-md transition ${
              filter === p
                ? "border-white/50 bg-white/15 font-semibold text-white"
                : "border-white/20 bg-black/40 text-white/75 hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      {positions.length === 0 ? (
        <Card className="p-6 text-center text-[14px] font-light text-white/70">
          Loading candidates…
        </Card>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {list.map((c) => (
            <Card key={c.id} className="flex items-start gap-3.5 p-4 sm:p-5">
              <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-white/12 text-[15px] font-bold text-white">
                {initials(c.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-white">{c.name}</p>
                <p className="mt-0.5 inline-block rounded-full border border-white/25 bg-white/[0.06] px-2.5 py-0.5 text-[11.5px] font-medium text-white/85">
                  {c.position}
                </p>
                <p className="mt-1.5 text-[12px] font-light leading-[1.5] text-white/60">{c.course}</p>
                <p className="mt-1 text-[13px] font-light italic leading-[1.5] text-white/80">
                  “{c.tagline}”
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ElectionDetailsSection() {
  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        eyebrow="ELECTION DETAILS"
        title="Election Schedule"
        sub="Everything you need to know about the 2026 student elections."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4 sm:p-6">
          <p className="text-[15px] font-bold text-white">Timeline</p>
          <div className="mt-4 flex flex-col gap-0">
            {TIMELINE.map((t, i) => (
              <div key={t.event} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={`mt-1 h-[12px] w-[12px] shrink-0 rounded-full border-2 ${t.done ? "border-white bg-white" : "border-white/50 bg-transparent"}`} />
                  {i < TIMELINE.length - 1 && <span className="w-px flex-1 bg-white/20" />}
                </div>
                <div className="pb-5">
                  <p className="text-[12px] font-medium tracking-wider text-white/60">{t.date}</p>
                  <p className="mt-0.5 text-[14px] font-semibold text-white">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex flex-col gap-4">
          <Card className="p-4 sm:p-6">
            <p className="text-[15px] font-bold text-white">Who Can Vote</p>
            <ul className="mt-3 flex flex-col gap-2.5 text-[13.5px] font-light leading-[1.55] text-white/80">
              <li className="flex gap-2.5"><span className="text-white">—</span>Officially enrolled students for the current semester.</li>
              <li className="flex gap-2.5"><span className="text-white">—</span>One (1) vote per student, cast from your own account.</li>
              <li className="flex gap-2.5"><span className="text-white">—</span>Sharing accounts or voting twice is strictly prohibited.</li>
            </ul>
          </Card>
          <Card className="p-4 sm:p-6">
            <p className="text-[15px] font-bold text-white">How to Vote</p>
            <ol className="mt-3 flex flex-col gap-2.5 text-[13.5px] font-light leading-[1.55] text-white/80">
              <li className="flex gap-2.5"><span className="font-bold text-white">1.</span>Open My Vote to load your official ballot.</li>
              <li className="flex gap-2.5"><span className="font-bold text-white">2.</span>Select one candidate per position.</li>
              <li className="flex gap-2.5"><span className="font-bold text-white">3.</span>Review your choices and press Submit Ballot.</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AnnouncementsSection({ items }: { items: AnnouncementItem[] }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        eyebrow="ANNOUNCEMENTS"
        title="Announcements"
        sub="Official updates from the election committee."
      />
      {items.length === 0 ? (
        <Card className="p-6 text-center text-[14px] font-light text-white/70">
          Loading announcements…
        </Card>
      ) : (
        <div className="flex flex-col gap-3.5">
          {items.map((a) => (
            <Card key={a.id} className="flex items-start gap-4 p-4 sm:p-5">
              <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] border border-white/20 bg-white/[0.05] text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11v3l4 1 2 5h2l-1-5 9 3V6L8 10H3v1Z" />
                  <path d="M19 6v12" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-[14.5px] sm:text-[15.5px] font-bold text-white">{a.title}</p>
                  {a.latest && (
                    <span className="rounded-full border border-white/40 bg-white/10 px-2.5 py-0.5 text-[10.5px] font-semibold tracking-wider text-white">
                      LATEST
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[12px] font-light tracking-wide text-white/55">{a.date}</p>
                <p className="mt-1.5 text-[13.5px] font-light leading-[1.6] text-white/80">{a.body}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultsSection({ electionEnd }: { electionEnd: number }) {
  const locked = Date.now() < electionEnd;
  const [results, setResults] = useState<ResultPosition[] | null>(null);

  useEffect(() => {
    if (locked) return;
    fetch("/api/results")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && !d.locked) setResults(d.positions);
      })
      .catch(() => {});
  }, [locked]);

  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        eyebrow="RESULTS"
        title="Election Results"
        sub="Official results are published after voting ends and votes are tabulated."
      />
      {locked ? (
        <>
          <Card className="mx-auto flex w-full max-w-[560px] flex-col items-center px-6 py-10 text-center">
            <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-white/30 bg-white/[0.06]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15" r="1.2" fill="white" stroke="none" />
              </svg>
            </span>
            <p className="mt-4 text-[18px] font-bold text-white">Results are locked</p>
            <p className="mt-1.5 max-w-[400px] text-[13.5px] font-light leading-[1.6] text-white/70">
              Results will be available after voting closes on October 7, 2026 at 5:00 PM
              and tabulation is completed on October 8.
            </p>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {["President", "Vice President", "Secretary", "Treasurer", "Auditor", "P.I.O."].map((p) => (
              <Card key={p} className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="text-[14px] font-semibold text-white">{p}</span>
                <span className="rounded-full border border-white/25 bg-white/[0.05] px-3 py-1 text-[11.5px] font-medium tracking-wide text-white/65">
                  COUNTING PENDING
                </span>
              </Card>
            ))}
          </div>
        </>
      ) : results === null ? (
        <Card className="p-6 text-center text-[14px] font-light text-white/70">
          Loading results…
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {results.map((p) => (
            <Card key={p.id} className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-bold text-white">{p.name}</p>
                <p className="text-[12px] font-light text-white/60">{p.total} votes</p>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {p.candidates.map((c) => {
                  const pct = p.total > 0 ? Math.round((c.votes / p.total) * 100) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex items-center justify-between gap-3 text-[13px]">
                        <span className="truncate font-semibold text-white">
                          {c.name}
                          <span className="ml-2 font-light text-white/55">{c.course}</span>
                          {c.winner && (
                            <span className="ml-2 rounded-full border border-white/40 bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold tracking-wider">
                              WINNER
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 tabular-nums text-white/80">
                          {c.votes} ({pct}%)
                        </span>
                      </div>
                      <div className="mt-1.5 h-[8px] overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function HelpSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        eyebrow="HELP & SUPPORT"
        title="How Can We Help?"
        sub="Frequently asked questions about voting. Still stuck? Reach out to us."
      />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-2.5">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Card key={f.q} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-[14px] sm:text-[14.5px] font-semibold text-white">{f.q}</span>
                  <span className={`shrink-0 text-white/70 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-[13.5px] font-light leading-[1.6] text-white/75">
                    {f.a}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
        <Card className="flex h-fit flex-col items-start gap-3 p-5 sm:p-6">
          <p className="text-[15px] font-bold text-white">Contact the Election Committee</p>
          <p className="text-[13.5px] font-light leading-[1.6] text-white/75">
            For account issues, voting problems, or other concerns, send us a message
            and our team will get back to you as soon as possible.
          </p>
          <div className="flex flex-col gap-1.5 text-[13px] font-light text-white/75">
            <span>info@torrescapitolcollege.edu.ph</span>
            <span>+63 32 123 4567 · Mon – Fri, 8 AM – 5 PM</span>
          </div>
          <Link
            href="/contact"
            className="mt-1 inline-flex items-center gap-3 rounded-[10px] bg-white px-7 py-2.5 text-[14px] font-bold text-black transition hover:bg-white/90"
          >
            Contact Us
            <span className="text-[16px] leading-none">→</span>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const root = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<Section>(sectionFromHash);
  const [electionStart, setElectionStart] = useState(new Date("2026-10-01T08:00:00").getTime());
  const [electionEnd, setElectionEnd] = useState(ELECTION_END);
  const count = useCountdown(electionEnd);
  const [me, setMe] = useState<Me | null>(null);
  const [positions, setPositions] = useState<BallotPosition[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loadError, setLoadError] = useState("");

  const refreshMe = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        if (res.status === 401) window.location.href = "/login";
        return;
      }
      const data = await res.json();
      setMe(data.student);
    } catch {
      setLoadError("Could not reach the server. Check your connection and reload.");
    }
  };

  useEffect(() => {
    refreshMe().catch(() => {});
    fetch("/api/candidates")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setPositions(d.positions);
      })
      .catch(() => setLoadError("Could not load election data. Please reload."));
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setAnnouncements(d.announcements);
      })
      .catch(() => {});
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) {
          setElectionStart(d.votingStart);
          setElectionEnd(d.votingEnd);
        }
      })
      .catch(() => {});
  }, []);

  const go = (s: Section) => {
    setSection(s);
    window.location.hash = slugify(s);
    window.scrollTo({ top: 0 });
  };

  useLayoutEffect(() => {
    // Dashboard is allowed to scroll — override the global locked body.
    document.body.style.overflow = "auto";
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
      false;
    if (reduceMotion) return () => {
      document.body.style.overflow = "";
    };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", clearProps: "opacity,transform" },
      });
      tl.fromTo(
        ".dash-bg",
        { scale: 1.1 },
        { scale: 1, duration: 2, ease: "power2.out", clearProps: "scale" },
        0
      );
      tl.from(".dash-side", { x: -40, opacity: 0, duration: 0.8 }, 0.1);
      tl.from(".dash-eyebrow", { y: 16, opacity: 0, duration: 0.6 }, 0.25);
      tl.from(
        ".dash-title",
        { y: 50, opacity: 0, duration: 0.9, stagger: 0.1 },
        0.3
      );
      tl.from(".dash-sub", { y: 18, opacity: 0, duration: 0.6 }, 0.55);
      tl.from(".dash-count", { y: -18, opacity: 0, duration: 0.7 }, 0.4);
      tl.from(
        ".dash-stat",
        { y: 34, opacity: 0, duration: 0.7, stagger: 0.1 },
        0.6
      );
      tl.from(".dash-banner", { y: 28, opacity: 0, duration: 0.7 }, 0.9);
    }, root);
    const safety = window.setTimeout(() => {
      root.current
        ?.querySelectorAll(
          ".dash-side,.dash-eyebrow,.dash-title,.dash-sub,.dash-count,.dash-stat,.dash-banner"
        )
        .forEach((el) => {
          (el as HTMLElement).style.opacity = "";
          (el as HTMLElement).style.transform = "";
        });
    }, 3500);
    return () => {
      window.clearTimeout(safety);
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  const displayName = me ? `${me.firstname} ${me.lastname}` : "…";
  const candidateCount = positions.reduce((n, p) => n + p.candidates.length, 0);

  return (
    <div ref={root} className="relative min-h-[100dvh] w-full bg-black font-sans text-white">
      {/* BACKGROUND — constant large-viewport height + pinned GPU layer */}
      <div className="fixed inset-x-0 top-0 h-lvh w-full overflow-hidden backface-hidden transform-gpu">
        <Image
          src="/dashboard-bg.png"
          alt="Students voting at Torres Capitol College"
          fill
          priority
          style={{ objectPosition: "50% 35%" }}
          className="dash-bg object-cover [filter:saturate(1.02)_contrast(1.03)]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/85 via-[#060606]/35 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] w-full">
        <Sidebar
          active={section}
          onSelect={go}
          name={displayName}
          role={me ? (me.isAdmin ? "Admin" : "Student") : "…"}
        />

        {/* MAIN */}
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:ml-[248px] lg:px-8 xl:ml-[264px] xl:px-10">
          {/* Mobile top bar */}
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/tcc-logo.png"
                alt="Torres Capitol College logo"
                width={96}
                height={103}
                className="h-[40px] w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              />
              <div className="font-display text-[12px] leading-[1.2] tracking-[0.06em] text-white">
                TORRES
                <br />
                CAPITOL
                <br />
                COLLEGE
              </div>
            </Link>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              className="rounded-[10px] border border-white/25 bg-black/40 p-2.5 text-white/80 backdrop-blur-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          </div>

          {/* Mobile nav pills */}
          <nav className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.label)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] backdrop-blur-md ${
                  section === item.label
                    ? "border-white/50 bg-white/15 font-semibold text-white"
                    : "border-white/20 bg-black/40 text-white/75"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {loadError ? (
            <Card className="mx-auto mt-10 max-w-[520px] p-6 text-center">
              <p className="text-[15px] font-bold text-white">Something went wrong</p>
              <p className="mt-1.5 text-[13.5px] font-light text-white/70">{loadError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-[10px] bg-white px-8 py-2.5 text-[14px] font-bold text-black transition hover:bg-white/90"
              >
                Reload
              </button>
            </Card>
          ) : (
            <div key={section} className="dash-panel">
              {section === "Dashboard" && (
                <DashboardHome
                  go={go}
                  count={count}
                  name={displayName}
                  hasVoted={me?.hasVoted ?? false}
                  candidateCount={candidateCount}
                  announcements={announcements}
                  electionStart={electionStart}
                  electionEnd={electionEnd}
                />
              )}
              {section === "My Vote" && (
                <MyVoteSection
                  positions={positions}
                  voted={me?.hasVoted ?? false}
                  onVoted={refreshMe}
                />
              )}
              {section === "Candidates" && <CandidatesSection positions={positions} />}
              {section === "Election Details" && <ElectionDetailsSection />}
              {section === "Announcements" && <AnnouncementsSection items={announcements} />}
              {section === "Results" && <ResultsSection electionEnd={electionEnd} />}
              {section === "Help & Support" && <HelpSection />}
            </div>
          )}

          <div className="h-6" />
        </main>
      </div>
    </div>
  );
}
