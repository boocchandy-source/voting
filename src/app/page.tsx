"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const FEATURES = [
  {
    title: "Secure & Fair",
    desc: "Your vote is protected and counted accurately.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6l8-3Z" />
        <path d="m9.5 11.5 2 2 3.5-4" />
      </svg>
    ),
  },
  {
    title: "Student Empowerment",
    desc: "Be part of the change in your school community.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8.5" cy="8" r="2.5" />
        <circle cx="15.5" cy="9.5" r="2" />
        <path d="M3.5 19c.6-3 2.8-4.5 5-4.5s4.4 1.5 5 4.5" />
        <path d="M14.5 14.7c2 .2 3.8 1.4 4.4 3.8" />
        <path d="M15 5.2a2 2 0 0 1 0 3.7" />
      </svg>
    ),
  },
  {
    title: "Transparent Results",
    desc: "Open and honest election process.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <rect x="3" y="14" width="3.4" height="6" rx="0.6" />
        <rect x="8" y="11" width="3.4" height="9" rx="0.6" />
        <rect x="12.6" y="7.5" width="3.4" height="12.5" rx="0.6" />
        <rect x="17.2" y="3.5" width="3.4" height="16.5" rx="0.6" />
      </svg>
    ),
  },
];

export default function Home() {
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
        ".landing-bg",
        { scale: 1.18 },
        { scale: 1.08, duration: 2.2, ease: "power2.out" },
        0
      );
      tl.from(".nav-shell", { y: -28, opacity: 0, duration: 0.9 }, 0.1);
      tl.from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.7 }, 0.35);
      tl.from(
        ".hero-line",
        { y: 70, opacity: 0, duration: 1, stagger: 0.12 },
        0.45
      );
      tl.from(".hero-rule", { scaleX: 0, transformOrigin: "left", duration: 0.8 }, 0.9);
      tl.from(".hero-desc", { y: 22, opacity: 0, duration: 0.7 }, 1.0);
      tl.from(
        ".feature-card",
        { y: 36, opacity: 0, duration: 0.7, stagger: 0.12 },
        1.2
      );
      tl.from(".footer-wedge", { yPercent: 100, duration: 0.9, ease: "power3.out" }, 1.1);
      tl.from(".motto", { opacity: 0, x: 24, duration: 0.7 }, 1.4);
    }, root);
    // Safety net: if the ticker ever stalls, never leave content invisible.
    const safety = window.setTimeout(() => {
      root.current
        ?.querySelectorAll(
          ".nav-shell,.hero-eyebrow,.hero-line,.hero-rule,.hero-desc,.feature-card,.footer-wedge,.motto"
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
    <div ref={root} className="relative min-h-[100dvh] w-full overflow-x-clip bg-black text-white font-sans">
      {/* BACKGROUND — lowered so full TORRES CAPITOL COLLEGE sign clears the nav */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-shift absolute inset-0 translate-y-[52px]">
          <Image
            src="/landing-bg.png"
            alt="Torres Capitol College building"
            fill
            priority
            style={{ objectPosition: "72% 18%" }}
            className="landing-bg object-cover scale-[1.08] [filter:saturate(0.92)_contrast(1.05)]"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 via-[38%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent w-[78%]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-16 h-56 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      </div>

      {/* CONTENT — single viewport, no scroll */}
      <div className="relative z-10 isolate mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-4 sm:px-6 lg:px-10 pt-4 pb-[72px]">
        <Navbar active="Home" />

        {/* HERO — below nav, never overlaps nav */}
        <section className="relative z-10 flex-1 flex flex-col justify-start pt-2 sm:pt-[3vh] xl:pt-[4vh] max-w-[680px]">
          <p className="hero-eyebrow shrink-0 text-[10px] sm:text-[12px] xl:text-[13px] font-light tracking-[0.42em] text-white/80">
            YOUR VOICE. A STRONGER TOMORROW.
          </p>

          <h1 className="mt-2 sm:mt-3 shrink-0 font-display leading-[1.04] text-[clamp(1.55rem,10vw,2.1rem)] sm:text-[clamp(2rem,8.5vw+2vh,4.2rem)]">
            <span className="hero-line block text-white">SCHOOL</span>
            <span className="hero-line text-metallic block">VOTING</span>
            <span className="hero-rule mt-1.5 block h-[3px] w-[94%] max-w-[480px]" />
            <span className="hero-line mt-1.5 block text-white">SYSTEM</span>
          </h1>

          <p className="hero-desc shrink-0 mt-3 sm:mt-4 max-w-[500px] text-[13.5px] sm:text-[15px] xl:text-[16px] leading-[1.55] text-white/85 font-light">
            A transparent, secure, and convenient voting platform for a more
            active and united Torres Capitol College community.
          </p>

        </section>

        {/* FEATURE CARDS — compact, shrink-0 */}
        <section className="shrink-0 grid gap-3 md:grid-cols-3 max-w-[1280px] pb-1">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card flex items-center sm:items-start gap-3.5 rounded-[16px] border border-white/15 bg-[#0b0b0b]/45 p-3.5 sm:p-4 backdrop-blur-xl"
            >
              <div className="flex h-[48px] w-[48px] sm:h-[52px] sm:w-[52px] shrink-0 items-center justify-center rounded-[12px] border border-white/20 bg-white/[0.04]">
                {f.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[14.5px] sm:text-[15.5px] font-bold truncate sm:whitespace-normal">{f.title}</h3>
                <p className="mt-1 text-[12.5px] sm:text-[13.5px] leading-[1.45] text-white/70 font-light line-clamp-2">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* FOOTER WEDGE */}
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
        <div className="footer-wedge-line absolute inset-x-0 bottom-0 h-[64px] bg-black/60" />
        <div className="footer-wedge absolute inset-x-0 bottom-0 h-[64px] bg-[#f3f3f4]" />
        <div className="relative flex h-[64px] items-end justify-end gap-5 px-6 sm:px-12 pb-4">
          <span className="motto hidden sm:block h-px w-[220px] lg:w-[420px] bg-black/50 mb-[7px]" />
          <span className="motto text-[11px] sm:text-[13px] font-medium tracking-[0.32em] text-black">
            TCC VOTING SYSTEM
          </span>
          <span className="motto hidden sm:block h-[2px] w-[72px] bg-black mb-[6px]" />
        </div>
      </div>
    </div>
  );
}
