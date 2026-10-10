import { Link } from "react-router";
import { Reveal } from "@/lib/motion";

export function FinalCTA() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif-display text-[40px] leading-[1.06] text-ink sm:text-6xl">
          Ready To Start Your{" "}
          <em className="text-forest-deep">AI Training Journey?</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ink/60 sm:text-lg">
          Register today and get connected with a verified handler who can
          guide you through the process.
        </p>
        <Link
          to="/register"
          className="mt-9 inline-block rounded-full bg-ink px-10 py-4 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          Get Started
        </Link>
        <p className="mt-5 text-sm text-ink/45">
          Registration takes only a few minutes.
        </p>
      </Reveal>
    </section>
  );
}
