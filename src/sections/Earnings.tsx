import { Link } from "react-router";
import { motion } from "framer-motion";
import { CreditCard, Handshake, Percent } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

export function Earnings() {
  const { t, settings } = useI18n();
  const methods = [t("earn.m1"), t("earn.m2"), t("earn.m3")].filter(Boolean);
  const you = settings.participantPct;
  const team = 100 - you;

  return (
    <section id="earnings" className="scroll-mt-24 px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-black/5 bg-gradient-to-b from-white to-forest-soft/40 px-6 py-20 sm:px-12 sm:py-24">
        <Reveal className="text-center">
          <Eyebrow>{t("earn.eyebrow")}</Eyebrow>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-ink/45">
            {t("earn.upTo")}
          </p>
          <p className="mt-1 font-serif-display text-[96px] leading-none text-ink sm:text-[140px]">
            <span className="align-top text-[0.45em]">$</span>
            {settings.earningsAmount.toLocaleString()}
          </p>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-forest-deep">
            {t("earn.perLabel")}
          </p>
        </motion.div>

        <Reveal className="text-center">
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ink/60">
            {t("earn.body")}
          </p>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-ink/40">
            {t("earn.disclaimer")}
          </p>
          <Link
            to="/register"
            className="mt-9 inline-block rounded-full bg-ink px-8 py-4 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            {t("earn.cta")}
          </Link>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl gap-5 lg:grid-cols-2">
          {/* revenue split card */}
          <Reveal>
            <div className="h-full rounded-3xl border border-black/5 bg-white p-8 shadow-card sm:p-10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-soft text-forest-deep">
                  <Percent size={17} strokeWidth={1.8} />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-ink">
                  {t("earn.splitTitle")}
                </h3>
              </div>

              <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-line" aria-hidden="true">
                <div className="bg-forest" style={{ width: `${you}%` }} />
                <div className="bg-ink" style={{ width: `${team}%` }} />
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="font-medium text-forest-deep">
                  {t("earn.splitYou")} · {you}%
                </span>
                <span className="font-medium text-ink">
                  {t("earn.splitTeam")} · {team}%
                </span>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink/55">{t("earn.splitBody")}</p>
            </div>
          </Reveal>

          {/* payout card */}
          <Reveal delay={1}>
            <div className="h-full rounded-3xl border border-black/5 bg-white p-8 shadow-card sm:p-10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-soft text-forest-deep">
                  <CreditCard size={17} strokeWidth={1.8} />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-ink">
                  {t("earn.payTitle")}
                </h3>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/60">{t("earn.payBody")}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {methods.map((m, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-black/10 bg-paper px-4 py-2 text-sm font-medium text-ink/75"
                  >
                    {m}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-3 border-t border-black/5 pt-5">
                <Handshake size={16} className="mt-0.5 shrink-0 text-forest-deep" />
                <p className="text-sm leading-relaxed text-ink/55">{t("earn.payNote")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
