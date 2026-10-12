import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { callApi } from "@/lib/api";
import {
  DICTS,
  DEFAULT_SETTINGS,
  LANGS,
  isLang,
  mergeSettings,
  type Key,
  type LangCode,
  type Overrides,
  type Settings,
} from "@/content";

const LANG_KEY = "tp_lang";
const CONTENT_KEY = "tp_content_v1";

function detectLang(): LangCode {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = (navigator.languages?.[0] || navigator.language || "en").toLowerCase();
  if (nav.startsWith("pt")) return "pt";
  if (nav.startsWith("id") || nav.startsWith("in")) return "id";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("pl")) return "pl";
  return "en";
}

function readCachedContent(): Overrides | undefined {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    return raw ? (JSON.parse(raw) as Overrides) : undefined;
  } catch {
    return undefined;
  }
}

type Vars = Record<string, string | number>;

type I18n = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  locale: string;
  settings: Settings;
  overrides: Overrides;
  t: (key: Key, vars?: Vars) => string;
};

const Ctx = createContext<I18n | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detectLang);

  const setLang = useCallback((l: LangCode) => {
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
    setLangState(l);
  }, []);

  const { data } = useQuery({
    queryKey: ["content"],
    queryFn: () => callApi<Overrides>("content"),
    staleTime: 5 * 60_000,
    initialData: readCachedContent,
    initialDataUpdatedAt: 0,
  });

  useEffect(() => {
    if (!data) return;
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const meta = LANGS.find((l) => l.code === lang)!;
  const settings = useMemo(() => mergeSettings(data?.settings ?? DEFAULT_SETTINGS), [data]);
  const overrides = useMemo<Overrides>(() => data ?? {}, [data]);

  const t = useCallback(
    (key: Key, vars?: Vars) => {
      const raw = (k: Key) => overrides.text?.[lang]?.[k] || DICTS[lang][k] || DICTS.en[k] || "";
      const money = new Intl.NumberFormat(meta.locale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(settings.earningsAmount);
      const base: Vars = {
        amount: money,
        period: raw(`period.${settings.earningsPeriod}` as Key),
        perPeriod: raw(`perPeriod.${settings.earningsPeriod}` as Key),
        participantPct: `${settings.participantPct}%`,
        teamPct: `${100 - settings.participantPct}%`,
        hours: settings.responseHours,
      };
      const all = { ...base, ...vars };
      return raw(key).replace(/\{(\w+)\}/g, (m, name: string) =>
        name in all ? String(all[name]) : m,
      );
    },
    [lang, meta.locale, overrides, settings],
  );

  useEffect(() => {
    document.documentElement.lang = meta.htmlLang;
    document.title = t("meta.title");
  }, [meta.htmlLang, t]);

  const value = useMemo<I18n>(
    () => ({ lang, setLang, locale: meta.locale, settings, overrides, t }),
    [lang, setLang, meta.locale, settings, overrides, t],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <ContentProvider>");
  return v;
}

export const useT = () => useI18n().t;
