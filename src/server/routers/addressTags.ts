import { AddressTag } from "../db/schema";
import { j, publicProcedure } from "../jstack";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const AddressTagRouter = j.router({
  getAllAddressTagByTransactionHash: publicProcedure
    .input(
      z.object({
        transactionHash: z.string(),
      })
    )
    .get(async ({ input, ctx, c }) => {
      const { db } = ctx;
      const { transactionHash } = input;

      const temp = db
        .select()
        .from(AddressTag)
        .where(eq(AddressTag.transaction_hash, transactionHash));

      return c.superjson(temp);
    }),
  createTag: publicProcedure
    .input(
      z.object({
        transaction_hash: z.string(),
        tag: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { transaction_hash, tag } = input;

      await db.insert(AddressTag).values({ transaction_hash, tag });
    }),
});
