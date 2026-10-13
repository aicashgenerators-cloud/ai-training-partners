type Fbq = (...args: unknown[]) => void;

/**
 * Tells the Meta Pixel that someone just registered (a "Lead").
 * Called the moment the form is accepted, so it does not depend on the confirmation page loading.
 * Safe to call if the pixel is missing or blocked: it simply does nothing.
 */
export function trackLead(language: string) {
  const fire = () => {
    const fbq = (window as unknown as { fbq?: Fbq }).fbq;
    if (!fbq) return false;
    fbq("track", "Lead", { content_name: language });
    return true;
  };

  if (fire()) return;

  // The pixel script may still be loading: try again for a few seconds.
  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    if (fire() || tries >= 10) window.clearInterval(timer);
  }, 500);
}
