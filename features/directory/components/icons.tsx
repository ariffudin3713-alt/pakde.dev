import type { Category } from "@/lib/types";

interface IconProps {
  size?: number;
  className?: string;
}

export function SearchIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16.8 9.7a6.8 6.8 0 0 1-10.1 5.9L3 16.5l.9-3.5A6.8 6.8 0 1 1 16.8 9.7Z" />
      <path d="M7.2 7.1c.4 2.1 1.7 3.4 3.8 4.2l.8-.8 1.4.7c.3.2.3.7 0 .9-.6.5-1.2.7-2 .5-2.4-.6-4.8-2.6-5.3-4.8-.2-.7.1-1.3.5-1.8.3-.3.8-.2.9.2l.6 1.4-.7.8Z" />
    </svg>
  );
}

export function PinIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M13 6.7c0 3.2-5 7.7-5 7.7S3 9.9 3 6.7a5 5 0 1 1 10 0Z" />
      <circle cx="8" cy="6.5" r="1.5" />
    </svg>
  );
}

export function HeartIcon({ size = 20, filled = false, className = "" }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z" />
    </svg>
  );
}

export function StarIcon({ size = 16, filled = true, className = "" }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.1-5.6-3.2-5.6 3.2 1.3-6.1L3 9.6l6.3-.7Z" />
    </svg>
  );
}

export function RefreshIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.3 6.7" />
      <path d="M20 4v7h-7" />
    </svg>
  );
}

export function ArrowIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function PlusIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CloseIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ClockIcon({ size = 15, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function GlobeIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z" />
    </svg>
  );
}

/**
 * Category marks are drawn in one flat line language, in place of emoji:
 * every listing would otherwise wear a different pictogram from another family.
 */
export function CategoryMark({ category, tone = "bone" }: { category: Category; tone?: "bone" | "blood" }) {
  const stroke = tone === "bone" ? "var(--color-bone)" : "var(--color-blood)";
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {category === "Kuliner" && (
        <>
          <path d="M5 15h22a11 11 0 0 1-22 0Z" />
          <path d="M11 10c0-2 2-2 2-4M16 10c0-2 2-2 2-4M21 10c0-2 2-2 2-4" />
          <path d="M8 27h16" />
        </>
      )}
      {category === "Fashion" && (
        <>
          <path d="M16 8a2.5 2.5 0 1 0-2.5 2.5L4 19v4h24v-4L16 10.5" />
        </>
      )}
      {category === "Kerajinan" && (
        <>
          <path d="M6 13h20l-2 13H8Z" />
          <path d="M11 13c0-4 2-6 5-6s5 2 5 6M11 13v13M21 13v13" />
        </>
      )}
      {category === "Jasa" && (
        <>
          <path d="M20 6a6 6 0 0 0-5.6 8.2L6 22.6 9.4 26l8.4-8.4A6 6 0 0 0 26 12l-3.4 3.4-3.4-3.4Z" />
        </>
      )}
      {category === "Pertanian" && (
        <>
          <path d="M16 28V12" />
          <path d="M16 15c0-5-3-8-8-8 0 5 3 8 8 8ZM16 21c0-5 3-8 8-8 0 5-3 8-8 8Z" />
        </>
      )}
      {category === "Kesehatan" && (
        <>
          <path d="M16 27S5 20.5 5 13.5A5.5 5.5 0 0 1 16 11a5.5 5.5 0 0 1 11 2.5C27 20.5 16 27 16 27Z" />
          <path d="M10 16h3l2-4 2 8 2-4h3" />
        </>
      )}
      {category === "Pendidikan" && (
        <>
          <path d="M4 10 16 5l12 5-12 5Z" />
          <path d="M8 13v7c0 2 3.6 4 8 4s8-2 8-4v-7M28 10v8" />
        </>
      )}
      {category === "Lainnya" && (
        <>
          <path d="M6 11 16 5l10 6v10l-10 6-10-6Z" />
          <path d="M6 11l10 6 10-6M16 17v10" />
        </>
      )}
    </svg>
  );
}

export function HomeIcon({ size = 20, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m3 11 9-7 9 7v9H3Z" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

export function GridIcon({ size = 20, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </svg>
  );
}

export function UploadIcon({ size = 20, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v4h16v-4" />
    </svg>
  );
}
