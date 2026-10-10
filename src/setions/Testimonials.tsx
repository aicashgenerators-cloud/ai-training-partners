import { Quote, Sparkles, Users } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Eyebrow, Reveal } from "@/lib/motion";

export function Testimonials() {
  const { data } = trpc.registration.activity.useQuery(undefined, {
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const total = data?.total ?? 0;

  return (
    <section id="testimonials" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>Community</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            Early Participants Are{" "}
            <em className="text-forest-deep">Joining Our Program</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/60">
            We're growing with real people, one guided onboarding at a time. As
            participants share their experiences, their stories will appear
            here — genuine words from verified participants only.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col items-center rounded-3xl border border-black/5 bg-white p-8 text-center shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-forest-soft text-forest-deep">
                <Users size={19} strokeWidth={1.8} />
              </span>
              <p className="mt-5 font-serif-display text-4xl text-ink">
                {total > 0 ? total.toLocaleString() : "—"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                Registrations received through this website
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="flex h-full flex-col items-center rounded-3xl border border-black/5 bg-white p-8 text-center shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-forest-soft text-forest-deep">
                <Sparkles size={19} strokeWidth={1.8} />
              </span>
              <p className="mt-5 font-serif-display text-4xl text-ink">
                {data?.last24h ?? 0}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                New participants in the last 24 hours
              </p>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="flex h-full flex-col items-center rounded-3xl border border-dashed border-ink/15 bg-paper p-8 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink/40 shadow-card">
                <Quote size={18} strokeWidth={1.8} />
              </span>
              <p className="mt-5 text-[15px] font-medium leading-relaxed text-ink/60">
                Your story could be here
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/45">
                Genuine testimonials from verified participants — coming as our
                community grows.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
