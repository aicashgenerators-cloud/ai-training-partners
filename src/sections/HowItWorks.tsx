import { Link } from "react-router";
import { Eyebrow, Reveal } from "@/lib/motion";
import { useT } from "@/lib/i18n";
import type { Key } from "@/content";

const STEPS = [
  { n: "01", title: "how.s1.title", body: "how.s1.body" },
  { n: "02", title: "how.s2.title", body: "how.s2.body" },
  { n: "03", title: "how.s3.title", body: "how.s3.body" },
  { n: "04", title: "how.s4.title", body: "how.s4.body" },
  { n: "05", title: "how.s5.title", body: "how.s5.body" },
] as const satisfies readonly { n: string; title: Key; body: Key }[];

export function HowItWorks() {
  const t = useT();

  return (
    <section id="how-it-works" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>{t("how.eyebrow")}</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            {t("how.title")} <em className="text-forest-deep">{t("how.titleEm")}</em>
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {/* connecting line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden border-t border-dashed border-ink/15 lg:block"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i} className="relative">
              <div className="flex items-start gap-5 lg:block">
                <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-black/5 bg-white font-serif-display text-xl text-forest-deep shadow-card">
                  {s.n}
                </div>
                <div className="lg:mt-6">
                  <h3 className="text-lg font-semibold tracking-tight text-ink">
                    {t(s.title)}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/55">
                    {t(s.body)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Link
            to="/register"
            className="inline-block rounded-full bg-ink px-8 py-4 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            {t("how.cta")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
