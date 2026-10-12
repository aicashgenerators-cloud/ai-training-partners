import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { ApiError, callApi } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Key } from "@/content";
import { Logo } from "@/components/Logo";
import {
  CONTACT_OPTIONS,
  INTEREST_OPTIONS,
  registrationInputSchema,
  type RegistrationInput,
} from "@contracts/types";

// [ISO code, English name]. The English name is what gets saved to the sheet; the label shown is translated.
const COUNTRIES: [string, string][] = [
  ["NG", "Nigeria"], ["GH", "Ghana"], ["KE", "Kenya"], ["ZA", "South Africa"],
  ["UG", "Uganda"], ["TZ", "Tanzania"], ["RW", "Rwanda"], ["EG", "Egypt"],
  ["MA", "Morocco"], ["IN", "India"], ["PK", "Pakistan"], ["BD", "Bangladesh"],
  ["PH", "Philippines"], ["ID", "Indonesia"], ["VN", "Vietnam"],
  ["US", "United States"], ["CA", "Canada"], ["GB", "United Kingdom"],
  ["IE", "Ireland"], ["DE", "Germany"], ["FR", "France"], ["NL", "Netherlands"],
  ["ES", "Spain"], ["IT", "Italy"], ["PT", "Portugal"], ["PL", "Poland"],
  ["BR", "Brazil"], ["MX", "Mexico"], ["CO", "Colombia"], ["AR", "Argentina"],
  ["CL", "Chile"], ["AU", "Australia"], ["NZ", "New Zealand"],
  ["AE", "United Arab Emirates"], ["SA", "Saudi Arabia"], ["TR", "Turkey"],
];

function countryOptions(locale: string): { value: string; label: string }[] {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    names = null;
  }
  return COUNTRIES.map(([code, english]) => ({
    value: english,
    label: names?.of(code) ?? english,
  })).sort((a, b) => a.label.localeCompare(b.label, locale));
}

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
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const countries = countryOptions(locale);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: (values: RegistrationInput) => callApi("submit", values),
    onSuccess: () => navigate("/success"),
    onError: (e) => {
      const code = e instanceof ApiError ? e.code : undefined;
      setServerError(
        code === "TOO_MANY"
          ? t("reg.err.tooMany")
          : code === "NOT_CONFIGURED"
            ? t("reg.err.notReady")
            : t("reg.err.server"),
      );
    },
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
        if (!fieldErrors[key]) fieldErrors[key] = t(`reg.err.${key}` as Key) || t("reg.err.server");
      }
      if (!form.interest) fieldErrors.interest = t("reg.err.interest");
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
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} />
            {t("reg.back")}
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-14 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:pt-16">
        {/* left — reassurance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest-deep">
            {t("reg.eyebrow")}
          </p>
          <h1 className="mt-4 font-serif-display text-4xl leading-[1.08] text-ink sm:text-5xl">
            {t("reg.title")} <em className="text-forest-deep">{t("reg.titleEm")}</em>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/60">
            {t("reg.body")}
          </p>

          <ul className="mt-9 space-y-5">
            {[
              { icon: BadgeCheck, title: t("reg.p1.title"), body: t("reg.p1.body") },
              { icon: Lock, title: t("reg.p2.title"), body: t("reg.p2.body") },
              { icon: ShieldCheck, title: t("reg.p3.title"), body: t("reg.p3.body") },
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
              <Field label={t("reg.fullName")} error={errors.fullName}>
                <input
                  className={inputCls}
                  placeholder={t("reg.fullName.ph")}
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  autoComplete="name"
                />
              </Field>

              <Field label={t("reg.email")} error={errors.email}>
                <input
                  type="email"
                  className={inputCls}
                  placeholder={t("reg.email.ph")}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  autoComplete="email"
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label={t("reg.phone")} error={errors.phone}>
                  <input
                    type="tel"
                    className={inputCls}
                    placeholder={t("reg.phone.ph")}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    autoComplete="tel"
                  />
                </Field>

                <Field label={t("reg.country")} error={errors.country}>
                  <select
                    className={`${inputCls} ${form.country ? "" : "text-ink/35"}`}
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    <option value="" disabled>
                      {t("reg.country.ph")}
                    </option>
                    {countries.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                    <option value="Other">{t("reg.country.other")}</option>
                  </select>
                </Field>
              </div>

              <Field label={t("reg.interest")} error={errors.interest}>
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
                      {t(`reg.interest.${o.value}` as Key)}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={t("reg.contact")}>
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
                      {t(`reg.contact.${o.value}` as Key)}
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label={t("reg.message")}
                error={errors.message}
              >
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder={t("reg.message.ph")}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </Field>
            </div>

            <p className="mt-6 rounded-2xl border border-forest/20 bg-forest-soft/50 px-4 py-3 text-[13px] leading-relaxed text-ink/70">
              {t("reg.notice")}
            </p>

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
              {submit.isPending ? t("reg.sending") : t("reg.button")}
            </button>

            <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-ink/45">
              <Lock size={12} className="mt-0.5 shrink-0" />
              {t("reg.privacy")}
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
