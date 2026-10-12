"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Voting", href: "/voting" },
  { label: "Guidelines", href: "/guidelines" },
  { label: "Contact", href: "/contact" },
];

export function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/tcc-logo.png"
        alt="Torres Capitol College logo"
        width={120}
        height={128}
        priority
        className="h-[48px] w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
      />
      <div className="font-display text-[11px] sm:text-[12px] leading-[1.2] tracking-[0.06em] text-white">
        TORRES
        <br />
        CAPITOL
        <br />
        COLLEGE
      </div>
    </div>
  );
}

export function WhiteLogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-stretch gap-[3px] h-[48px]">
        <div className="w-[6px] bg-white" />
        <div className="w-[6px] bg-white" />
        <div className="w-[6px] bg-white" />
        <div className="w-[6px] bg-white relative">
          <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2 text-[5px] font-sans font-bold text-black leading-none">1</span>
        </div>
        <div className="w-[6px] bg-white relative">
          <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2 text-[5px] font-sans font-bold text-black leading-none">9</span>
        </div>
        <div className="w-[6px] bg-white relative">
          <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2 text-[5px] font-sans font-bold text-black leading-none">9</span>
        </div>
        <div className="w-[6px] bg-white relative">
          <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2 text-[5px] font-sans font-bold text-black leading-none">7</span>
        </div>
      </div>
      <div className="font-display text-[11px] sm:text-[12px] leading-[1.2] tracking-[0.06em] text-white">
        TORRES
        <br />
        CAPITOL
        <br />
        COLLEGE
      </div>
    </div>
  );
}

export default function Navbar({
  active,
  logo = "shield",
}: {
  active: string;
  logo?: "shield" | "white";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="nav-shell relative z-30 flex shrink-0 items-center justify-between gap-6 rounded-[16px] border border-white/15 bg-[#0a0a0a]/35 px-4 sm:px-5 py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <Link href="/" className="shrink-0">
          {logo === "white" ? <WhiteLogoMark /> : <LogoMark />}
        </Link>

        <nav className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-white/90">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative py-2 transition hover:text-white ${
                item.label === active ? "text-white font-semibold" : ""
              }`}
            >
              {item.label}
              {item.label === active && (
                <span className="absolute -bottom-[2px] left-0 h-[2px] w-full bg-white" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-2 whitespace-nowrap rounded-[10px] bg-white px-4 sm:px-6 py-[10px] sm:py-[11px] text-[13.5px] sm:text-[15px] font-semibold text-black transition hover:bg-white/90"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5v1H4v-1Z" />
            </svg>
            Login / Sign In
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/20 bg-white/10"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="white" strokeWidth="2" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <div className="lg:hidden absolute top-[76px] left-4 right-4 z-20 rounded-[14px] border border-white/15 bg-black/85 backdrop-blur-xl p-4 flex flex-col gap-1 shadow-2xl">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-4 py-2.5 text-[15px] font-medium hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-2 flex items-center justify-center gap-2 rounded-[10px] bg-white px-6 py-3 text-[15px] font-semibold text-black"
          >
            Login / Sign In
          </Link>
        </div>
      )}
    </>
  );
}
