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
    <header className="sticky top-0 z-50 border-b border-white/60 dark:border-white/5 bg-white/70 dark:bg-[#050510]/70 backdrop-blur-2xl shadow-[0_10px_60px_-40px_rgba(139,92,246,0.9)] transition-colors">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#home" className="group flex items-center gap-3" aria-label="Pasar UMKM, ke beranda">
          <span className="relative grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white shadow-[0_20px_60px_-30px_rgba(236,72,153,0.9)] transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110">
            <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <StoreIcon />
          </span>
          <span className="text-[16px] font-semibold tracking-[-.03em] text-slate-900 dark:text-white">pasar<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">umkm</span></span>
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] font-medium text-slate-600 dark:text-slate-300 md:flex" aria-label="Navigasi utama">
          <Link className="relative transition-colors hover:text-violet-500 dark:hover:text-fuchsia-400 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-violet-500 after:to-fuchsia-500 after:transition-all hover:after:w-full" href="#jelajahi">Jelajahi</Link>
          <Link className="relative transition-colors hover:text-violet-500 dark:hover:text-fuchsia-400 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-violet-500 after:to-fuchsia-500 after:transition-all hover:after:w-full" href="#cara-kerja">Cara Kerja</Link>
          <Link className="relative transition-colors hover:text-violet-500 dark:hover:text-fuchsia-400 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-violet-500 after:to-fuchsia-500 after:transition-all hover:after:w-full" href="#faq">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="group relative grid size-10 place-items-center overflow-hidden rounded-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-40px_rgba(139,92,246,0.9)]"
            aria-label={theme === "light" ? "Aktifkan mode malam" : "Aktifkan mode siang"}
          >
            <span className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10" />
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <Link href="#daftar" className="group relative inline-flex min-h-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-5 text-[13px] font-semibold text-white shadow-[0_30px_70px_-40px_rgba(236,72,153,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_40px_80px_-40px_rgba(168,85,247,0.95)] active:scale-[.98]">
            <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-[900ms] group-hover:translate-x-[120%]" />
            <span className="relative flex items-center gap-2">Daftarkan Usaha <span aria-hidden="true">→</span></span>
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
