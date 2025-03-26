import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const wallet = pgTable("wallet", {
  address: text().primaryKey(),
  name: text(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});

export const Transaction = pgTable("transaction", {
  hash: text().unique().notNull().primaryKey(),
  from: text().notNull(),
  to: text(),
  value: text().notNull(),
  blockNumber: integer().notNull(),
  timestamp: timestamp().notNull(),
  type: text().notNull(),
  wallet_address: text()
    .references(() => wallet.address)
    .notNull(),
});

export const AddressTag = pgTable("address_tag", {
  id: integer().primaryKey().generatedByDefaultAsIdentity().unique(),
  transaction_hash: text()
    .references(() => Transaction.hash) // References the unique `id` column
    .notNull(),
  tag: text().notNull(),
});

export type selectTransaction = typeof Transaction.$inferSelect;
export type selectWallet = typeof wallet.$inferSelect;
export type selectTags = typeof AddressTag.$inferSelect;
