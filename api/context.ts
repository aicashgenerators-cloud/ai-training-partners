import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { bearerFrom, verifyToken } from "./lib/auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  isAdmin: boolean;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    isAdmin: verifyToken(bearerFrom(opts.req)),
  };
}
