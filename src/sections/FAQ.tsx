import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";
import { useT } from "@/lib/i18n";
import type { Key } from "@/content";

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border transition-colors duration-300 ${
        open ? "border-black/10 bg-white shadow-card" : "border-black/5 bg-white/60"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-8"
        aria-expanded={open}
      >
        <span className="text-[15px] font-medium text-ink sm:text-base">
          {q}
        </span>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
            open ? "bg-ink text-white" : "border border-black/10 text-ink/60"
          }`}
        >
          <motion.span
            initial={false}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="grid place-items-center"
          >
            {open ? <Minus size={16} /> : <Plus size={16} />}
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink/60 sm:px-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const COUNT = 10;

export function FAQ() {
  const t = useT();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = Array.from({ length: COUNT }, (_, i) => ({
    q: t(`faq.q${i + 1}` as Key),
    a: t(`faq.a${i + 1}` as Key),
  }));

  return (
    <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="mx-auto mt-4 font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            {t("faq.title")} <em className="text-forest-deep">{t("faq.titleEm")}</em>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink/60">
            {t("faq.sub")}
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FaqItem
                key={i}
                q={f.q}
                a={f.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
