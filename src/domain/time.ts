export const TIME_ZONE = "Europe/Berlin";
export const RELEASE_HOUR = 7;

const partsFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function berlinParts(at: Date) {
  const map = Object.fromEntries(partsFormat.formatToParts(at).map((p) => [p.type, p.value]));
  return {
    date: `${map.year}-${map.month}-${map.day}`,
    hour: Number(map.hour), minute: Number(map.minute), second: Number(map.second),
  };
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Der exakte Zeitpunkt, zu dem die Ausgabe eines Datums um 07:00 deutscher Zeit frei wird. */
export function releaseInstant(date: string): Date {
  const guess = new Date(`${date}T${String(RELEASE_HOUR).padStart(2, "0")}:00:00Z`);
  const local = berlinParts(guess);
  const localAsUtc = Date.parse(
    `${local.date}T${String(local.hour).padStart(2, "0")}:${String(local.minute).padStart(2, "0")}:00Z`,
  );
  return new Date(guess.getTime() - (localAsUtc - guess.getTime()));
}

/** Datum der Ausgabe, die jetzt gelten sollte: vor 07:00 noch die von gestern. */
export function currentIssueDate(now: Date): string {
  const { date, hour } = berlinParts(now);
  return hour >= RELEASE_HOUR ? date : addDays(date, -1);
}

/** Das Datum, das die Pipeline als Nächstes vorbereiten soll. */
export function nextIssueDate(now: Date): string {
  return addDays(currentIssueDate(now), 1);
}

export function formatGermanDate(date: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function formatGermanDateTime(at: Date | string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium", timeStyle: "short", timeZone: TIME_ZONE,
  }).format(new Date(at));
}
