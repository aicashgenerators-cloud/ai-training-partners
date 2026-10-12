import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/lib/i18n";
import type { Key } from "@/content";

const LINKS: { key: Key; href: string }[] = [
  { key: "nav.how", href: "#how-it-works" },
  { key: "nav.earnings", href: "#earnings" },
  { key: "nav.why", href: "#why-us" },
  { key: "nav.faq", href: "#faq" },
];

export function Navbar() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="text-sm text-ink/70 transition-colors hover:text-ink"
            >
              {t(l.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher goToVersion />
          <Link
            to="/register"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-px hover:shadow-lift sm:inline-block"
          >
            {t("nav.cta")}
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={t("nav.menu")}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-paper px-5 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] text-ink/80 hover:bg-black/5"
              >
                {t(l.key)}
              </a>
            ))}
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-white"
            >
              {t("nav.cta")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
