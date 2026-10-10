import { BadgeCheck, Lock, UserCheck } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";

const STRIP_ITEMS = [
  "Private Information",
  "Verified Handlers",
  "Account Control",
  "Personal Guidance",
];

const TRUST_CARDS = [
  {
    icon: BadgeCheck,
    title: "Verified Handlers",
    body: "Every handler is vetted and verified by our team before working with participants.",
  },
  {
    icon: Lock,
    title: "Private Information",
    body: "We only collect the information needed to connect you with your handler.",
  },
  {
    icon: UserCheck,
    title: "You're In Control",
    body: "Your account remains yours. You can disconnect your handler whenever you choose.",
  },
];

export function TrustStrip() {
  return (
    <section className="mt-24 sm:mt-32">
      {/* marquee */}
      <div className="marquee-mask overflow-hidden border-y border-black/5 py-5">
        <div className="animate-marquee flex w-max items-center gap-10 pr-10">
          {[...STRIP_ITEMS, ...STRIP_ITEMS, ...STRIP_ITEMS, ...STRIP_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className="flex items-center gap-10 whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.24em] text-ink/35"
              >
                {item}
                <span className="h-1 w-1 rounded-full bg-forest/50" />
              </span>
            ),
          )}
        </div>
      </div>

      {/* trust cards */}
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal className="text-center">
          <Eyebrow>A guided process</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            A real person. <em className="text-forest-deep">Your account.</em>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {TRUST_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i}>
              <div className="group h-full rounded-3xl border border-black/5 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-forest-soft text-forest-deep">
                  <c.icon size={19} strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                  {c.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink/55">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
