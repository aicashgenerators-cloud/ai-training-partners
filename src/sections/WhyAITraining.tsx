import { Handshake, Map, Wallet } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";
import { useT } from "@/lib/i18n";

export function WhyAITraining() {
  const t = useT();

  const cards = [
    { icon: Handshake, title: t("why.c1.title"), body: t("why.c1.body") },
    { icon: Map, title: t("why.c2.title"), body: t("why.c2.body") },
    { icon: Wallet, title: t("why.c3.title"), body: t("why.c3.body") },
  ];

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <Reveal>
            <Eyebrow>{t("why.eyebrow")}</Eyebrow>
            <h2 className="mt-4 font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
              {t("why.title")} <em className="text-forest-deep">{t("why.titleEm")}</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
              {t("why.body")}
            </p>
          </Reveal>

          <div className="grid gap-5">
            {cards.map((c, i) => (
              <Reveal key={i} delay={i}>
                <div className="group flex items-start gap-5 rounded-3xl border border-black/5 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:p-8">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-soft text-forest-deep">
                    <c.icon size={19} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-ink">{c.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/55">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-ink/40">
            {t("why.note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
