"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CARDS = [
  {
    title: "STUDENT LEADERSHIP",
    desc: "Empowering student voices for a stronger college community.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="8.5" cy="8" r="2.5" />
        <circle cx="15.5" cy="9.5" r="2" />
        <path d="M3.5 19c.6-3 2.8-4.5 5-4.5s4.4 1.5 5 4.5" />
        <path d="M14.5 14.7c2 .2 3.8 1.4 4.4 3.8" />
      </svg>
    ),
  },
  {
    title: "FAIR AND TRANSPARENT",
    desc: "A safe, secure, and honest election process for everyone.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6l8-3Z" />
        <path d="m9.5 11.5 2 2 3.5-4" />
      </svg>
    ),
  },
  {
    title: "A BRIGHTER TOMORROW",
    desc: "Your vote creates meaningful change for a better college.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <rect x="3" y="14" width="3.4" height="6" rx="0.6" />
        <rect x="8" y="11" width="3.4" height="9" rx="0.6" />
        <rect x="12.6" y="7.5" width="3.4" height="12.5" rx="0.6" />
        <rect x="17.2" y="3.5" width="3.4" height="16.5" rx="0.6" />
      </svg>
    ),
  },
];

export default function VotingPage() {
  const root = useRef<HTMLDivElement>(null);

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
        ".vote-bg",
        { scale: 1.12 },
        { scale: 1, duration: 2.2, ease: "power2.out", clearProps: "scale" },
        0
      );
      tl.from(".vote-logo", { y: -22, opacity: 0, duration: 0.8 }, 0.15);
      tl.from(".vote-eyebrow", { y: 16, opacity: 0, duration: 0.6 }, 0.35);
      tl.from(
        ".vote-line",
        { y: 56, opacity: 0, duration: 0.9, stagger: 0.1 },
        0.45
      );
      tl.from(".vote-desc", { y: 20, opacity: 0, duration: 0.7 }, 0.9);
      tl.from(".vote-cta", { y: 20, opacity: 0, duration: 0.6 }, 1.0);
      tl.from(
        ".vote-card",
        { y: 32, opacity: 0, duration: 0.7, stagger: 0.1 },
        1.05
      );
    }, root);
    const safety = window.setTimeout(() => {
      root.current
        ?.querySelectorAll(
          ".vote-logo,.vote-eyebrow,.vote-line,.vote-desc,.vote-cta,.vote-card"
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
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/vote-bg.png"
          alt="Student casting a vote at Torres Capitol College"
          fill
          priority
          style={{ objectPosition: "58% 38%" }}
          className="vote-bg object-cover [filter:saturate(1.02)_contrast(1.03)]"
        />
        <div className="absolute inset-0 bg-black/10" />
        {/* left dark panel for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/85 via-[40%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent w-[60%]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        {/* decorative gold arc + swooshes */}
        <svg
          className="absolute -top-[12%] -left-[8%] h-[85%] aspect-square opacity-50"
          viewBox="0 0 500 500"
          fill="none"
        >
          <circle cx="150" cy="180" r="215" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="150" cy="180" r="228" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
        </svg>
        <svg
          className="absolute -left-10 bottom-0 h-[45%] w-[40%] opacity-50"
          viewBox="0 0 600 400"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M-20 380 C 140 330, 230 260, 420 230 S 560 180, 620 80" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1.5" />
          <path d="M-20 400 C 150 360, 260 300, 440 270 S 570 210, 630 120" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1" />
        </svg>
      </div>

      {/* CONTENT — single viewport, no overlap by construction */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col px-5 sm:px-8 lg:px-12 py-4 sm:py-5">
        <div className="vote-logo">
          <Navbar active="Voting" />
        </div>

        <div className="flex flex-1 flex-col justify-center max-w-[560px] py-1">
          <p className="vote-eyebrow flex shrink-0 items-center gap-4 text-[11px] sm:text-[13px] font-light tracking-[0.42em] text-white/85">
            <span className="h-px w-10 bg-white/70" />
            STUDENT ELECTIONS
          </p>

          <h1 className="mt-2 sm:mt-3 shrink-0 font-display leading-[1.04] text-[clamp(1.55rem,10vw,2.1rem)] sm:text-[clamp(2rem,7vw+2vh,3.4rem)]">
            <span className="vote-line block text-white">YOUR VOICE</span>
            <span className="vote-line text-metallic block">BUILDS A</span>
            <span className="vote-line block text-white">BRIGHTER</span>
            <span className="vote-line block text-white">TOMORROW</span>
          </h1>

          <p className="vote-desc mt-3 sm:mt-4 max-w-[480px] shrink-0 text-[13px] sm:text-[14.5px] leading-[1.6] text-white/85 font-light">
            Be part of a transparent, fair, and meaningful election. Cast
            your vote and help shape a stronger, more united Torres Capitol
            College.
          </p>

          <div className="vote-cta mt-4 sm:mt-5 shrink-0">
            <Link
              href="/login"
              className="group inline-flex items-center gap-8 rounded-[12px] bg-white px-9 sm:px-11 py-3 sm:py-3.5 text-[15px] sm:text-[16px] font-bold text-black shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition hover:bg-white/90"
            >
              Vote Now
              <span className="text-[19px] leading-none transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* CARDS */}
        <section className="grid shrink-0 grid-cols-1 sm:grid-cols-3 gap-3 max-w-[1100px] pb-1">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="vote-card flex items-start gap-3 rounded-[14px] border border-white/12 bg-[#0b0d12]/55 p-3.5 sm:p-4 backdrop-blur-xl"
            >
              <div
                className="flex h-[46px] w-[46px] sm:h-[52px] sm:w-[52px] shrink-0 items-center justify-center rounded-full border bg-white/[0.03]"
                style={{ borderColor: "#FFFFFF88" }}
              >
                {c.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[13px] sm:text-[14px] font-bold tracking-[0.04em] text-white">
                  {c.title}
                </h3>
                <p className="mt-1 text-[11.5px] sm:text-[12.5px] leading-[1.5] text-white font-light">
                  {c.desc}
                </p>
                <span
                  className="mt-2 block h-[3px] w-9 rounded-full"
                  style={{ background: "#FFFFFF" }}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
