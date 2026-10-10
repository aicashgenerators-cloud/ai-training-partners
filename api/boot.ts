import fs from "node:fs";
import path from "node:path";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { bearerFrom, verifyToken } from "./lib/auth";
import { exportWorkbookBuffer } from "./lib/excelStore";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 1 * 1024 * 1024 }));

app.use(
  "/api/*",
  cors({
    origin: env.allowedOrigins.includes("*") ? "*" : env.allowedOrigins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    maxAge: 86400,
  }),
);

app.get("/api/health", (c) => c.json({ ok: true }));

// Download the live Excel file (admin only).
app.get("/api/admin/export.xlsx", async (c) => {
  if (!verifyToken(bearerFrom(c.req.raw))) return c.json({ error: "Unauthorized" }, 401);
  const buf = await exportWorkbookBuffer();
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="registrations-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");

  // Optional: if a built frontend sits next to the server, serve it too.
  // (Not needed when the site is hosted on GitHub Pages.)
  if (fs.existsSync(path.resolve("./dist/public/index.html"))) {
    const { serveStaticFiles } = await import("./lib/vite");
    serveStaticFiles(app);
  }

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`API running on http://localhost:${port}/`);
  });
}
