import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Loader2, Lock, ShieldCheck } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Logo } from "@/components/Logo";
import {
  CONTACT_OPTIONS,
  INTEREST_OPTIONS,
  registrationInputSchema,
  type RegistrationInput,
} from "@contracts/types";

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Uganda", "Tanzania", "Rwanda",
  "Egypt", "Morocco", "India", "Pakistan", "Bangladesh", "Philippines",
  "Indonesia", "Vietnam", "United States", "Canada", "United Kingdom",
  "Ireland", "Germany", "France", "Netherlands", "Spain", "Italy", "Portugal",
  "Poland", "Brazil", "Mexico", "Colombia", "Argentina", "Chile", "Australia",
  "New Zealand", "United Arab Emirates", "Saudi Arabia", "Turkey", "Other",
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  interest: RegistrationInput["interest"] | "";
  preferredContact: RegistrationInput["preferredContact"];
  message: string;
};

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  interest: "",
  preferredContact: "whatsapp",
  message: "",
};

const inputCls =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/35 outline-none transition-all focus:border-forest/60 focus:ring-4 focus:ring-forest/10";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-[13px] text-red-600">{error}</p>}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = trpc.registration.submit.useMutation({
    onSuccess: () => navigate("/success"),
    onError: (e) =>
      setServerError(
        e.message ||
          "Something went wrong while submitting. Please try again.",
      ),
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);

    const parsed = registrationInputSchema.safeParse({
      ...form,
      interest: form.interest || undefined,
      message: form.message || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      if (!form.interest)
        fieldErrors.interest = "Please select what you're interested in";
      setErrors(fieldErrors);
      return;
    }

    submit.mutate(parsed.data);
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* top bar */}
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-14 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:pt-16">
        {/* left — reassurance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest-deep">
            Registration
          </p>
          <h1 className="mt-4 font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            Let's Get You <em className="text-forest-deep">Connected</em>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/60">
            Tell us how to reach you. We'll connect you with a verified handler
            who will answer your questions and guide you through the next
            steps.
          </p>

          <ul className="mt-9 space-y-5">
            {[
              {
                icon: BadgeCheck,
                title: "Verified handlers",
                body: "Every handler is vetted and verified by our team.",
              },
              {
                icon: Lock,
                title: "Minimal information",
                body: "We only ask for what's needed to connect you.",
              },
              {
                icon: ShieldCheck,
                title: "You stay in control",
                body: "Your account remains yours — disconnect anytime.",
              },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-soft text-forest-deep">
                  <item.icon size={17} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink/55">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* right — form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[28px] border border-black/8 bg-white p-7 shadow-float sm:p-10"
          >
            <div className="space-y-6">
              <Field label="Full Name" error={errors.fullName}>
                <input
                  className={inputCls}
                  placeholder="Enter your name"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  autoComplete="name"
                />
              </Field>

              <Field label="Email Address" error={errors.email}>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  autoComplete="email"
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="WhatsApp / Phone Number" error={errors.phone}>
                  <input
                    type="tel"
                    className={inputCls}
                    placeholder="+234 ..."
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    autoComplete="tel"
                  />
                </Field>

                <Field label="Country" error={errors.country}>
                  <select
                    className={`${inputCls} ${form.country ? "" : "text-ink/35"}`}
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    <option value="" disabled>
                      Select your country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="What are you interested in?" error={errors.interest}>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {INTEREST_OPTIONS.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      onClick={() => set("interest", o.value)}
                      className={`rounded-2xl border px-4 py-3.5 text-left text-[15px] transition-all ${
                        form.interest === o.value
                          ? "border-forest bg-forest-soft/70 font-medium text-ink"
                          : "border-black/10 bg-white text-ink/65 hover:border-black/20"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Preferred contact method">
                <div className="flex gap-2.5">
                  {CONTACT_OPTIONS.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      onClick={() => set("preferredContact", o.value)}
                      className={`flex-1 rounded-2xl border px-4 py-3.5 text-[15px] transition-all ${
                        form.preferredContact === o.value
                          ? "border-forest bg-forest-soft/70 font-medium text-ink"
                          : "border-black/10 bg-white text-ink/65 hover:border-black/20"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label="What would you like help with? (optional)"
                error={errors.message}
              >
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder="Tell us anything that would help your handler prepare…"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </Field>
            </div>

            {serverError && (
              <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submit.isPending}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-60"
            >
              {submit.isPending && <Loader2 size={17} className="animate-spin" />}
              {submit.isPending ? "Connecting…" : "Connect Me With A Handler"}
            </button>

            <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-ink/45">
              <Lock size={12} className="mt-0.5 shrink-0" />
              By submitting this form, you agree to our Privacy Policy and allow
              us to contact you regarding your registration.
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
