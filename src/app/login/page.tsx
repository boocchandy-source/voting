"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CardLogo() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <Image
        src="/tcc-logo.png"
        alt="Torres Capitol College logo"
        width={160}
        height={171}
        priority
        className="h-[44px] w-auto object-contain brightness-[1.25] contrast-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
      />
      <div className="font-display text-left text-[14px] sm:text-[15px] leading-[1.2] tracking-[0.04em] text-white">
        TORRES
        <br />
        CAPITOL
        <br />
        COLLEGE
      </div>
    </div>
  );
}

function TopLeftLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/tcc-logo.png"
        alt="Torres Capitol College logo"
        width={96}
        height={103}
        priority
        className="h-[38px] w-auto object-contain brightness-[1.3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
      />
      <div className="font-display text-[12px] leading-[1.2] tracking-[0.05em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        TORRES
        <br />
        CAPITOL
        <br />
        COLLEGE
      </div>
    </Link>
  );
}

export default function LoginPage() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const isRegister = mode === "register";
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useLayoutEffect(() => {
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
        ".login-bg",
        { scale: 1.12 },
        { scale: 1, duration: 2, ease: "power2.out", clearProps: "scale" },
        0
      );
      tl.from(".top-logo", { y: -22, opacity: 0, duration: 0.8 }, 0.15);
      tl.from(
        ".login-card",
        { x: 60, opacity: 0, duration: 1 },
        0.25
      );
      tl.from(
        ".login-stagger",
        { y: 22, opacity: 0, duration: 0.6, stagger: 0.07 },
        0.5
      );
      tl.from(".motto-login", { opacity: 0, x: -18, duration: 0.7 }, 0.9);
    }, root);
    // Safety net: if the ticker ever stalls, never leave content invisible.
    const safety = window.setTimeout(() => {
      root.current
        ?.querySelectorAll(
          ".top-logo,.login-card,.login-stagger,.motto-login"
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

  return (
    <div
      ref={root}
      className="relative min-h-[100dvh] w-full overflow-x-clip bg-black text-white font-sans"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <Image
          src="/login-bg.png"
          alt="Torres Capitol College courtyard"
          fill
          priority
          className="login-bg object-cover object-center [filter:saturate(1.02)_contrast(1.03)]"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/55" />
        <div className="absolute inset-y-0 right-0 w-[46%] bg-gradient-to-l from-black/45 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col px-5 sm:px-8 lg:px-12 py-4">
        <div className="top-logo shrink-0">
          <TopLeftLogo />
        </div>

        <div className="flex flex-1 min-h-0 items-center justify-center lg:justify-end">
          {/* LOGIN CARD */}
          <section className={`login-card my-auto flex w-full max-w-[540px] flex-col rounded-[20px] border border-white/20 bg-[#0d1117]/55 px-5 sm:px-8 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl ${isRegister ? "max-h-[522px]" : "max-h-full"} overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
            <div className="login-stagger shrink-0">
              <CardLogo />
            </div>

            <h1 className="login-stagger mt-2 shrink-0 text-center text-[22px] sm:text-[24px] font-extrabold tracking-tight">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="login-stagger mt-0.5 shrink-0 text-center text-[12.5px] sm:text-[13.5px] font-light text-white/75">
              {isRegister
                ? "Sign up to access the School Voting System"
                : "Log in to access the School Voting System"}
            </p>

            <form
              key={mode}
              autoComplete="off"
              className="mt-3 flex min-h-0 flex-1 flex-col"
              onSubmit={async (e) => {
                e.preventDefault();
                if (busy) return;
                setBusy(true);
                setError("");
                setNotice("");
                try {
                  const fd = new FormData(e.currentTarget);
                  const payload = isRegister
                    ? {
                        lastname: String(fd.get("lastname") ?? ""),
                        firstname: String(fd.get("firstname") ?? ""),
                        studentId: String(fd.get("studentId") ?? ""),
                        password: String(fd.get("password") ?? ""),
                      }
                    : {
                        studentId: String(fd.get("studentId") ?? ""),
                        password: String(fd.get("password") ?? ""),
                      };
                  const res = await fetch(
                    isRegister ? "/api/auth/register" : "/api/auth/login",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    }
                  );
                  const data = await res.json().catch(() => null);
                  if (!res.ok) {
                    setError(data?.error ?? "Something went wrong. Please try again.");
                    return;
                  }
                  if (isRegister && data?.pending) {
                    setNotice(
                      data?.message ??
                        "Account created! Please wait for admin approval before logging in."
                    );
                    setMode("login");
                    return;
                  }
                  router.push(data?.isAdmin ? "/admin" : "/dashboard");
                } catch {
                  setError("Could not reach the server. Check your connection.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {isRegister ? (
                <>
                  <label
                    htmlFor="lastname"
                    className="login-stagger shrink-0 text-[13px] font-semibold text-white/90"
                  >
                    Lastname
                  </label>
                  <div className="login-stagger relative mt-1.5 shrink-0">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <circle cx="12" cy="8" r="3.6" />
                        <path d="M5 20c1-3.8 3.7-5.5 7-5.5s6 1.7 7 5.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Enter your lastname"
                      className="h-[44px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] pl-12 pr-4 text-[14px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                    />
                  </div>

                  <label
                    htmlFor="firstname"
                    className="login-stagger mt-2 shrink-0 text-[13px] font-semibold text-white/90"
                  >
                    Firstname
                  </label>
                  <div className="login-stagger relative mt-1.5 shrink-0">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <circle cx="12" cy="8" r="3.6" />
                        <path d="M5 20c1-3.8 3.7-5.5 7-5.5s6 1.7 7 5.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Enter your firstname"
                      className="h-[44px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] pl-12 pr-4 text-[14px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                    />
                  </div>

                  <label
                    htmlFor="reg-student-id"
                    className="login-stagger mt-2 shrink-0 text-[13px] font-semibold text-white/90"
                  >
                    Student ID
                  </label>
                  <div className="login-stagger relative mt-1.5 shrink-0">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M8 10h8M8 14h5" />
                      </svg>
                    </span>
                    <input
                      id="reg-student-id"
                      name="studentId"
                      type="text"
                      inputMode="numeric"
                      autoComplete="username"
                      placeholder="e.g. 00005050"
                      className="h-[44px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] pl-12 pr-4 text-[14px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                    />
                  </div>

                  <label
                    htmlFor="reg-password"
                    className="login-stagger mt-2 shrink-0 text-[13px] font-semibold text-white/90"
                  >
                    Password
                  </label>
                  <div className="login-stagger relative mt-1.5 shrink-0">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <rect x="5" y="10" width="14" height="10" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                    <input
                      id="reg-password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create your password"
                      className="h-[44px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] pl-12 pr-12 text-[14px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                    >
                      {showPw ? (
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
                </>
              ) : (
                <>
                  <label
                    htmlFor="student-id"
                    className="login-stagger shrink-0 text-[13px] font-semibold text-white/90"
                  >
                    Student ID / Username
                  </label>
                  <div className="login-stagger relative mt-1.5 shrink-0">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <circle cx="12" cy="8" r="3.6" />
                        <path d="M5 20c1-3.8 3.7-5.5 7-5.5s6 1.7 7 5.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      id="student-id"
                    name="studentId"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your Student ID or Username"
                      className="h-[44px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] pl-12 pr-4 text-[14px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                    />
                  </div>

                  <label
                    htmlFor="password"
                    className="login-stagger mt-3 shrink-0 text-[13px] font-semibold text-white/90"
                  >
                    Password
                  </label>
                  <div className="login-stagger relative mt-1.5 shrink-0">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <rect x="5" y="10" width="14" height="10" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                    <input
                      id="password"
                    name="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="h-[44px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] pl-12 pr-12 text-[14px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                    >
                      {showPw ? (
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
                </>
              )}

              {!isRegister && (
              <div className="login-stagger mt-3 flex shrink-0 items-center justify-between text-[12.5px]">
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
                  className="flex items-center gap-2 text-white/80 transition hover:text-white"
                >
                  <span
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition ${
                      remember
                        ? "border-white bg-white text-black"
                        : "border-white/40 bg-transparent"
                    }`}
                  >
                    {remember && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  Remember me
                </button>

              </div>
              )}

              {error && (
                <p className="mt-3 shrink-0 rounded-[10px] border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-[13px] font-medium text-red-200">
                  {error}
                </p>
              )}
              {notice && (
                <p className="mt-3 shrink-0 rounded-[10px] border border-green-400/50 bg-green-500/15 px-4 py-2.5 text-[13px] font-semibold text-green-200">
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className={`login-stagger group ${isRegister ? "mt-2" : "mt-3"} flex h-[46px] shrink-0 items-center justify-center gap-3 rounded-[10px] text-[15px] font-bold shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition ${
                  busy
                    ? "cursor-wait bg-white/60 text-black/60"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {busy ? "Please wait…" : isRegister ? "Create Account" : "Log In"}
                {!busy && (
                  <span className="text-[17px] transition-transform group-hover:translate-x-1">→</span>
                )}
              </button>

              <div className={`login-stagger ${isRegister ? "mt-2" : "mt-3"} flex shrink-0 items-center gap-4 text-[11.5px] tracking-[0.18em] text-white/55`}>
                <span className="h-px flex-1 bg-white/25" />
                OR
                <span className="h-px flex-1 bg-white/25" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setMode(isRegister ? "login" : "register");
                  setError("");
                  setNotice("");
                }}
                className={`login-stagger ${isRegister ? "mt-2" : "mt-3"} flex h-[44px] shrink-0 items-center justify-center gap-3 rounded-[10px] border border-white/60 bg-transparent text-[13.5px] font-semibold text-white transition hover:bg-white/10`}
              >
                {!isRegister && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round">
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M5 20c1-3.8 3.7-5.5 7-5.5s6 1.7 7 5.5" />
                    <path d="M18.5 3.5v6M15.5 6.5h6" />
                  </svg>
                )}
                {isRegister ? "Back to Log In" : "Create new account"}
              </button>

              <p className={`login-stagger shrink-0 text-center text-[12.5px] font-light text-white/65 ${isRegister ? "mt-2 mb-4" : "mt-3"}`}>
                Need help? Contact the ICT Office.
              </p>
            </form>
          </section>
        </div>

        <div className="motto-login flex shrink-0 items-center gap-4 pt-3 text-[11px] sm:text-[12px] font-light tracking-[0.3em] text-white/80">
          <span>TCC VOTING SYSTEM</span>
          <span className="h-px w-24 bg-white/60" />
        </div>
      </div>
    </div>
  );
}
