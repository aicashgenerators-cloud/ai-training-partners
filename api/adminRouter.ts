import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { REGISTRATION_STATUSES } from "@contracts/types";
import { adminQuery, createRouter, publicQuery } from "./middleware";
import { checkPassword, clientIp, createLimiter, issueToken } from "./lib/auth";
import {
  deleteRegistration,
  listRegistrations,
  updateRegistration,
} from "./lib/excelStore";

// 5 failed logins per IP per 15 minutes.
const loginLimiter = createLimiter(5, 15 * 60 * 1000);

export const adminRouter = createRouter({
  login: publicQuery
    .input(z.object({ password: z.string().min(1).max(200) }))
    .mutation(({ input, ctx }) => {
      const ip = clientIp(ctx.req);
      if (!loginLimiter.take(ip)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many attempts. Try again in 15 minutes.",
        });
      }
      if (!checkPassword(input.password)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect password." });
      }
      loginLimiter.reset(ip);
      return { token: issueToken() };
    }),

  list: adminQuery.query(() => listRegistrations()),

  update: adminQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(REGISTRATION_STATUSES).optional(),
        assignedHandler: z.string().trim().max(120).optional(),
        notes: z.string().trim().max(2000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      const ok = await updateRegistration(id, patch);
      if (!ok) throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found." });
      return { ok: true as const };
    }),

  remove: adminQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const ok = await deleteRegistration(input.id);
      if (!ok) throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found." });
      return { ok: true as const };
    }),
});
