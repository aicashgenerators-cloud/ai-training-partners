import { createRouter, publicQuery } from "./middleware";
import { registrationRouter } from "./registrationRouter";
import { adminRouter } from "./adminRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  registration: registrationRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
