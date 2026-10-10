import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware";
import { registrationInputSchema } from "@contracts/types";
import { addRegistration, getActivity } from "./lib/excelStore";
import { clientIp, createLimiter } from "./lib/auth";

// 10 submissions per IP per hour.
const submitLimiter = createLimiter(10, 60 * 60 * 1000);

export const registrationRouter = createRouter({
  submit: publicQuery
    .input(registrationInputSchema)
    .mutation(async ({ input, ctx }) => {
      if (!submitLimiter.take(clientIp(ctx.req))) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many submissions. Please try again later.",
        });
      }
      return addRegistration(input);
    }),

  activity: publicQuery.query(() => getActivity()),
});
