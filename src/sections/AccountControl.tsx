import { Link } from "react-router";
import { KeyRound, Compass, Unplug } from "lucide-react";
import { Reveal } from "@/lib/motion";
import { useT } from "@/lib/i18n";

export function AccountControl() {
  const t = useT();

  const cards = [
    { icon: KeyRound, title: t("acc.c1.title"), body: t("acc.c1.body") },
    { icon: Compass, title: t("acc.c2.title"), body: t("acc.c2.body") },
    { icon: Unplug, title: t("acc.c3.title"), body: t("acc.c3.body") },
  ];

  return (
    <section className="px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-20 text-white sm:px-12 sm:py-28">
        <Reveal className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8FBFA3] sm:text-xs">
            {t("acc.eyebrow")}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif-display text-4xl leading-[1.08] sm:text-5xl">
            {t("acc.title")}{" "}
            <em className="text-[#8FBFA3]">{t("acc.titleEm")}</em>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60">
            {t("acc.body")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-colors duration-300 hover:bg-white/[0.07]">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[#8FBFA3]">
                  <c.icon size={19} strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-white/55">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-block rounded-full bg-white px-8 py-4 text-[15px] font-medium text-ink transition-all hover:-translate-y-0.5 hover:shadow-float"
          >
            {t("acc.cta")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
