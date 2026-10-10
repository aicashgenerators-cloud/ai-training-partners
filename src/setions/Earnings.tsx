import { Link } from "react-router";
import { motion } from "framer-motion";
import { CreditCard, Handshake } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";

const PAYMENT_METHODS = ["Airtm", "Bank Transfer", "PayPal"];

export function Earnings() {
  return (
    <section className="px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-black/5 bg-gradient-to-b from-white to-forest-soft/40 px-6 py-20 sm:px-12 sm:py-24">
        <Reveal className="text-center">
          <Eyebrow>Potential earnings</Eyebrow>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-center"
        >
          <p className="font-serif-display text-[96px] leading-none text-ink sm:text-[140px]">
            <span className="align-top text-[0.45em]">$</span>300
          </p>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-forest-deep">
            Potential Maximum
          </p>
        </motion.div>

        <Reveal className="text-center">
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ink/60">
            Depending on eligibility, available training work, and completed
            work, participants may have opportunities to earn up to $300.
          </p>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-ink/40">
            Earnings vary. This is not a guarantee of income or payment.
          </p>
          <Link
            to="/register"
            className="mt-9 inline-block rounded-full bg-ink px-8 py-4 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            Check My Eligibility
          </Link>
        </Reveal>

        {/* payment card */}
        <Reveal className="mx-auto mt-16 max-w-2xl">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-card sm:p-10">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-soft text-forest-deep">
                <CreditCard size={17} strokeWidth={1.8} />
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                Payment Options
              </h3>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/60">
              Based on the information you've provided for the program, the
              onboarding process can cover applicable payment methods such as:
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {PAYMENT_METHODS.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-black/10 bg-paper px-4 py-2 text-sm font-medium text-ink/75"
                >
                  {m}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 border-t border-black/5 pt-5">
              <Handshake size={16} className="mt-0.5 shrink-0 text-forest-deep" />
              <p className="text-sm leading-relaxed text-ink/55">
                Your handler will explain the applicable payment process and
                requirements during onboarding — including payment schedules for
                programs such as Handshake, where relevant.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
