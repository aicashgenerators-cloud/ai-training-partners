import { Link } from "react-router";
import { Reveal } from "@/lib/motion";
import { useT } from "@/lib/i18n";

export function FinalCTA() {
  const t = useT();

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif-display text-[40px] leading-[1.06] text-ink sm:text-6xl">
          {t("fin.title")} <em className="text-forest-deep">{t("fin.titleEm")}</em>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
          {t("fin.body")}
        </p>
        <Link
          to="/register"
          className="mt-9 inline-block rounded-full bg-ink px-10 py-4 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          {t("fin.button")}
        </Link>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink/45">
          {t("fin.note")}
        </p>
      </Reveal>
    </section>
  );
}
