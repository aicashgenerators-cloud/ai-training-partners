import { CalendarClock, Map, Wallet } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";

const CARDS = [
  {
    icon: CalendarClock,
    title: "Flexible Opportunity",
    body: "Explore AI training opportunities based on your eligibility and available work.",
  },
  {
    icon: Map,
    title: "Guided Onboarding",
    body: "You don't have to navigate the process alone.",
  },
  {
    icon: Wallet,
    title: "Weekly Earnings",
    body: "Eligible participants may receive payments based on completed work and the applicable payment arrangements.",
  },
];

export function WhyAITraining() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <Reveal>
            <Eyebrow>The opportunity</Eyebrow>
            <h2 className="mt-4 font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
              Why <em className="text-forest-deep">AI Training?</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
              AI systems need human feedback and training to improve. AI
              training work can involve tasks that help improve the quality,
              accuracy, and usefulness of AI systems.
            </p>
          </Reveal>

          <div className="grid gap-5">
            {CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i}>
                <div className="group flex items-start gap-5 rounded-3xl border border-black/5 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:p-8">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-soft text-forest-deep">
                    <c.icon size={19} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-ink">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/55">
                      {c.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-ink/40">
            Earnings are not guaranteed. Any earnings figures shown represent
            potential earnings and can vary based on eligibility, available
            work, completed tasks, and applicable conditions.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
