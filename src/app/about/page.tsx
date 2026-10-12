"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const CARDS = [
  {
    title: "Our Mission",
    desc: "To provide accessible, quality education and encourage active participation in shaping a better community.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" />
        <path d="M6.5 11.2V15c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-3.8" />
        <path d="M21.5 9v5" />
      </svg>
    ),
  },
  {
    title: "Our Vision",
    desc: "A progressive and globally competitive institution nurturing responsible and innovative individuals.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
        <circle cx="12" cy="12" r="1.2" fill="#0b0b0b" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Our Values",
    desc: "Integrity, Excellence, Inclusivity, Collaboration, and Service to the Community.",
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
    title: "Our Impact",
    desc: "Building opportunities, empowering people, and creating meaningful change.",
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



export default function AboutPage() {
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
        ".about-bg",
        { scale: 1.12 },
        { scale: 1, duration: 2.2, ease: "power2.out", clearProps: "scale" },
        0
      );
      tl.from(".about-logo", { y: -22, opacity: 0, duration: 0.8 }, 0.15);
      tl.from(".about-eyebrow", { y: 16, opacity: 0, duration: 0.6 }, 0.35);
      tl.from(
        ".about-line",
        { y: 60, opacity: 0, duration: 0.9, stagger: 0.12 },
        0.45
      );
      tl.from(".about-sub", { y: 16, opacity: 0, duration: 0.6 }, 0.8);
      tl.from(".about-desc", { y: 20, opacity: 0, duration: 0.7 }, 0.9);
      tl.from(".about-quote", { x: 30, opacity: 0, duration: 0.8 }, 1.0);
      tl.from(
        ".about-card",
        { y: 34, opacity: 0, duration: 0.7, stagger: 0.1 },
        1.1
      );
    }, root);
    const safety = window.setTimeout(() => {
      root.current
        ?.querySelectorAll(
          ".about-logo,.about-eyebrow,.about-line,.about-sub,.about-desc,.about-quote,.about-card"
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
          src="/about-bg.png"
          alt="Torres Capitol College building"
          fill
          priority
          style={{ objectPosition: "60% 18%" }}
          className="about-bg object-cover [filter:saturate(1.02)_contrast(1.03)]"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/85 via-[42%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent w-[62%]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        {/* decorative gold swooshes */}
        <svg
          className="absolute -left-10 bottom-0 h-[70%] w-[46%] opacity-60"
          viewBox="0 0 600 500"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M-20 480 C 140 420, 220 340, 420 300 S 560 240, 620 120" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.5" />
          <path d="M-20 500 C 150 450, 260 380, 440 340 S 570 270, 630 160" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col px-5 sm:px-8 lg:px-12 py-4 sm:py-5">
        <div className="about-logo">
          <Navbar active="About" />
        </div>

        <div className="flex flex-1 min-h-0 items-start pt-2 sm:pt-[3vh] xl:pt-[4vh]">
          <section className="max-w-[620px] flex flex-col justify-start">
            <p className="about-eyebrow flex shrink-0 items-center gap-4 text-[11px] sm:text-[13px] font-light tracking-[0.42em] text-white/85">
              ABOUT US
              <span className="h-px w-10 bg-white/70" />
            </p>

            <h1 className="mt-2 sm:mt-3 shrink-0 font-display leading-[1.04] text-[clamp(1.55rem,10vw,2.1rem)] sm:text-[clamp(2rem,8.5vw+2vh,4.2rem)]">
              <span className="about-line block text-white">MORE THAN</span>
              <span className="about-line text-metallic block">A COLLEGE</span>
            </h1>

            <p className="about-sub mt-2.5 sm:mt-3 shrink-0 text-[10.5px] sm:text-[12.5px] font-medium tracking-[0.32em] text-white/85">
              PEOPLE&nbsp;&nbsp;•&nbsp;&nbsp;EDUCATION&nbsp;&nbsp;•&nbsp;&nbsp;OPPORTUNITY
            </p>

            <p className="about-desc mt-3 sm:mt-4 max-w-[500px] shrink-0 text-[13px] sm:text-[14.5px] xl:text-[15.5px] leading-[1.6] text-white/85 font-light">
              Torres Capitol College is a community built on integrity,
              excellence, and opportunity. Since 1997, we have been committed
              to providing quality education while empowering every student to
              create a better and brighter future.
            </p>

          </section>

          {/* right quote */}
          <aside className="about-quote ml-auto hidden lg:block shrink-0 self-center max-w-[220px] border-l-2 pl-5 pr-2 py-1" style={{ borderColor: "#FFFFFF" }}>
            <p className="text-[19px] xl:text-[21px] leading-[1.45] font-light text-white/90">
              A Stronger
              <br />
              Community
              <br />
              For A Brighter
              <br />
              Tomorrow.
            </p>
          </aside>
        </div>

        {/* CARDS */}
        <section className="grid shrink-0 grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-1">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="about-card flex items-start gap-3 rounded-[14px] border border-white/12 bg-[#0b0d12]/55 p-3.5 sm:p-4 backdrop-blur-xl"
            >
              <div
                className="flex h-[46px] w-[46px] sm:h-[52px] sm:w-[52px] shrink-0 items-center justify-center rounded-full border bg-white/[0.03]"
                style={{ borderColor: "#FFFFFF88" }}
              >
                {c.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[14px] sm:text-[15.5px] font-bold text-white">
                  {c.title}
                </h3>
                <p className="mt-1 text-[11.5px] sm:text-[12.5px] leading-[1.5] text-white font-light line-clamp-3 sm:line-clamp-4">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
