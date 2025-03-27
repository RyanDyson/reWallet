import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
// import { env } from "hono/adapter";
import { jstack } from "jstack";

interface Env {
  Bindings: { DATABASE_URL: string };
}

export const j = jstack.init<Env>();

/**
 * Type-safely injects database into all procedures
 *
 * @see https://jstack.app/docs/backend/middleware
 */
const databaseMiddleware = j.middleware(async ({ next }) => {
  // const { DATABASE_URL } = env(c)

  const sql = neon(process.env.DATABASE_URL as string);
  const db = drizzle(sql);

  return await next({ db });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware);
