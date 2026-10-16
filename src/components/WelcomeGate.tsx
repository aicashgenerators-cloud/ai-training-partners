import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useT } from "@/lib/i18n";

// Lives for as long as the page stays open, so moving around the site doesn't bring the popup back.
// A fresh visit (new page load from an ad link) shows it again.
let dismissed = false;

/**
 * The first thing a visitor sees: one message, one button, in the language of the link they used.
 * Edit the text in Admin → Website content → "Welcome popup".
 */
export function WelcomeGate() {
  const t = useT();
  const [open, setOpen] = useState(!dismissed);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // page behind can't scroll
    button.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => {
    dismissed = true;
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="welcome-gate"
          role="dialog"
          aria-modal="true"
          aria-label={t("gate.text")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/70 p-5 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-float sm:p-10"
          >
            <div className="flex justify-center">
              <Logo />
            </div>
            <p className="mt-8 font-serif-display text-[26px] leading-snug text-ink sm:text-3xl">
              {t("gate.text")}
            </p>
            <button
              ref={button}
              onClick={close}
              className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-4 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus-visible:ring-4 focus-visible:ring-forest/30"
            >
              {t("gate.button")}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
