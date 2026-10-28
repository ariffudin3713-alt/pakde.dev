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
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm transition-colors">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#home" className="group flex items-center gap-3" aria-label="Pasar UMKM, ke beranda">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md transition-all duration-200 group-hover:rotate-3 group-hover:scale-110 group-hover:shadow-lg" aria-hidden="true">
            <StoreIcon />
          </span>
          <span className="text-[16px] font-bold tracking-[-.04em] text-gray-900 dark:text-white">Pasar<span className="text-blue-600 dark:text-blue-400">UMKM</span></span>
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] font-medium text-gray-600 dark:text-gray-300 md:flex" aria-label="Navigasi utama">
          <Link className="relative transition-colors hover:text-blue-600 dark:hover:text-blue-400 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full" href="#jelajahi">Jelajahi</Link>
          <Link className="relative transition-colors hover:text-blue-600 dark:hover:text-blue-400 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full" href="#cara-kerja">Cara Kerja</Link>
          <Link className="relative transition-colors hover:text-blue-600 dark:hover:text-blue-400 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full" href="#faq">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105"
            aria-label={theme === "light" ? "Aktifkan mode malam" : "Aktifkan mode siang"}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <Link href="#daftar" className="inline-flex min-h-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 text-[13px] font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-[.98] sm:px-5">
            Daftarkan Usaha <span className="ml-2 hidden sm:inline" aria-hidden="true">→</span>
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
