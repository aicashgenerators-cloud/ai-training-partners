import { Link } from "react-router";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0">
      <span
        className={`grid h-8 w-8 place-items-center rounded-full ${
          dark ? "bg-white text-ink" : "bg-ink text-white"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </span>
      <span
        className={`text-[17px] font-semibold tracking-tight ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        TaskPilot<span className="text-forest"> AI</span>
      </span>
    </Link>
  );
}
