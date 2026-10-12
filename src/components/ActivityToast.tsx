import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { callApi, type Activity } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

/**
 * Floating registration notification.
 *
 * Only ever displays REAL registration activity from the database —
 * aggregate counts and timestamps only, never personal information.
 * If there are no registrations, nothing is shown.
 * Off by default: switch it on in Admin → Content → "Registration popup".
 */
export function ActivityToast() {
  const { t, settings } = useI18n();

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return t("toast.now");
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return t("toast.min1");
    if (minutes < 60) return t("toast.mins", { n: minutes });
    const hours = Math.floor(minutes / 60);
    return hours === 1 ? t("toast.hour1") : t("toast.hours", { n: hours });
  };

  const [visible, setVisible] = useState(false);
  const [latest, setLatest] = useState<Date | null>(null);
  const seenRef = useRef<string | null>(null);
  const lastShownRef = useRef(0);

  const { data } = useQuery({
    queryKey: ["activity"],
    queryFn: () => callApi<Activity>("activity"),
    refetchInterval: 120_000,
    staleTime: 60_000,
    enabled: settings.popupEnabled,
  });

  useEffect(() => {
    if (!data?.latestAt) return;
    const latestAt = new Date(data.latestAt);
    const key = latestAt.toISOString();

    // First load: only surface genuinely fresh activity (< 3 minutes old).
    if (seenRef.current === null) {
      seenRef.current = key;
      if (Date.now() - latestAt.getTime() < 3 * 60 * 1000) {
        setLatest(latestAt);
        setVisible(true);
        lastShownRef.current = Date.now();
      }
      return;
    }

    // New registration arrived while browsing — show it (rate-limited).
    if (seenRef.current !== key) {
      seenRef.current = key;
      if (Date.now() - lastShownRef.current > 90_000) {
        setLatest(latestAt);
        setVisible(true);
        lastShownRef.current = Date.now();
      }
    }
  }, [data]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), settings.popupSeconds * 1000);
    return () => clearTimeout(timer);
  }, [visible, latest, settings.popupSeconds]);

  return (
    <AnimatePresence>
      {settings.popupEnabled && visible && latest && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-5 z-50 flex max-w-[300px] items-start gap-3.5 rounded-2xl border border-black/8 bg-white p-4 pr-5 shadow-float"
          role="status"
        >
          <span className="relative mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-soft">
            <span className="animate-soft-ping absolute inset-0 rounded-full bg-forest/30" />
            <Check size={16} strokeWidth={3} className="relative text-forest-deep" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{t("toast.title")}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink/55">
              {t("toast.body")}
            </p>
            <p className="mt-1.5 text-xs text-ink/40">{timeAgo(latest)}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
