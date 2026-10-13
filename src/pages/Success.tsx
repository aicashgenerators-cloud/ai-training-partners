import { useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, PartyPopper, Smartphone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/lib/i18n";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Success() {
  const t = useT();
    useEffect(() => {
    if (sessionStorage.getItem("lead_tracked")) return;
    sessionStorage.setItem("lead_tracked", "1");
    (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("track", "Lead");
  }, []);
  const nextSteps = [
    { n: "01", body: t("suc.n1") },
    { n: "02", body: t("suc.n2") },
    { n: "03", body: t("suc.n3") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} />
            {t("reg.back")}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="text-center"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6, ease: easeOut }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest-soft text-forest-deep"
          >
            <PartyPopper size={26} strokeWidth={1.8} />
          </motion.span>

          <h1 className="mt-7 font-serif-display text-5xl leading-[1.05] text-ink sm:text-6xl">
            {t("suc.title")} <em className="text-forest-deep">{t("suc.titleEm")}</em>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink/60 sm:text-lg">
            {t("suc.body")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: easeOut }}
          className="mt-12 rounded-[28px] border border-black/8 bg-white p-8 shadow-float sm:p-10"
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
            {t("suc.nextTitle")}
          </h2>
          <ul className="mt-6 space-y-6">
            {nextSteps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.15, duration: 0.5, ease: easeOut }}
                className="flex items-start gap-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-black/5 bg-paper font-serif-display text-lg text-forest-deep">
                  {s.n}
                </span>
                <p className="pt-2 text-[15px] leading-relaxed text-ink/75">{s.body}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: easeOut }}
          className="mt-6 flex items-start gap-4 rounded-3xl border border-forest/20 bg-forest-soft/50 p-6"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-forest-deep shadow-card">
            <Smartphone size={17} />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-ink">{t("suc.phoneTitle")}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/60">{t("suc.phoneBody")}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <Link
            to="/"
            className="inline-block rounded-full bg-ink px-8 py-4 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            {t("suc.button")}
          </Link>
          <p className="flex items-center gap-1.5 text-xs text-ink/45">
            <BadgeCheck size={13} className="text-forest-deep" />
            {t("suc.footer")}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
