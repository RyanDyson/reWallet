import { wallet } from "../db/schema";
import { j, publicProcedure } from "../jstack";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const WalletRouter = j.router({
  newWallet: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .mutation(async ({ input, ctx, c }) => {
      const { db } = ctx;
      const { address } = input;

      const temp = db.select().from(wallet).where(eq(wallet.address, address));
      console.log({ temp });
      if (temp != null) {
        //wallet already exists
        return;
      }

      const newWallet = await db.insert(wallet).values({ address });
      return c.superjson(newWallet);
    }),
});
