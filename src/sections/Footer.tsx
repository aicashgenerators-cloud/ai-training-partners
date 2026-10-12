import { Link } from "react-router";
import { Instagram, MessageCircle, Send } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useT } from "@/lib/i18n";
import type { Key } from "@/content";

type FooterLink = { key: Key; href?: string; to?: string };

const COLUMNS: { title: Key; links: FooterLink[] }[] = [
  {
    title: "ft.company",
    links: [
      { key: "ft.about", href: "#why-us" },
      { key: "ft.how", href: "#how-it-works" },
      { key: "ft.faq", href: "#faq" },
      { key: "ft.contact", to: "/register" },
    ],
  },
  {
    title: "ft.support",
    links: [
      { key: "ft.help", href: "#faq" },
      { key: "ft.privacy", href: "#privacy" },
      { key: "ft.terms", href: "#" },
    ],
  },
];

const SOCIALS = [
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Instagram, label: "Instagram" },
  { icon: Send, label: "Telegram" },
];

export function Footer() {
  const t = useT();
  const linkCls = "text-[15px] text-ink/55 transition-colors hover:text-ink";

  return (
    <footer className="border-t border-black/5 px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-ink/55">
              {t("ft.tagline")}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink">{t(col.title)}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.key}>
                    {l.to ? (
                      <Link to={l.to} className={linkCls}>
                        {t(l.key)}
                      </Link>
                    ) : (
                      <a href={l.href} className={linkCls}>
                        {t(l.key)}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-ink">{t("ft.social")}</h4>
            <div className="mt-4 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-ink/60 transition-all hover:border-ink/30 hover:text-ink"
                >
                  <s.icon size={17} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 sm:flex-row">
          <p className="text-sm text-ink/45">{t("ft.rights")}</p>
          <p className="text-xs text-ink/35">{t("ft.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
