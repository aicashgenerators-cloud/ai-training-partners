import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const LINKS = [
  { label: "How It Works", href: `${import.meta.env.BASE_URL}#how-it-works` },
  { label: "Why Us", href: `${import.meta.env.BASE_URL}#why-us` },
  { label: "FAQ", href: `${import.meta.env.BASE_URL}#faq` },
  { label: "Testimonials", href: `${import.meta.env.BASE_URL}#testimonials` },
];

export function Navbar() {
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
              key={l.label}
              href={l.href}
              className="text-sm text-ink/70 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-px hover:shadow-lift sm:inline-block"
          >
            Get Started
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
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
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] text-ink/80 hover:bg-black/5"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
