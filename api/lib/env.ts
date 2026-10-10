import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

function required(name: string): string {
  const value = process.env[name];
  if (!value && isProduction) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  isProduction,
  /** Password for the /admin panel. */
  adminPassword: required("ADMIN_PASSWORD") || "change-me-locally",
  /** Long random string used to sign admin session tokens. */
  tokenSecret: required("ADMIN_TOKEN_SECRET") || "dev-only-secret-change-me",
  /** Folder that holds registrations.xlsx. Must be on persistent storage in production. */
  dataDir: process.env.DATA_DIR || "./data",
  /**
   * Comma separated list of origins allowed to call the API,
   * e.g. "https://yourname.github.io,https://www.yourdomain.com".
   * Use "*" to allow any origin (not recommended in production).
   */
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};
