const PARIS = "Europe/Paris";

/**
 * Convertit une date+heure "murale" (ex. 15 septembre 2026, 09:00) exprimée
 * dans le fuseau donné en instant UTC correct, DST inclus. Nécessaire car
 * les fonctions serverless tournent en UTC : `new Date("...T09:00:00")`
 * n'y donnerait pas 9h à Paris.
 */
export function zonedTimeToUtc(
  dateStr: string, // "YYYY-MM-DD"
  timeStr: string, // "HH:mm"
  timeZone: string = PARIS
): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  // Hypothèse de départ : traiter l'heure murale comme si elle était déjà UTC.
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // On regarde ce que cet instant UTC donne une fois affiché dans le fuseau visé...
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(guess).map((p) => [p.type, p.value])
  );
  const shown = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute)
  );

  // ...puis on corrige l'écart entre ce qu'on voulait et ce qui a été affiché.
  const diff = guess.getTime() - shown;
  return new Date(guess.getTime() + diff);
}

/** Renvoie la clé "YYYY-MM-DD" d'une date telle que vue à Paris. */
export function toDateKeyInTimeZone(date: Date, timeZone: string = PARIS): string {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return dtf.format(date); // en-CA -> "YYYY-MM-DD"
}

/** Jour de la semaine (1 = lundi ... 7 = dimanche) tel que vu à Paris. */
export function isoWeekdayInTimeZone(date: Date, timeZone: string = PARIS): number {
  const dtf = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" });
  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };
  return map[dtf.format(date)];
}
