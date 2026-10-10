import { Check, Info, X } from "lucide-react";
import { Eyebrow, Reveal } from "@/lib/motion";

const COLLECT = [
  "Name",
  "Email",
  "Phone / WhatsApp number",
  "Basic information needed to understand your request",
];

const NEVER_ASK = [
  "Passwords",
  "OTP codes",
  "Banking PINs",
  "Payment passwords",
  "Account login credentials",
];

export function PrivacySection() {
  return (
    <section id="privacy" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>Your privacy matters</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            Built Around Privacy &{" "}
            <em className="text-forest-deep">Transparency</em>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/60">
            We don't need unnecessary personal information just to connect you
            with a handler. The information submitted through this website is
            used to process your request and connect you with the appropriate
            handler.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-black/5 bg-white p-8 shadow-card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-forest-deep">
                What we collect on this website
              </h3>
              <ul className="mt-5 space-y-3.5">
                {COLLECT.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest-soft text-forest-deep">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-ink/75">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="h-full rounded-3xl border border-black/5 bg-white p-8 shadow-card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/50">
                What we don't ask for on this website
              </h3>
              <ul className="mt-5 space-y-3.5">
                {NEVER_ASK.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink/8 text-ink/45">
                      <X size={12} strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-ink/55">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-8 max-w-4xl">
          <div className="flex items-start gap-4 rounded-3xl border border-forest/20 bg-forest-soft/50 p-6 sm:p-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-forest-deep shadow-card">
              <Info size={16} />
            </span>
            <p className="text-[15px] leading-relaxed text-ink/70">
              Any additional information that may be required during a later
              onboarding process will be explained to you by your handler{" "}
              <span className="font-medium text-ink">
                before you provide it.
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
