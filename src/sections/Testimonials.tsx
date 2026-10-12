import { Sparkles, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { callApi, type Activity } from "@/lib/api";
import { Eyebrow, Reveal } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

/**
 * Real registration counters. Hidden by default; switch on in Admin → Content → "Show community counters".
 * No testimonials are shown until genuine, verified ones exist.
 */
export function Testimonials() {
  const { t, settings } = useI18n();

  const { data } = useQuery({
    queryKey: ["activity"],
    queryFn: () => callApi<Activity>("activity"),
    refetchInterval: 120_000,
    staleTime: 60_000,
    enabled: settings.showCommunity,
  });

  if (!settings.showCommunity) return null;

  const total = data?.total ?? 0;

  return (
    <section id="testimonials" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>{t("com.eyebrow")}</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            {t("com.title")} <em className="text-forest-deep">{t("com.titleEm")}</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/60">
            {t("com.body")}
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col items-center rounded-3xl border border-black/5 bg-white p-8 text-center shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-forest-soft text-forest-deep">
                <Users size={19} strokeWidth={1.8} />
              </span>
              <p className="mt-5 font-serif-display text-4xl text-ink">
                {total > 0 ? total.toLocaleString() : "—"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{t("com.statTotal")}</p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="flex h-full flex-col items-center rounded-3xl border border-black/5 bg-white p-8 text-center shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-forest-soft text-forest-deep">
                <Sparkles size={19} strokeWidth={1.8} />
              </span>
              <p className="mt-5 font-serif-display text-4xl text-ink">{data?.last24h ?? 0}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{t("com.stat24h")}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
