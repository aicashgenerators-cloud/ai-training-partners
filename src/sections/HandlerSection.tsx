import { motion } from "framer-motion";
import { BadgeCheck, Check, ShieldCheck } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";

const BULLETS = [
  "Ask questions directly",
  "Get help with the next steps",
  "Understand what is required",
  "Get support during onboarding",
  "Have someone responsible for helping you through the process",
];

function ChatMock() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-float">
        {/* header */}
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-forest to-forest-deep text-xs font-semibold text-white">
                AM
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-forest" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Your Handler</p>
              <p className="flex items-center gap-1 text-xs text-forest-deep">
                <BadgeCheck size={12} />
                Verified
              </p>
            </div>
          </div>
          <ShieldCheck size={18} className="text-ink/25" />
        </div>

        {/* messages */}
        <div className="space-y-3 bg-paper/60 px-5 py-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-ink/80 shadow-card"
          >
            Hi! I'm here to help you through the onboarding process.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-ink/80 shadow-card"
          >
            What would you like to know?
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-ink px-4 py-3 text-sm leading-relaxed text-white"
          >
            How do I get started with the setup?
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.25, duration: 0.5 }}
            className="flex items-center gap-1.5 px-1 pt-1"
          >
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink/40" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink/40" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink/40" />
          </motion.div>
        </div>

        {/* footer strip */}
        <div className="flex items-center justify-between border-t border-black/5 px-6 py-3.5">
          <p className="text-xs text-ink/45">Replies on your preferred channel</p>
          <p className="flex items-center gap-1.5 text-xs font-medium text-forest-deep">
            <Check size={13} strokeWidth={3} />
            Verified
          </p>
        </div>
      </div>

      {/* floating verification badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute -bottom-5 -right-3 flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-lift sm:-right-8"
      >
        <BadgeCheck size={16} className="text-forest-deep" />
        <p className="text-xs font-semibold text-ink">Vetted by our team</p>
      </motion.div>
    </div>
  );
}

export function HandlerSection() {
  return (
    <section id="why-us" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>Dedicated support</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            You Don't Have To Figure It Out{" "}
            <em className="text-forest-deep">Alone</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <ChatMock />
          </Reveal>

          <Reveal delay={1}>
            <h3 className="font-serif-display text-3xl leading-tight text-ink sm:text-4xl">
              A Dedicated Person To Answer Your Questions
            </h3>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/60">
              After registration, you'll be connected directly with a handler
              assigned to help you through the process.
            </p>

            <ul className="mt-7 space-y-3.5">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest-soft text-forest-deep">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink/75">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-forest/25 bg-forest-soft/60 px-5 py-2.5">
              <BadgeCheck size={16} className="text-forest-deep" />
              <p className="text-sm font-medium text-forest-deep">
                Every handler is vetted and verified by our team.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
