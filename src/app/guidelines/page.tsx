"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const RULES = [
  {
    n: "01",
    title: "BE A REGISTERED STUDENT",
    desc: "Only officially enrolled students are allowed to vote.",
  },
  {
    n: "02",
    title: "USE YOUR OWN ACCOUNT",
    desc: "Log in using your assigned student account.",
  },
  {
    n: "03",
    title: "VOTE ONLY ONCE",
    desc: "Each student is allowed to cast one (1) vote only.",
  },
  {
    n: "04",
    title: "DO NOT SHARE YOUR ACCOUNT",
    desc: "Keep your account credentials private.",
  },
  {
    n: "05",
    title: "RESPECT ALL CANDIDATES AND SUPPORTERS",
    desc: "Maintain a respectful and positive environment during the election period.",
  },
  {
    n: "06",
    title: "FOLLOW ALL ELECTION RULES",
    desc: "Any form of fraud or misconduct is strictly prohibited.",
  },
];

export default function GuidelinesPage() {
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
        ".guide-bg",
        { scale: 1.12 },
        { scale: 1, duration: 2.2, ease: "power2.out", clearProps: "scale" },
        0
      );
      tl.from(".guide-logo", { y: -22, opacity: 0, duration: 0.8 }, 0.15);
      tl.from(".guide-eyebrow", { y: 14, opacity: 0, duration: 0.6 }, 0.3);
      tl.from(".guide-title", { y: 50, opacity: 0, duration: 0.9 }, 0.4);
      tl.from(".guide-sub", { y: 16, opacity: 0, duration: 0.6 }, 0.65);
      tl.from(
        ".guide-rule",
        { x: -28, opacity: 0, duration: 0.6, stagger: 0.08 },
        0.7
      );
    }, root);
    const safety = window.setTimeout(() => {
      root.current
        ?.querySelectorAll(
          ".guide-logo,.guide-eyebrow,.guide-title,.guide-sub,.guide-rule"
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
          src="/guide-bg.png"
          alt="Torres Capitol College front with ballot box"
          fill
          priority
          style={{ objectPosition: "50% 38%" }}
          className="guide-bg object-cover [filter:saturate(1.02)_contrast(1.03)]"
        />
        {/* soft wash so the thin gray title stays legible on bright sky */}
        <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
        {/* dark panel for the rules column */}
        <div className="absolute inset-y-0 left-0 w-[46%] sm:w-[42%] bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* CONTENT — single viewport, zones never overlap */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col px-5 sm:px-8 lg:px-12 py-3 sm:py-4">
        <div className="guide-logo">
          <Navbar active="Guidelines" />
        </div>

        <div className="flex shrink-0 flex-col items-center text-center pt-2 sm:pt-3">
          <p className="guide-eyebrow flex items-center gap-4 text-[10px] sm:text-[12px] font-medium tracking-[0.42em] text-white/85">
            <span className="h-px w-8 bg-white/70" />
            STUDENT ELECTIONS
          </p>
          <h1 className="guide-title mt-1 sm:mt-2 font-display leading-[1.05] text-[clamp(2rem,10vw,3rem)] sm:text-[clamp(2.5rem,7vw+2vh,5rem)]">
            <span className="block text-white">GUIDELINES</span>
          </h1>
          <p className="guide-sub mt-1.5 sm:mt-2 max-w-[560px] text-[12px] sm:text-[14px] leading-[1.55] text-white/85 font-light">
            Please read and follow the guidelines to ensure
            <br className="hidden sm:block" />
            a fair, secure, and meaningful election for all students.
          </p>
        </div>

        {/* RULES — left column, clear of the ballot box */}
        <div className="flex flex-1 min-h-0 flex-col justify-end pb-2 sm:pb-4 max-w-[560px]">
          {RULES.map((r) => (
            <div key={r.n} className="guide-rule flex shrink-0 items-start gap-3 sm:gap-4 py-[7px] sm:py-[9px]">
              <span className="w-[44px] sm:w-[56px] shrink-0 text-[24px] sm:text-[32px] font-light leading-none text-white">
                {r.n}
              </span>
              <span className="mt-[2px] sm:mt-1 h-[30px] sm:h-[38px] w-px shrink-0 bg-white/50" />
              <div className="min-w-0">
                <h3 className="text-[12px] sm:text-[14px] font-semibold tracking-[0.08em] text-white">
                  {r.title}
                </h3>
                <p className="mt-0.5 text-[11.5px] sm:text-[13px] leading-[1.45] text-white/75 font-light">
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
