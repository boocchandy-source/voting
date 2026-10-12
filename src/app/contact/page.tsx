"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const CONTACT_ROWS = [
  {
    title: "Email",
    lines: ["info@torrescapitolcollege.edu.ph"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    ),
  },
  {
    title: "Phone",
    lines: ["+63 32 123 4567", "Mon – Fri, 8:00 AM – 5:00 PM"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  },
  {
    title: "Visit Us",
    lines: ["Torres Capitol College", "Capitol Site, Cebu City, Philippines 6000"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Office Hours",
    lines: ["Monday – Friday", "8:00 AM – 5:00 PM"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </svg>
    ),
  },
];

const SUBJECTS = [
  "General Inquiry",
  "Voting Concern",
  "Technical Support",
  "Suggestion",
  "Other",
];

export default function ContactPage() {
  const root = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

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
        ".contact-bg",
        { scale: 1.12 },
        { scale: 1, duration: 2.2, ease: "power2.out", clearProps: "scale" },
        0
      );
      tl.from(".nav-shell", { y: -28, opacity: 0, duration: 0.9 }, 0.1);
      tl.from(".contact-eyebrow", { y: 16, opacity: 0, duration: 0.6 }, 0.3);
      tl.from(
        ".contact-line",
        { y: 60, opacity: 0, duration: 0.9, stagger: 0.1 },
        0.4
      );
      tl.from(".contact-desc", { y: 20, opacity: 0, duration: 0.7 }, 0.7);
      tl.from(
        ".contact-row",
        { y: 24, opacity: 0, duration: 0.6, stagger: 0.08 },
        0.8
      );
      tl.from(".contact-card", { x: 60, opacity: 0, duration: 1 }, 0.35);
      tl.from(
        ".contact-field",
        { y: 18, opacity: 0, duration: 0.5, stagger: 0.06 },
        0.7
      );
    }, root);
    const safety = window.setTimeout(() => {
      root.current
        ?.querySelectorAll(
          ".nav-shell,.contact-eyebrow,.contact-line,.contact-desc,.contact-row,.contact-card,.contact-field"
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
          src="/contact-bg.png"
          alt="Torres Capitol College office"
          fill
          priority
          style={{ objectPosition: "50% 40%" }}
          className="contact-bg object-cover [filter:saturate(1.02)_contrast(1.03)]"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/80 via-[45%] to-[#060606]/20" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* CONTENT — single viewport, no scroll */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col px-5 sm:px-8 lg:px-12 py-4">
        <Navbar active="Contact" />

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 items-center py-2">
          {/* LEFT — info column */}
          <section className="flex flex-col justify-center">
            <p className="contact-eyebrow flex shrink-0 items-center gap-4 text-[11px] sm:text-[13px] font-light tracking-[0.42em] text-white/85">
              <span className="h-px w-10 bg-white/70" />
              GET IN TOUCH
            </p>

            <h1 className="mt-2 sm:mt-3 shrink-0 font-display leading-[1.04] whitespace-nowrap text-[clamp(1.7rem,4.2vw,2.9rem)]">
              <span className="contact-line text-white">CONTACT </span>
              <span className="contact-line text-metallic">US</span>
            </h1>

            <p className="contact-desc mt-2.5 sm:mt-3 max-w-[480px] shrink-0 text-[13px] sm:text-[14.5px] leading-[1.6] text-white/85 font-light">
              We are here to assist you. Send us a message and our team
              will get back to you as soon as possible.
            </p>

            <div className="mt-3 sm:mt-4 flex flex-col gap-2.5 sm:gap-3">
              {CONTACT_ROWS.map((row) => (
                <div key={row.title} className="contact-row flex shrink-0 items-center gap-3.5">
                  <div className="flex h-[46px] w-[46px] sm:h-[50px] sm:w-[50px] shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/[0.04] backdrop-blur-md">
                    {row.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-white">
                      {row.title}
                    </h3>
                    {row.lines.map((line) => (
                      <p
                        key={line}
                        className="truncate text-[12.5px] sm:text-[13.5px] font-light leading-[1.45] text-white/80"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT — message card */}
          <section className="contact-card mx-auto lg:mx-0 flex min-h-0 w-full max-w-[520px] lg:justify-self-end flex-col rounded-[20px] border border-white/20 bg-[#0d1117]/55 px-5 sm:px-7 py-4 sm:py-5 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl max-h-full overflow-y-auto [scrollbar-width:thin]">
            <div className="contact-field flex shrink-0 items-center justify-center gap-2.5">
              <Image
                src="/tcc-logo.png"
                alt="Torres Capitol College logo"
                width={120}
                height={128}
                className="h-[44px] w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              />
              <div className="font-display text-left text-[13px] leading-[1.2] tracking-[0.06em] text-white">
                TORRES
                <br />
                CAPITOL
                <br />
                COLLEGE
              </div>
            </div>

            <h2 className="contact-field mt-2 shrink-0 text-center text-[21px] sm:text-[23px] font-extrabold tracking-tight">
              Send Us a Message
            </h2>
            <p className="contact-field mt-1 shrink-0 text-center text-[12.5px] sm:text-[13.5px] font-light leading-[1.5] text-white/75">
              Have a question, concern, or suggestion?
              <br />
              We&apos;d love to hear from you.
            </p>

            {sent ? (
              <div className="contact-field flex flex-1 flex-col items-center justify-center py-6 text-center">
                <Image
                  src="/tcc-logo.png"
                  alt="Torres Capitol College logo"
                  width={160}
                  height={171}
                  className="h-[72px] w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                />
                <p className="mt-3 text-[16px] font-bold">Message sent!</p>
                <p className="mt-1 max-w-[320px] text-[13px] font-light text-white/70">
                  Thank you for reaching out. Our team will get back to you
                  as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setMessage("");
                  }}
                  className="mt-4 rounded-[10px] border border-white/40 px-6 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-white/10"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                className="mt-3 flex min-h-0 flex-1 flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="contact-field relative shrink-0">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <circle cx="12" cy="8" r="3.6" />
                      <path d="M5 20c1-3.8 3.7-5.5 7-5.5s6 1.7 7 5.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    className="h-[42px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] pl-11 pr-4 text-[13.5px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                  />
                </div>

                <div className="contact-field relative mt-2.5 shrink-0">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3.5 7 8.5 6 8.5-6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email Address"
                    aria-label="Email Address"
                    className="h-[42px] w-full rounded-[10px] border border-white/20 bg-white/[0.06] pl-11 pr-4 text-[13.5px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                  />
                </div>

                <div className="contact-field relative mt-2.5 shrink-0">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                      <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
                    </svg>
                  </span>
                  <select
                    required
                    defaultValue=""
                    aria-label="Subject"
                    className="h-[42px] w-full appearance-none rounded-[10px] border border-white/20 bg-white/[0.06] pl-11 pr-10 text-[13.5px] text-white outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09] [&>option]:bg-[#0d1117] [&:invalid]:text-white/45"
                  >
                    <option value="" disabled>
                      Subject
                    </option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>

                <div className="contact-field relative mt-2.5 flex min-h-0 flex-1 flex-col shrink-0">
                  <span className="pointer-events-none absolute left-4 top-[13px] text-white/50">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
                    </svg>
                  </span>
                  <textarea
                    required
                    rows={3}
                    maxLength={500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    aria-label="Your Message"
                    className="min-h-[84px] w-full flex-1 resize-none rounded-[10px] border border-white/20 bg-white/[0.06] pl-11 pr-4 pt-3 pb-6 text-[13.5px] text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/[0.09]"
                  />
                  <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] font-light text-white/45">
                    {message.length}/500
                  </span>
                </div>

                <button
                  type="submit"
                  className="contact-field mt-3 flex h-[44px] shrink-0 items-center justify-center gap-2.5 rounded-[10px] bg-white text-[14.5px] font-bold text-black shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:bg-white/90"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
                  </svg>
                  Send Message
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
