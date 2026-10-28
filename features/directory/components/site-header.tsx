"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--border-subtle)", background: "color-mix(in srgb, var(--bg-surface) 94%, transparent)", backdropFilter: "blur(16px)" }}>
      <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#home" className="group flex items-center gap-3" aria-label="Pasar UMKM, ke beranda">
          <div className="leading-tight">
            <p className="text-[17px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>PASAR UMKM</p>
            <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--text-tertiary)" }}>Business Directory</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-10 text-[14px] md:flex" aria-label="Navigasi utama">
          <Link className="transition-colors hover:text-blue-700" style={{ color: "var(--text-secondary)" }} href="#home">Home</Link>
          <Link className="transition-colors hover:text-blue-700" style={{ color: "var(--text-secondary)" }} href="#jelajahi">Directory</Link>
          <Link className="transition-colors hover:text-blue-700" style={{ color: "var(--text-secondary)" }} href="#cara-kerja">Our Approach</Link>
          <Link className="transition-colors hover:text-blue-700" style={{ color: "var(--text-secondary)" }} href="#daftar">List Your Business</Link>
          <Link className="transition-colors hover:text-blue-700" style={{ color: "var(--text-secondary)" }} href="#faq">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-full border transition-all"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)", background: "transparent" }}
            aria-label={theme === "light" ? "Aktifkan mode malam" : "Aktifkan mode siang"}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <Link href="#daftar" className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#1f4ed8] to-[#1a3fbf] px-6 text-[13px] font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function StoreIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9h18l-1.6 10.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8L3 9Z"/><path d="M8 9 11 3M16 9 13 3"/></svg>;
}

function MoonIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}

function SunIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
}
