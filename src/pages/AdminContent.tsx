import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, RotateCcw, Search } from "lucide-react";
import { ApiError, callApi } from "@/lib/api";
import {
  DICTS,
  GROUP_LABELS,
  KEYS,
  LANGS,
  groupOf,
  mergeSettings,
  type Key,
  type LangCode,
  type Overrides,
} from "@/content";

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition-all focus:border-forest/60 focus:ring-4 focus:ring-forest/10";

type Draft = {
  earningsAmount: string;
  earningsPeriod: "week" | "month";
  participantPct: string;
  responseHours: string;
  popupEnabled: boolean;
  popupSeconds: string;
  showCommunity: boolean;
};

type TextMap = Record<LangCode, Record<string, string>>;

const GROUPS = Array.from(new Set(KEYS.map(groupOf)));

function Editor({
  initial,
  onUnauthorized,
}: {
  initial: Overrides;
  onUnauthorized: () => void;
}) {
  const queryClient = useQueryClient();
  const start = mergeSettings(initial.settings);

  const [draft, setDraft] = useState<Draft>({
    earningsAmount: String(start.earningsAmount),
    earningsPeriod: start.earningsPeriod,
    participantPct: String(start.participantPct),
    responseHours: String(start.responseHours),
    popupEnabled: start.popupEnabled,
    popupSeconds: String(start.popupSeconds),
    showCommunity: start.showCommunity,
  });
  const [text, setText] = useState<TextMap>(() => {
    const m = { en: {}, pt: {}, id: {}, es: {}, pl: {} } as TextMap;
    for (const l of LANGS) {
      const saved = initial.text?.[l.code] ?? {};
      for (const [k, v] of Object.entries(saved)) {
        if (k in DICTS[l.code] && v !== DICTS[l.code][k as Key]) m[l.code][k] = v;
      }
    }
    return m;
  });
  const [lang, setLang] = useState<LangCode>("en");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: (content: unknown) => callApi("saveContent", { content }, { auth: true }),
    onSuccess: () => {
      setSaved(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (e) => {
      if (e instanceof ApiError && e.code === "UNAUTHORIZED") return onUnauthorized();
      setSaved(false);
      setError(e.message || "Could not save. Please try again.");
    },
  });

  const setField = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setSaved(false);
  };

  const setValue = (key: Key, value: string) => {
    setText((prev) => {
      const next = { ...prev, [lang]: { ...prev[lang] } };
      if (value === DICTS[lang][key]) delete next[lang][key];
      else next[lang][key] = value;
      return next;
    });
    setSaved(false);
  };

  const reset = (key: Key) => {
    setText((prev) => {
      const next = { ...prev, [lang]: { ...prev[lang] } };
      delete next[lang][key];
      return next;
    });
    setSaved(false);
  };

  const q = search.trim().toLowerCase();
  const visibleKeys = useMemo(
    () =>
      KEYS.filter((k) => {
        if (!q) return true;
        const current = text[lang][k] ?? DICTS[lang][k];
        return k.toLowerCase().includes(q) || current.toLowerCase().includes(q);
      }),
    [q, lang, text],
  );

  const edited = (l: LangCode) => Object.keys(text[l]).length;

  const onSave = () => {
    const s = {
      earningsAmount: Number(draft.earningsAmount),
      earningsPeriod: draft.earningsPeriod,
      participantPct: Number(draft.participantPct),
      responseHours: Number(draft.responseHours),
      popupEnabled: draft.popupEnabled,
      popupSeconds: Number(draft.popupSeconds),
      showCommunity: draft.showCommunity,
    };
    if (!(s.earningsAmount >= 1 && s.earningsAmount <= 100000))
      return setError("Earnings amount must be between 1 and 100000.");
    if (!(s.participantPct >= 0 && s.participantPct <= 100))
      return setError("Participant percentage must be between 0 and 100.");
    if (!(s.responseHours >= 1 && s.responseHours <= 720))
      return setError("Response time must be between 1 and 720 hours.");
    if (!(s.popupSeconds >= 3 && s.popupSeconds <= 30))
      return setError("Popup display time must be between 3 and 30 seconds.");
    setError(null);
    save.mutate({ settings: s, text });
  };

  const teamPct = 100 - (Number(draft.participantPct) || 0);

  return (
    <div className="space-y-8">
      {/* key numbers */}
      <section className="rounded-2xl border border-black/8 bg-white p-6">
        <h2 className="font-serif-display text-2xl text-ink">Key numbers</h2>
        <p className="mt-1 text-sm text-ink/55">
          These update everywhere on the site, in all five languages, at the same time.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm font-medium text-ink">
            Potential earnings (USD)
            <input
              className={`${inputCls} mt-2`}
              inputMode="numeric"
              value={draft.earningsAmount}
              onChange={(e) => setField("earningsAmount", e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Earnings period
            <select
              className={`${inputCls} mt-2`}
              value={draft.earningsPeriod}
              onChange={(e) => setField("earningsPeriod", e.target.value as "week" | "month")}
            >
              <option value="week">Per week</option>
              <option value="month">Per month</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-ink">
            Participant share (%)
            <input
              className={`${inputCls} mt-2`}
              inputMode="numeric"
              value={draft.participantPct}
              onChange={(e) => setField("participantPct", e.target.value)}
            />
            <span className="mt-1.5 block text-xs font-normal text-ink/50">
              Team share is calculated automatically: {teamPct}%
            </span>
          </label>
          <label className="block text-sm font-medium text-ink">
            Handler response target (hours)
            <input
              className={`${inputCls} mt-2`}
              inputMode="numeric"
              value={draft.responseHours}
              onChange={(e) => setField("responseHours", e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* popup & sections */}
      <section className="rounded-2xl border border-black/8 bg-white p-6">
        <h2 className="font-serif-display text-2xl text-ink">Popup and optional sections</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <label className="flex items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={draft.popupEnabled}
              onChange={(e) => setField("popupEnabled", e.target.checked)}
            />
            <span>
              <span className="font-medium">Show "someone just registered" popup</span>
              <span className="mt-1 block text-xs text-ink/50">
                Only shows real, recent registrations (never personal details). Off by default.
              </span>
            </span>
          </label>
          <label className="block text-sm font-medium text-ink">
            Popup display time (seconds)
            <input
              className={`${inputCls} mt-2`}
              inputMode="numeric"
              value={draft.popupSeconds}
              onChange={(e) => setField("popupSeconds", e.target.value)}
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={draft.showCommunity}
              onChange={(e) => setField("showCommunity", e.target.checked)}
            />
            <span>
              <span className="font-medium">Show community counters section</span>
              <span className="mt-1 block text-xs text-ink/50">
                Shows real registration totals. Off by default.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* texts */}
      <section className="rounded-2xl border border-black/8 bg-white p-6">
        <h2 className="font-serif-display text-2xl text-ink">Website text</h2>
        <p className="mt-1 text-sm text-ink/55">
          Pick a language, then edit any text. Texts you haven't changed keep the built-in copy. You can
          use these tokens and they fill in automatically:{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">{"{amount}"}</code>{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">{"{perPeriod}"}</code>{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">{"{period}"}</code>{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">{"{participantPct}"}</code>{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">{"{teamPct}"}</code>{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">{"{hours}"}</code>
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                lang === l.code
                  ? "border-ink bg-ink text-white"
                  : "border-black/10 text-ink/70 hover:text-ink"
              }`}
            >
              {l.name}
              {edited(l.code) > 0 && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${
                    lang === l.code ? "bg-white/20" : "bg-forest-soft text-forest-deep"
                  }`}
                >
                  {edited(l.code)} edited
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              className={`${inputCls} pl-10`}
              placeholder="Search by text or by name, e.g. hero or earnings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <a
            href={`${import.meta.env.BASE_URL}${lang}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm text-ink/70 hover:text-ink"
          >
            <ExternalLink size={15} /> Open this language version
          </a>
        </div>

        <div className="mt-5 space-y-3">
          {GROUPS.map((g) => {
            const keys = visibleKeys.filter((k) => groupOf(k) === g);
            if (keys.length === 0) return null;
            const editedInGroup = keys.filter((k) => k in text[lang]).length;
            return (
              <details
                key={g}
                open={q !== "" ? true : undefined}
                className="group rounded-2xl border border-black/8 bg-paper/50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[15px] font-medium text-ink">
                  <span>
                    {GROUP_LABELS[g] ?? g}
                    <span className="ml-2 text-xs font-normal text-ink/40">{keys.length} texts</span>
                  </span>
                  {editedInGroup > 0 && (
                    <span className="rounded-full bg-forest-soft px-2.5 py-1 text-xs text-forest-deep">
                      {editedInGroup} edited
                    </span>
                  )}
                </summary>
                <div className="space-y-4 border-t border-black/5 px-5 py-5">
                  {keys.map((k) => {
                    const value = text[lang][k] ?? DICTS[lang][k];
                    const isEdited = k in text[lang];
                    return (
                      <div key={k}>
                        <div className="mb-1.5 flex items-center justify-between gap-3">
                          <label className="font-mono text-[11px] text-ink/45">{k}</label>
                          {isEdited && (
                            <button
                              onClick={() => reset(k)}
                              className="flex items-center gap-1 text-xs text-ink/50 hover:text-ink"
                            >
                              <RotateCcw size={12} /> Reset to original
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={Math.min(6, Math.max(1, Math.ceil(value.length / 90)))}
                          className={`${inputCls} resize-y ${isEdited ? "border-forest/50 bg-forest-soft/30" : ""}`}
                          value={value}
                          onChange={(e) => setValue(k, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}
          {visibleKeys.length === 0 && (
            <p className="py-8 text-center text-sm text-ink/50">No texts match your search.</p>
          )}
        </div>
      </section>

      {/* save bar */}
      <div className="sticky bottom-4 z-10 flex flex-col items-stretch gap-3 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-float backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-sm ${error ? "text-red-600" : saved ? "text-forest-deep" : "text-ink/50"}`}>
          {error ??
            (saved
              ? "Saved. Visitors will see the changes within about a minute."
              : "Changes are only published when you click Save.")}
        </p>
        <button
          onClick={onSave}
          disabled={save.isPending}
          className="flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {save.isPending && <Loader2 size={15} className="animate-spin" />}
          Save content
        </button>
      </div>
    </div>
  );
}

export default function AdminContent({ onUnauthorized }: { onUnauthorized: () => void }) {
  const q = useQuery({
    queryKey: ["content-admin"],
    queryFn: () => callApi<Overrides>("content"),
    staleTime: 0,
    gcTime: 0,
  });

  if (q.isLoading)
    return <p className="p-10 text-center text-sm text-ink/50">Loading content…</p>;
  if (q.isError)
    return (
      <p className="p-10 text-center text-sm text-red-600">
        Couldn't load content: {q.error.message}
      </p>
    );
  return <Editor key={q.dataUpdatedAt} initial={q.data} onUnauthorized={onUnauthorized} />;
}
