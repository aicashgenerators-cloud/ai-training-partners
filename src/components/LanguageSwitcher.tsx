import { Globe } from "lucide-react";
import { useNavigate } from "react-router";
import { useI18n } from "@/lib/i18n";
import { LANGS, isLang } from "@/content";

/** On the home page the language also changes the address (/pt, /es …) so each version can be shared. */
export function LanguageSwitcher({ goToVersion = false }: { goToVersion?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();

  return (
    <label className="relative inline-flex items-center">
      <Globe
        size={15}
        className="pointer-events-none absolute left-3 text-ink/50"
        aria-hidden="true"
      />
      <select
        aria-label={t("lang.label")}
        value={lang}
        onChange={(e) => {
          const v = e.target.value;
          if (!isLang(v)) return;
          setLang(v);
          if (goToVersion) navigate(`/${v}`);
        }}
        className="appearance-none rounded-full border border-black/10 bg-white/70 py-2 pl-9 pr-4 text-sm text-ink/80 outline-none transition-colors hover:border-black/20 focus:border-forest/60"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </label>
  );
}
