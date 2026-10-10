/**
 * Where the backend lives.
 *  - Local dev: leave VITE_API_URL empty; Vite serves /api on the same origin.
 *  - GitHub Pages: set VITE_API_URL to your hosted backend, e.g. https://taskpilot-api.onrender.com
 */
export const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(/\/+$/, "");

const TOKEN_KEY = "tp_admin_token";

export const adminToken = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t: string) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};
