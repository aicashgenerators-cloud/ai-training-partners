import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";

const FAQS = [
  {
    q: "What happens after I register?",
    a: "You'll be connected directly with a handler who can answer your questions and guide you through the next steps.",
  },
  {
    q: "Who is my handler?",
    a: "Your handler is someone who has been vetted and verified by our team to assist participants through the onboarding process.",
  },
  {
    q: "Do I have to give my account to someone?",
    a: "Your account remains under your control. Your handler's role is to guide and assist you through the process.",
  },
  {
    q: "Can I disconnect my handler?",
    a: "Yes. You can choose to disconnect your handler at any point.",
  },
  {
    q: "What information do you collect?",
    a: "This website is designed to collect the basic information needed to process your registration and connect you with a handler.",
  },
  {
    q: "Will my information be kept private?",
    a: "Yes. Information submitted through this website is handled according to our privacy practices and is used for the purposes explained during registration.",
  },
  {
    q: "How much can I earn?",
    a: "Earnings vary. Depending on eligibility, available work, and completed work, opportunities may provide earnings of up to $300. Earnings are not guaranteed.",
  },
  {
    q: "When will I receive payment?",
    a: "Your handler will explain the applicable payment schedule and requirements for your specific onboarding process.",
  },
  {
    q: "Is this guaranteed income?",
    a: "No. AI training opportunities depend on eligibility, available work, completed work, and other conditions.",
  },
];

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

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mx-auto mt-4 font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            Frequently Asked <em className="text-forest-deep">Questions</em>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink/60">
            We're here to answer your questions about registration, handlers,
            privacy, and earnings.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem
                key={f.q}
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
