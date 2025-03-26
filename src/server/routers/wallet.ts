import { wallet, addressTags } from "../db/schema";
import { j, publicProcedure } from "../jstack";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const WalletRouter = j.router({
  getWallet: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx, c }) => {
      const { db } = ctx;
      const { address } = input;

      const rest = await db
        .select()
        .from(wallet)
        .where(eq(wallet.address, address));
      return c.superjson(rest);
    }),
  newWallet: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .mutation(async ({ input, ctx, c }) => {
      //create wallet to db once connected via walletconnect

      const { db } = ctx;
      const { address } = input;

      const newWallet = await db.insert(wallet).values({ address });
      return c.superjson(newWallet);
    }),
  getAllTagsByWalletAddress: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .query(async ({ input, ctx, c }) => {
      //gets all tags upon connection

      const { db } = ctx;
      const { address } = input;
      const tags = await db
        .select()
        .from(addressTags)
        .where(eq(addressTags.owner_id, address));
      return c.superjson(tags);
    }),
  createTag: publicProcedure
    .input(
      z.object({
        ownerAddress: z.string(),
        address: z.string(),
        tag: z.string(),
      })
    )
    .mutation(async ({ input, ctx, c }) => {
      const { db } = ctx;
      const { ownerAddress, address, tag } = input;
      const newTag = await db
        .insert(addressTags)
        .values({ address, tag, owner_id: ownerAddress });
      return c.superjson(newTag);
    }),
  selectTag: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx, c }) => {
      const { db } = ctx;
      const tags = await db
        .select()
        .from(addressTags)
        .where(eq(addressTags.id, input.id));
      return c.superjson(tags);
    }),
  updateTag: publicProcedure
    .input(
      z.object({
        ownerAddress: z.string(),
        address: z.string(),
        tag: z.string(),
      })
    )
    .mutation(async ({ input, ctx, c }) => {
      const { db } = ctx;
      const { ownerAddress, address, tag } = input;
      const newTag = await db
        .update(addressTags)
        .set({ tag: tag })
        .where(
          eq(addressTags.owner_id, ownerAddress) &&
            eq(addressTags.address, address)
        );
      return c.superjson(newTag);
    }),
});
