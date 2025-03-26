import { Transaction } from "../db/schema";
import { j, publicProcedure } from "../jstack";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const TransactionRouter = j.router({
  newTransaction: publicProcedure
    .input(
      z.object({
        hash: z.string(),
        from: z.string(),
        to: z.string().nullable(),
        value: z.string(),
        blockNumber: z.number(),
        timestamp: z.date(),
        type: z.string(),
        wallet_address: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      //checks if transaction already exists
      const temp = db
        .select()
        .from(Transaction)
        .where(eq(Transaction.hash, input.hash));

      if (temp != null) {
        console.log("Transaction aldready exists");
        throw new Error("Transaction already exists");
        return;
      }

      await db.insert(Transaction).values(input);
    }),
});
