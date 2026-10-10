import { Link } from "react-router";
import { Eyebrow, Reveal } from "@/lib/motion";

const STEPS = [
  {
    n: "01",
    title: "Register",
    body: "Tell us how to contact you and submit your request to get started.",
  },
  {
    n: "02",
    title: "Get Connected",
    body: "You'll be connected directly with a dedicated handler who can answer your questions.",
  },
  {
    n: "03",
    title: "Get Guided",
    body: "Your handler walks you through the process and helps make each step clear.",
  },
  {
    n: "04",
    title: "Begin Your Journey",
    body: "Once you've completed the required onboarding steps, you can begin your AI training journey.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>The process</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            Getting Started Is <em className="text-forest-deep">Simple</em>
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* connecting line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden border-t border-dashed border-ink/15 lg:block"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i} className="relative">
              <div className="flex items-start gap-5 lg:block">
                <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-black/5 bg-white font-serif-display text-xl text-forest-deep shadow-card">
                  {s.n}
                </div>
                <div className="lg:mt-6">
                  <h3 className="text-lg font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/55">
                    {s.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Link
            to="/register"
            className="inline-block rounded-full bg-ink px-8 py-4 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            Start My Journey
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
