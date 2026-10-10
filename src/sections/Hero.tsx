import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowDown, BadgeCheck, Check, Circle, Lock } from "lucide-react";
import { Eyebrow } from "@/lib/motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

const heroItem = {
  hidden: { opacity: 0, y: 26 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut, delay: 0.08 * i },
  }),
};

const JOURNEY_STEPS = [
  { label: "Registration", done: true },
  { label: "Handler Connected", done: true },
  { label: "Account Setup", done: false },
  { label: "Training", done: false },
];

function DashboardCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: easeOut, delay: 0.45 }}
      className="relative mx-auto mt-16 w-full max-w-3xl"
    >
      {/* main dashboard card */}
      <div className="relative overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-float">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E8E8E4]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E8E8E4]" />
            <span className="h-2.5 w-2.5 rounded-full bg-forest/60" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
            TaskPilot Dashboard
          </p>
        </div>

        <div className="grid gap-8 px-6 py-7 sm:grid-cols-2 sm:px-10 sm:py-10">
          {/* journey checklist */}
          <div>
            <h3 className="font-serif-display text-2xl text-ink sm:text-[28px]">
              Your AI Journey
            </h3>
            <ul className="mt-5 space-y-3.5">
              {JOURNEY_STEPS.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.18, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  {s.done ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-forest text-white">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  ) : (
                    <Circle size={24} className="text-ink/20" strokeWidth={1.5} />
                  )}
                  <span
                    className={`text-[15px] ${
                      s.done ? "font-medium text-ink" : "text-ink/45"
                    }`}
                  >
                    {s.label}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* progress bar */}
            <div className="mt-7">
              <div className="flex items-center justify-between text-xs text-ink/50">
                <span>Onboarding progress</span>
                <span className="font-medium text-ink">Step 2 of 4</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "50%" }}
                  transition={{ delay: 1.4, duration: 1.1, ease: easeOut }}
                  className="h-full rounded-full bg-gradient-to-r from-forest to-[#6FA98C]"
                />
              </div>
            </div>
          </div>

          {/* handler panel */}
          <div className="rounded-2xl border border-black/5 bg-paper p-5 sm:p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
              Your dedicated handler
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-forest to-forest-deep text-sm font-semibold text-white">
                  AM
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-paper bg-forest" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Ade M.</p>
                <p className="flex items-center gap-1 text-xs text-forest-deep">
                  <BadgeCheck size={13} />
                  Verified Handler
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5 }}
              className="mt-4 rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-ink/80 shadow-card"
            >
              “I’m here if you have any questions about the next steps.”
            </motion.div>
            <div className="mt-3 flex items-center gap-1.5 pl-1">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink/40" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink/40" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink/40" />
            </div>
          </div>
        </div>
      </div>

      {/* floating badge — verified handler */}
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ delay: 1.3, duration: 0.7, ease: easeOut }}
        className="absolute -left-4 -top-6 hidden items-center gap-2.5 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-lift sm:flex lg:-left-14"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-soft text-forest-deep">
          <BadgeCheck size={16} />
        </span>
        <div>
          <p className="text-xs font-semibold text-ink">Handler Verified</p>
          <p className="text-[11px] text-ink/50">Vetted by our team</p>
        </div>
      </motion.div>

      {/* floating badge — account control */}
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: 2.5 }}
        transition={{ delay: 1.5, duration: 0.7, ease: easeOut }}
        className="absolute -bottom-6 -right-4 hidden items-center gap-2.5 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-lift sm:flex lg:-right-14"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white">
          <Lock size={14} />
        </span>
        <div>
          <p className="text-xs font-semibold text-ink">Your Account</p>
          <p className="text-[11px] text-ink/50">Always under your control</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-32 sm:px-8 sm:pt-40">
      {/* soft ambient gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(69,139,100,0.10) 0%, rgba(69,139,100,0.03) 45%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <motion.div variants={heroItem} custom={0} initial="hidden" animate="visible">
          <Eyebrow>AI Training Opportunities</Eyebrow>
        </motion.div>

        <motion.h1
          variants={heroItem}
          custom={1}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-4xl font-serif-display text-[44px] leading-[1.04] text-ink sm:text-6xl lg:text-[76px]"
        >
          Start Your AI Training Journey With{" "}
          <em className="text-forest-deep">Expert Guidance</em>
        </motion.h1>

        <motion.p
          variants={heroItem}
          custom={2}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg"
        >
          Getting started with AI training can feel complicated. We connect you
          with a verified handler who guides you through the process, answers
          your questions, and helps make your onboarding simple.
        </motion.p>

        <motion.div
          variants={heroItem}
          custom={3}
          initial="hidden"
          animate="visible"
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/register"
            className="w-full rounded-full bg-ink px-8 py-4 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift sm:w-auto"
          >
            Get Started
          </Link>
          <a
            href="#how-it-works"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-8 py-4 text-[15px] font-medium text-ink transition-colors hover:border-ink/30 sm:w-auto"
          >
            How It Works
            <ArrowDown size={16} />
          </a>
        </motion.div>

        <motion.p
          variants={heroItem}
          custom={4}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-7 flex max-w-md items-start justify-center gap-2 text-xs leading-relaxed text-ink/45 sm:text-[13px]"
        >
          <Lock size={13} className="mt-0.5 shrink-0" />
          Your information is used to connect you with your assigned handler.
          You remain in control of your account.
        </motion.p>

        <DashboardCard />
      </div>
    </section>
  );
}
