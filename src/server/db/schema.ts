import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const wallet = pgTable("wallet", {
  address: text().primaryKey(),
  name: text(),
  createdAt: timestamp().$default(() => new Date()),
  updatedAt: timestamp().$default(() => new Date()),
});

export const addressTags = pgTable("address_tags", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  address: text().notNull(),
  tag: text().notNull(),
  owner_id: text().references(() => wallet.address),
});

export type selectWallet = typeof wallet.$inferSelect;
export type selectAddressTags = typeof addressTags.$inferSelect;
