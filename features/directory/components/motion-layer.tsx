"use client";

import { useEffect } from "react";

/**
 * Turns on the entrance animations only when the browser can run them.
 * Content is never hidden by the base CSS, so a failed script leaves the page whole.
 */
export function MotionLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
