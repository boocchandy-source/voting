"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

type AdminSection =
  | "Overview"
  | "Accounts"
  | "Candidates"
  | "Announcements"
  | "Election"
  | "Winners"
  | "Profile";

type StudentRow = {
  id: number;
  studentId: string;
  lastname: string;
  firstname: string;
  hasVoted: boolean;
  isAdmin: boolean;
  status: string;
  createdAt: string;
};

type Candidate = { id: number; name: string; course: string; tagline: string };
type BallotPosition = { id: number; name: string; candidates: Candidate[] };
type AnnouncementItem = {
  id: number;
  title: string;
  body: string;
  date: string;
  latest: boolean;
};

const NAV: { label: AdminSection; icon: React.ReactNode }[] = [
  {
    label: "Overview",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 9-8 9 8" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M10 21v-6h4v6" />
      </svg>
    ),
  },
  {
    label: "Accounts",
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
    label: "Candidates",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="m8.5 12.5 2.5 2.5 5-5.5" />
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
    label: "Election",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    label: "Winners",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4a1 1 0 0 0-1 1c0 2.5 2 4 4 4M17 6h3a1 1 0 0 1 1 1c0 2.5-2 4-4 4" />
      </svg>
    ),
  },
  {
    label: "Profile",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.6-2.4 2-2.4 3.3" />
        <circle cx="12" cy="16.8" r="0.4" fill="currentColor" />
      </svg>
    ),
  },
];

function slugify(s: AdminSection) {
  return s.toLowerCase().replace(/[^a-z]+/g, "-");
}

function sectionFromHash(): AdminSection {
  if (typeof window === "undefined") return "Overview";
  const h = window.location.hash.replace("#", "");
  return NAV.find((n) => slugify(n.label) === h)?.label ?? "Overview";
}

function toInputValue(ms: number | null) {
  if (!ms) return "";
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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

function Head({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-white/90">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "h-[42px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] px-4 text-[13.5px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]";

function Notice({ kind, text }: { kind: "ok" | "err"; text: string }) {
  if (!text) return null;
  return (
    <p
      className={`rounded-[10px] border px-4 py-2.5 text-[13px] font-medium ${
        kind === "ok"
          ? "border-white/30 bg-white/10 text-white"
          : "border-red-400/40 bg-red-500/10 text-red-200"
      }`}
    >
      {text}
    </p>
  );
}

export default function AdminPage() {
  const root = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<AdminSection>(sectionFromHash);
  const [me, setMe] = useState<{ firstname: string; lastname: string } | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [positions, setPositions] = useState<BallotPosition[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [settings, setSettings] = useState<{ votingStart: number | null; votingEnd: number | null }>({ votingStart: null, votingEnd: null });
  const [winners, setWinners] = useState<Record<number, number | "">>({});
  const [loadError, setLoadError] = useState("");
  const [accountTab, setAccountTab] = useState<"pending" | "all">("pending");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string }>({ kind: "ok", text: "" });

  // forms
  const [newAdmin, setNewAdmin] = useState({ firstname: "", lastname: "", studentId: "", password: "", isAdmin: true });
  const [newCand, setNewCand] = useState({ name: "", positionId: "", course: "", tagline: "" });
  const [newAnn, setNewAnn] = useState({ title: "", body: "", isLatest: false });
  const [editAnn, setEditAnn] = useState<{ id: number; title: string; body: string; isLatest: boolean } | null>(null);
  const [winStart, setWinStart] = useState("");
  const [winEnd, setWinEnd] = useState("");
  const [profile, setProfile] = useState({ firstname: "", lastname: "", studentId: "", currentPassword: "", newPassword: "" });
  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const refresh = async () => {
    try {
      const [meR, stR, caR, anR, seR, wiR, prR] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/students?status=all"),
        fetch("/api/candidates"),
        fetch("/api/announcements"),
        fetch("/api/admin/settings"),
        fetch("/api/admin/winners"),
        fetch("/api/admin/profile"),
      ]);
      if (meR.status === 401) {
        window.location.href = "/login";
        return;
      }
      const meD = await meR.json();
      setMe({ firstname: meD.student.firstname, lastname: meD.student.lastname });
      const stD = await stR.json();
      if (stD.ok) setStudents(stD.students);
      const caD = await caR.json();
      if (caD.ok) setPositions(caD.positions);
      const anD = await anR.json();
      if (anD.ok) setAnnouncements(anD.announcements);
      const seD = await seR.json();
      if (seD.ok) {
        setSettings({ votingStart: seD.votingStart, votingEnd: seD.votingEnd });
        setWinStart(toInputValue(seD.votingStart));
        setWinEnd(toInputValue(seD.votingEnd));
      }
      const wiD = await wiR.json();
      if (wiD.ok) {
        const map: Record<number, number | ""> = {};
        for (const w of wiD.winners) map[w.positionId] = w.candidateId;
        setWinners(map);
      }
      const prD = await prR.json();
      if (prD.ok && prD.profile) {
        setProfile((p) => ({
          ...p,
          firstname: prD.profile.firstname,
          lastname: prD.profile.lastname,
          studentId: prD.profile.studentId,
        }));
      }
    } catch {
      setLoadError("Could not reach the server. Check your connection and reload.");
    }
  };

  useEffect(() => {
    refresh().catch(() => setLoadError("Could not load admin data. Please reload."));
  }, []);

  const go = (s: AdminSection) => {
    setSection(s);
    setMsg({ kind: "ok", text: "" });
    window.location.hash = slugify(s);
    window.scrollTo({ top: 0 });
  };

  useLayoutEffect(() => {
    document.body.style.overflow = "auto";
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduceMotion) return () => {
      document.body.style.overflow = "";
    };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", clearProps: "opacity,transform" },
      });
      tl.fromTo(
        ".admin-bg",
        { scale: 1.1 },
        { scale: 1, duration: 2, ease: "power2.out", clearProps: "scale" },
        0
      );
      tl.from(".admin-side", { x: -40, opacity: 0, duration: 0.8 }, 0.1);
      tl.from(".admin-panel", { y: 24, opacity: 0, duration: 0.7 }, 0.3);
    }, root);
    const safety = window.setTimeout(() => {
      root.current
        ?.querySelectorAll(".admin-side,.admin-panel,.admin-bg")
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

  const flash = async (
    fn: () => Promise<Response>,
    okText: string
  ) => {
    setMsg({ kind: "ok", text: "" });
    try {
      const res = await fn();
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMsg({ kind: "err", text: data?.error ?? "Request failed." });
        return;
      }
      setMsg({ kind: "ok", text: okText });
      await refresh();
    } catch {
      setMsg({ kind: "err", text: "Could not reach the server." });
    }
  };

  const pending = students.filter((s) => s.status === "pending");
  const shownStudents = accountTab === "pending" ? pending : students;

  const displayName = me ? `${me.firstname} ${me.lastname}` : "…";
  const candidateCount = positions.reduce((n, p) => n + p.candidates.length, 0);

  return (
    <div ref={root} className="relative min-h-[100dvh] w-full bg-black font-sans text-white">
      <div className="fixed inset-x-0 top-0 h-lvh w-full overflow-hidden backface-hidden transform-gpu">
        <Image
          src="/dashboard-bg.png"
          alt="Students voting at Torres Capitol College"
          fill
          priority
          style={{ objectPosition: "50% 35%" }}
          className="admin-bg object-cover [filter:saturate(1.02)_contrast(1.03)]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/85 via-[#060606]/35 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] w-full">
        <aside className="admin-side fixed left-0 top-0 hidden h-screen w-[248px] xl:w-[264px] shrink-0 flex-col border-r border-white/10 bg-[#0d1117] px-5 py-6 lg:flex">
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
          <p className="mt-2 px-1 text-[10.5px] font-bold tracking-[0.3em] text-white/50">
            ADMIN PANEL
          </p>

          <nav className="mt-6 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.label)}
                className={`flex shrink-0 items-center gap-3.5 rounded-[12px] border px-4 py-3 text-left text-[14.5px] transition ${
                  section === item.label
                    ? "border-white/50 bg-white/10 font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                    : "border-transparent font-normal text-white/75 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
                {item.label === "Accounts" && pending.length > 0 && (
                  <span className="ml-auto flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-black">
                    {pending.length}
                  </span>
                )}
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
                <p className="truncate text-[14px] font-semibold text-white">{displayName}</p>
                <p className="text-[12px] font-light text-white/60">Admin</p>
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

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:ml-[248px] lg:px-8 xl:ml-[264px] xl:px-10">
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

          <nav className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            {NAV.map((item) => (
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
                {item.label === "Accounts" && pending.length > 0 && (
                  <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10.5px] font-bold text-black">
                    {pending.length}
                  </span>
                )}
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
            <div key={section} className="admin-panel flex flex-col gap-5">
              <Notice kind={msg.kind} text={msg.text} />

              {section === "Overview" && (
                <>
                  <Head eyebrow="ADMIN PANEL" title="Overview" sub={`Welcome back, ${displayName}. Everything is under your control here.`} />
                  <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                    {[
                      { t: "Total Accounts", v: String(students.length), go: "Accounts" as AdminSection },
                      { t: "Pending Approvals", v: String(pending.length), go: "Accounts" as AdminSection },
                      { t: "Total Candidates", v: String(candidateCount), go: "Candidates" as AdminSection },
                      { t: "Announcements", v: String(announcements.length), go: "Announcements" as AdminSection },
                    ].map((s) => (
                      <Card key={s.t} className="p-4 sm:p-5">
                        <p className="text-[13px] font-normal text-white/85">{s.t}</p>
                        <p className="mt-1 text-[26px] sm:text-[30px] font-bold text-white">{s.v}</p>
                        <button
                          type="button"
                          onClick={() => go(s.go)}
                          className="mt-2 inline-block text-[12.5px] font-medium text-white/85 transition hover:text-white"
                        >
                          Manage →
                        </button>
                      </Card>
                    ))}
                  </div>
                  <Card className="p-4 sm:p-6">
                    <p className="text-[15px] font-bold text-white">Election Window</p>
                    <p className="mt-1 text-[13.5px] font-light text-white/75">
                      {settings.votingStart && settings.votingEnd
                        ? `${new Date(settings.votingStart).toLocaleString()} → ${new Date(settings.votingEnd).toLocaleString()}`
                        : "Not set — default Oct 1 – Oct 7, 2026 applies."}
                    </p>
                    <button
                      type="button"
                      onClick={() => go("Election")}
                      className="mt-3 inline-block rounded-[10px] bg-white px-6 py-2.5 text-[13.5px] font-bold text-black transition hover:bg-white/90"
                    >
                      Change Schedule
                    </button>
                  </Card>
                </>
              )}

              {section === "Accounts" && (
                <>
                  <Head eyebrow="ADMIN PANEL" title="Accounts" sub="Accept or reject new registrations. New accounts wait here until you approve them." />
                  <div className="flex gap-2">
                    {(["pending", "all"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAccountTab(t)}
                        className={`shrink-0 rounded-full border px-4 py-2 text-[13px] backdrop-blur-md transition ${
                          accountTab === t
                            ? "border-white/50 bg-white/15 font-semibold text-white"
                            : "border-white/20 bg-black/40 text-white/75 hover:text-white"
                        }`}
                      >
                        {t === "pending" ? `Pending (${pending.length})` : `All (${students.length})`}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {shownStudents.length === 0 && (
                      <Card className="p-6 text-center text-[14px] font-light text-white/70">
                        {accountTab === "pending" ? "No accounts waiting for approval." : "No accounts yet."}
                      </Card>
                    )}
                    {shownStudents.map((s) => (
                      <Card key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14.5px] font-bold text-white">
                            {s.firstname} {s.lastname}
                            {s.isAdmin && (
                              <span className="ml-2 rounded-full border border-white/40 bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold tracking-wider">
                                ADMIN
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 text-[12.5px] font-light text-white/60">
                            ID {s.studentId} · {s.status}
                            {s.hasVoted ? " · voted" : ""}
                          </p>
                        </div>
                        {s.status === "pending" ? (
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                flash(
                                  () =>
                                    fetch("/api/admin/students", {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ id: s.id, action: "approve" }),
                                    }),
                                  `Approved ${s.firstname} ${s.lastname}.`
                                )
                              }
                              className="rounded-[10px] bg-white px-5 py-2 text-[13px] font-bold text-black transition hover:bg-white/90"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                flash(
                                  () =>
                                    fetch("/api/admin/students", {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ id: s.id, action: "reject" }),
                                    }),
                                  `Rejected ${s.firstname} ${s.lastname}.`
                                )
                              }
                              className="rounded-[10px] border border-red-400/50 px-5 py-2 text-[13px] font-semibold text-red-200 transition hover:bg-red-500/10"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-medium tracking-wide ${
                              s.status === "approved"
                                ? "border-white/30 bg-white/[0.07] text-white/80"
                                : "border-red-400/40 bg-red-500/10 text-red-200"
                            }`}
                          >
                            {s.status.toUpperCase()}
                          </span>
                        )}
                      </Card>
                    ))}
                  </div>
                  <Card className="p-4 sm:p-6">
                    <p className="text-[15px] font-bold text-white">Create Admin / Account</p>
                    <p className="mt-1 text-[12.5px] font-light text-white/60">
                      Accounts created here are approved immediately.
                    </p>
                    <form
                      className="mt-3 grid gap-2.5 sm:grid-cols-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        flash(
                          () =>
                            fetch("/api/admin/students", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                firstname: String(fd.get("firstname") ?? ""),
                                lastname: String(fd.get("lastname") ?? ""),
                                studentId: String(fd.get("studentId") ?? ""),
                                password: String(fd.get("password") ?? ""),
                                isAdmin: newAdmin.isAdmin,
                              }),
                            }),
                          "Account created."
                        ).then(() =>
                          setNewAdmin({ firstname: "", lastname: "", studentId: "", password: "", isAdmin: true })
                        );
                      }}
                    >
                      <input value={newAdmin.firstname} onChange={(e) => setNewAdmin({ ...newAdmin, firstname: e.target.value })} name="firstname" placeholder="Firstname" required className={inputCls} />
                      <input value={newAdmin.lastname} onChange={(e) => setNewAdmin({ ...newAdmin, lastname: e.target.value })} name="lastname" placeholder="Lastname" required className={inputCls} />
                      <input value={newAdmin.studentId} onChange={(e) => setNewAdmin({ ...newAdmin, studentId: e.target.value })} name="studentId" placeholder="Student ID" required className={inputCls} />
                      <input value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} name="password" type="password" placeholder="Password (min 8)" required className={inputCls} />
                      <label className="flex items-center gap-2 text-[13px] text-white/80">
                        <input
                          type="checkbox"
                          checked={newAdmin.isAdmin}
                          onChange={(e) => setNewAdmin({ ...newAdmin, isAdmin: e.target.checked })}
                          className="h-[18px] w-[18px] accent-white"
                        />
                        Admin account
                      </label>
                      <button type="submit" className="rounded-[10px] bg-white px-6 py-2.5 text-[13.5px] font-bold text-black transition hover:bg-white/90 sm:justify-self-start">
                        Create Account
                      </button>
                    </form>
                  </Card>
                </>
              )}

              {section === "Candidates" && (
                <>
                  <Head eyebrow="ADMIN PANEL" title="Candidates" sub="Add new candidates. Removal is blocked once a candidate has votes." />
                  <Card className="p-4 sm:p-6">
                    <p className="text-[15px] font-bold text-white">Add Candidate</p>
                    <form
                      className="mt-3 grid gap-2.5 sm:grid-cols-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        flash(
                          () =>
                            fetch("/api/admin/candidates", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: newCand.name,
                                positionId: Number(newCand.positionId),
                                course: newCand.course,
                                tagline: newCand.tagline,
                              }),
                            }),
                          `Added ${newCand.name}.`
                        ).then(() => setNewCand({ name: "", positionId: "", course: "", tagline: "" }));
                      }}
                    >
                      <input value={newCand.name} onChange={(e) => setNewCand({ ...newCand, name: e.target.value })} placeholder="Full name" required className={inputCls} />
                      <select
                        value={newCand.positionId}
                        onChange={(e) => setNewCand({ ...newCand, positionId: e.target.value })}
                        required
                        className={`${inputCls} [&>option]:bg-[#0d1117] [&:invalid]:text-white/45`}
                      >
                        <option value="" disabled>Position</option>
                        {positions.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <input value={newCand.course} onChange={(e) => setNewCand({ ...newCand, course: e.target.value })} placeholder="Course (e.g. BSIT 3rd year)" required className={inputCls} />
                      <input value={newCand.tagline} onChange={(e) => setNewCand({ ...newCand, tagline: e.target.value })} placeholder="Tagline / platform" className={inputCls} />
                      <button type="submit" className="rounded-[10px] bg-white px-6 py-2.5 text-[13.5px] font-bold text-black transition hover:bg-white/90 sm:justify-self-start">
                        Add Candidate
                      </button>
                    </form>
                  </Card>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {positions.flatMap((p) =>
                      p.candidates.map((c) => (
                        <Card key={c.id} className="flex items-start gap-3 p-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14.5px] font-bold text-white">{c.name}</p>
                            <p className="mt-0.5 text-[12px] font-light text-white/60">
                              {p.name} · {c.course}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              flash(
                                () => fetch(`/api/admin/candidates?id=${c.id}`, { method: "DELETE" }),
                                `Removed ${c.name}.`
                              )
                            }
                            className="shrink-0 rounded-[8px] border border-red-400/50 px-3 py-1.5 text-[12px] font-semibold text-red-200 transition hover:bg-red-500/10"
                          >
                            Remove
                          </button>
                        </Card>
                      ))
                    )}
                  </div>
                </>
              )}

              {section === "Announcements" && (
                <>
                  <Head eyebrow="ADMIN PANEL" title="Announcements" sub="Post, edit, or remove announcements shown on the student dashboard." />
                  <Card className="p-4 sm:p-6">
                    <p className="text-[15px] font-bold text-white">New Announcement</p>
                    <form
                      className="mt-3 flex flex-col gap-2.5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        flash(
                          () =>
                            fetch("/api/admin/announcements", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(newAnn),
                            }),
                          "Announcement posted."
                        ).then(() => setNewAnn({ title: "", body: "", isLatest: false }));
                      }}
                    >
                      <input value={newAnn.title} onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })} placeholder="Title" required className={inputCls} />
                      <textarea value={newAnn.body} onChange={(e) => setNewAnn({ ...newAnn, body: e.target.value })} placeholder="Body" required rows={3} className="min-h-[84px] w-full resize-none rounded-[10px] border border-white/20 bg-white/[0.06] px-4 py-3 text-[13.5px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]" />
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-[13px] text-white/80">
                          <input
                            type="checkbox"
                            checked={newAnn.isLatest}
                            onChange={(e) => setNewAnn({ ...newAnn, isLatest: e.target.checked })}
                            className="h-[18px] w-[18px] accent-white"
                          />
                          Mark as latest
                        </label>
                        <button type="submit" className="rounded-[10px] bg-white px-6 py-2.5 text-[13.5px] font-bold text-black transition hover:bg-white/90">
                          Post Announcement
                        </button>
                      </div>
                    </form>
                  </Card>
                  <div className="flex flex-col gap-2.5">
                    {announcements.map((a) => (
                      <Card key={a.id} className="p-4 sm:p-5">
                        {editAnn?.id === a.id ? (
                          <form
                            className="flex flex-col gap-2.5"
                            onSubmit={(e) => {
                              e.preventDefault();
                              flash(
                                () =>
                                  fetch("/api/admin/announcements", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(editAnn),
                                  }),
                                "Announcement updated."
                              ).then(() => setEditAnn(null));
                            }}
                          >
                            <input value={editAnn.title} onChange={(e) => setEditAnn({ ...editAnn, title: e.target.value })} required className={inputCls} />
                            <textarea value={editAnn.body} onChange={(e) => setEditAnn({ ...editAnn, body: e.target.value })} required rows={3} className="min-h-[84px] w-full resize-none rounded-[10px] border border-white/20 bg-white/[0.06] px-4 py-3 text-[13.5px] text-white outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]" />
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-2 text-[13px] text-white/80">
                                <input
                                  type="checkbox"
                                  checked={editAnn.isLatest}
                                  onChange={(e) => setEditAnn({ ...editAnn, isLatest: e.target.checked })}
                                  className="h-[18px] w-[18px] accent-white"
                                />
                                Mark as latest
                              </label>
                              <button type="submit" className="rounded-[10px] bg-white px-6 py-2 text-[13px] font-bold text-black transition hover:bg-white/90">
                                Save
                              </button>
                              <button type="button" onClick={() => setEditAnn(null)} className="rounded-[10px] border border-white/30 px-6 py-2 text-[13px] font-semibold text-white transition hover:bg-white/10">
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-[14.5px] font-bold text-white">
                                {a.title}
                                {a.latest && (
                                  <span className="ml-2 rounded-full border border-white/40 bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold tracking-wider">
                                    LATEST
                                  </span>
                                )}
                              </p>
                              <p className="mt-0.5 text-[12px] font-light text-white/55">{a.date}</p>
                              <p className="mt-1.5 text-[13.5px] font-light leading-[1.6] text-white/80">{a.body}</p>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => setEditAnn({ id: a.id, title: a.title, body: a.body, isLatest: a.latest })}
                                className="rounded-[8px] border border-white/30 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-white/10"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  flash(
                                    () => fetch(`/api/admin/announcements?id=${a.id}`, { method: "DELETE" }),
                                    "Announcement deleted."
                                  )
                                }
                                className="rounded-[8px] border border-red-400/50 px-3 py-1.5 text-[12px] font-semibold text-red-200 transition hover:bg-red-500/10"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {section === "Election" && (
                <>
                  <Head eyebrow="ADMIN PANEL" title="Election Schedule" sub="Set when voting opens and closes. Voting outside this window is rejected." />
                  <Card className="max-w-[560px] p-4 sm:p-6">
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const start = new Date(winStart).getTime();
                        const end = new Date(winEnd).getTime();
                        flash(
                          () =>
                            fetch("/api/admin/settings", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ votingStart: start, votingEnd: end }),
                            }),
                          "Election schedule updated."
                        );
                      }}
                    >
                      <Field label="Voting Starts">
                        <input
                          type="datetime-local"
                          value={winStart}
                          onChange={(e) => setWinStart(e.target.value)}
                          required
                          className={`${inputCls} [color-scheme:dark]`}
                        />
                      </Field>
                      <Field label="Voting Ends">
                        <input
                          type="datetime-local"
                          value={winEnd}
                          onChange={(e) => setWinEnd(e.target.value)}
                          required
                          className={`${inputCls} [color-scheme:dark]`}
                        />
                      </Field>
                      <div className="mt-1 flex flex-wrap gap-2.5">
                        <button type="submit" className="rounded-[10px] bg-white px-6 py-2.5 text-[13.5px] font-bold text-black transition hover:bg-white/90">
                          Save Schedule
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWinStart("");
                            setWinEnd("");
                            flash(
                              () => fetch("/api/admin/settings", { method: "DELETE" }),
                              "Schedule cleared. Default window (Oct 1 – Oct 7, 2026) applies."
                            );
                          }}
                          className="rounded-[10px] border border-white/30 px-6 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-white/10"
                        >
                          Clear
                        </button>
                      </div>
                    </form>
                  </Card>
                </>
              )}

              {section === "Winners" && (
                <>
                  <Head eyebrow="ADMIN PANEL" title="Declare Winners" sub="Pick the winner per position. Declared winners top the results; empty means highest votes win." />
                  <Card className="p-4 sm:p-6">
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        flash(
                          () =>
                            fetch("/api/admin/winners", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                winners: Object.entries(winners)
                                  .filter(([, v]) => v !== "")
                                  .map(([positionId, candidateId]) => ({
                                    positionId: Number(positionId),
                                    candidateId: Number(candidateId),
                                  })),
                              }),
                            }),
                          "Winners saved."
                        );
                      }}
                    >
                      {positions.map((p) => (
                        <Field key={p.id} label={p.name}>
                          <select
                            value={winners[p.id] ?? ""}
                            onChange={(e) =>
                              setWinners((prev) => ({
                                ...prev,
                                [p.id]: e.target.value === "" ? "" : Number(e.target.value),
                              }))
                            }
                            className={`${inputCls} [&>option]:bg-[#0d1117]`}
                          >
                            <option value="">— none (highest votes win) —</option>
                            {p.candidates.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} · {c.course}
                              </option>
                            ))}
                          </select>
                        </Field>
                      ))}
                      <button type="submit" className="mt-1 rounded-[10px] bg-white px-6 py-2.5 text-[13.5px] font-bold text-black transition hover:bg-white/90 sm:self-start">
                        Save Winners
                      </button>
                    </form>
                  </Card>
                </>
              )}

              {section === "Profile" && (
                <>
                  <Head eyebrow="ADMIN PANEL" title="My Profile" sub="Change your name, username, student ID, or password." />
                  <Card className="max-w-[560px] p-4 sm:p-6">
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        flash(
                          () =>
                            fetch("/api/admin/profile", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                firstname: profile.firstname,
                                lastname: profile.lastname,
                                studentId: profile.studentId,
                                currentPassword: profile.currentPassword || undefined,
                                newPassword: profile.newPassword || undefined,
                              }),
                            }),
                          "Profile updated."
                        ).then(() =>
                          setProfile((p) => ({ ...p, currentPassword: "", newPassword: "" }))
                        );
                      }}
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Firstname">
                          <input value={profile.firstname} onChange={(e) => setProfile({ ...profile, firstname: e.target.value })} className={inputCls} />
                        </Field>
                        <Field label="Lastname">
                          <input value={profile.lastname} onChange={(e) => setProfile({ ...profile, lastname: e.target.value })} className={inputCls} />
                        </Field>
                      </div>
                      <Field label="Username / Student ID">
                        <input value={profile.studentId} onChange={(e) => setProfile({ ...profile, studentId: e.target.value })} className={inputCls} />
                      </Field>
                      <Field label="Current Password (only to change password)">
                        <div className="relative">
                          <input value={profile.currentPassword} onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} type={showCurPw ? "text" : "password"} autoComplete="current-password" placeholder="••••••" className={`${inputCls} pr-12`} />
                          <button
                            type="button"
                            onClick={() => setShowCurPw(!showCurPw)}
                            aria-label={showCurPw ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                          >
                            {showCurPw ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path d="M3 3l18 18" strokeLinecap="round" />
                                <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c5 0 9 4.5 10 7-.4 1-1.3 2.4-2.7 3.7M6.6 6.6C4 8.2 2.5 10.6 2 12c1 2.5 5 7 10 7 1.5 0 2.9-.4 4.1-1" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </Field>
                      <Field label="New Password (min 8)">
                        <div className="relative">
                          <input value={profile.newPassword} onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })} type={showNewPw ? "text" : "password"} autoComplete="new-password" placeholder="Leave empty to keep current" className={`${inputCls} pr-12`} />
                          <button
                            type="button"
                            onClick={() => setShowNewPw(!showNewPw)}
                            aria-label={showNewPw ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                          >
                            {showNewPw ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path d="M3 3l18 18" strokeLinecap="round" />
                                <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c5 0 9 4.5 10 7-.4 1-1.3 2.4-2.7 3.7M6.6 6.6C4 8.2 2.5 10.6 2 12c1 2.5 5 7 10 7 1.5 0 2.9-.4 4.1-1" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </Field>
                      <button type="submit" className="mt-1 rounded-[10px] bg-white px-6 py-2.5 text-[13.5px] font-bold text-black transition hover:bg-white/90 sm:self-start">
                        Save Changes
                      </button>
                    </form>
                  </Card>
                </>
              )}
            </div>
          )}

          <div className="h-6" />
        </main>
      </div>
    </div>
  );
}
