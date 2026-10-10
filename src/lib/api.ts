/**
 * Talks to your Google Apps Script web app (the "backend" that saves to Google Sheets).
 * Set VITE_SHEETS_URL to the Web app URL that ends in /exec.
 */
export const SHEETS_URL = ((import.meta.env.VITE_SHEETS_URL as string | undefined) ?? "").trim();

const TOKEN_KEY = "tp_admin_token";

export const adminToken = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t: string) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

export async function callApi<T>(
  action: string,
  data: Record<string, unknown> = {},
  opts: { auth?: boolean } = {},
): Promise<T> {
  if (!SHEETS_URL) {
    throw new ApiError("The registration service isn't connected yet.", "NOT_CONFIGURED");
  }
  const body = JSON.stringify({
    action,
    ...data,
    ...(opts.auth ? { token: adminToken.get() ?? "" } : {}),
  });

  let json: { ok: boolean; data?: T; error?: string; code?: string };
  try {
    // text/plain keeps this a "simple" request, so the browser doesn't need CORS preflight (Apps Script can't answer one).
    const res = await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
    json = await res.json();
  } catch {
    throw new ApiError("Couldn't reach the registration service. Please try again.", "NETWORK");
  }
  if (!json.ok) throw new ApiError(json.error || "Something went wrong.", json.code);
  return json.data as T;
}

export type Activity = { last24h: number; total: number; latestAt: string | null };
