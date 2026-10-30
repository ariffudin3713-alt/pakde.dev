const WIB_OFFSET_MINUTES = 7 * 60;

/** Minutes since midnight in WIB (UTC+7), independent of the visitor's time zone. */
export function wibMinutes(date: Date = new Date()): number {
  const shifted = new Date(date.getTime() + (WIB_OFFSET_MINUTES + date.getTimezoneOffset()) * 60_000);
  return shifted.getHours() * 60 + shifted.getMinutes();
}

export function wibClock(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const rest = minutes % 60;
  return `${String(hours).padStart(2, "0")}.${String(rest).padStart(2, "0")}`;
}

/**
 * Reads the free-text opening hours stored on a listing ("08.00 - 21.00",
 * "Senin–Sabtu, 09.00–17.00", "24 jam"). Returns null when the text has no
 * usable range, so unknown listings are not silently reported as closed.
 */
export function isOpenNow(jamBuka: string, minutes: number): boolean | null {
  const value = (jamBuka ?? "").toLocaleLowerCase("id");
  if (!value.trim()) return null;
  if (/24\s*jam|sehari\s*penuh/.test(value)) return true;

  const match = value.match(/(\d{1,2})[.:](\d{2})\s*(?:-|–|—|sampai|s\.d\.)\s*(\d{1,2})[.:](\d{2})/);
  if (!match) return null;

  const start = Number(match[1]) * 60 + Number(match[2]);
  let end = Number(match[3]) * 60 + Number(match[4]);
  if (end <= start) end += 24 * 60;

  const now = minutes < start && end > 24 * 60 ? minutes + 24 * 60 : minutes;
  return now >= start && now < end;
}
