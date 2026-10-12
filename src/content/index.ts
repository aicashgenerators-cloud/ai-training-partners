import { en, type Key } from "./en";
import { pt } from "./pt";
import { id } from "./id";
import { es } from "./es";
import { pl } from "./pl";

export type { Key };

export const LANGS = [
  { code: "en", name: "English", locale: "en", htmlLang: "en" },
  { code: "pt", name: "Português (Brasil)", locale: "pt-BR", htmlLang: "pt-BR" },
  { code: "id", name: "Bahasa Indonesia", locale: "id-ID", htmlLang: "id" },
  { code: "es", name: "Español (Argentina)", locale: "es-AR", htmlLang: "es-AR" },
  { code: "pl", name: "Polski", locale: "pl-PL", htmlLang: "pl" },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

export const DICTS: Record<LangCode, Record<Key, string>> = { en, pt, id, es, pl };
export const KEYS = Object.keys(en) as Key[];

export function isLang(v: unknown): v is LangCode {
  return LANGS.some((l) => l.code === v);
}

/** Numbers and switches the admin can change (shared by all five languages). */
export type Settings = {
  earningsAmount: number;
  earningsPeriod: "week" | "month";
  participantPct: number; // team share is always 100 - participantPct
  responseHours: number;
  popupEnabled: boolean;
  popupSeconds: number;
  showCommunity: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  earningsAmount: 300,
  earningsPeriod: "week",
  participantPct: 40,
  responseHours: 24,
  popupEnabled: false,
  popupSeconds: 7,
  showCommunity: false,
};

/** What the admin has changed. Anything missing falls back to the built-in copy. */
export type Overrides = {
  settings?: Partial<Settings>;
  text?: Partial<Record<LangCode, Record<string, string>>>;
};

const num = (v: unknown, min: number, max: number, fallback: number) => {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= min && n <= max ? n : fallback;
};
const bool = (v: unknown, fallback: boolean) =>
  v === true || v === "true" ? true : v === false || v === "false" ? false : fallback;

export function mergeSettings(o?: Partial<Settings> | null): Settings {
  const d = DEFAULT_SETTINGS;
  return {
    earningsAmount: num(o?.earningsAmount, 1, 100000, d.earningsAmount),
    earningsPeriod: o?.earningsPeriod === "month" ? "month" : "week",
    participantPct: num(o?.participantPct, 0, 100, d.participantPct),
    responseHours: num(o?.responseHours, 1, 720, d.responseHours),
    popupEnabled: bool(o?.popupEnabled, d.popupEnabled),
    popupSeconds: num(o?.popupSeconds, 3, 30, d.popupSeconds),
    showCommunity: bool(o?.showCommunity, d.showCommunity),
  };
}

export const GROUP_LABELS: Record<string, string> = {
  meta: "Page title",
  lang: "Language menu",
  nav: "Navigation",
  hero: "Hero (top of page)",
  mock: "Hero dashboard illustration",
  strip: "Scrolling strip",
  trust: "Trust cards",
  how: "How it works (steps)",
  sup: "Dedicated support",
  chat: "Support chat illustration",
  acc: "Responsibilities & account access",
  priv: "Privacy",
  why: "Hands-off benefit",
  earn: "Earnings & payouts",
  com: "Community counters",
  faq: "FAQ",
  fin: "Final call to action",
  ft: "Footer",
  reg: "Registration form",
  suc: "Confirmation page",
  toast: "Registration popup",
  period: "Period words",
  perPeriod: "Period words (\"per week\")",
};

export const groupOf = (key: string) => key.split(".")[0];
