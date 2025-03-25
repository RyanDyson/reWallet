import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const wallet = pgTable("wallet", {
  id: integer().primaryKey().generatedByDefaultAsIdentity().unique(),
  address: text().unique().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});

export const Transaction = pgTable("transaction", {
  id: integer().generatedByDefaultAsIdentity().unique().notNull().primaryKey(),
  hash: text().unique().notNull(),
  from: text().notNull(),
  to: text(),
  value: text().notNull(),
  blockNumber: integer().notNull(),
  timestamp: timestamp().notNull(),
  type: text().notNull(),
  wallet_id: integer()
    .references(() => wallet.id)
    .notNull(),
});

export const AddressTag = pgTable("address_tag", {
  id: integer().primaryKey().generatedByDefaultAsIdentity().unique(),
  transaction_id: integer()
    .references(() => Transaction.id) // References the unique `id` column
    .notNull(),
  tag: text().notNull(),
});
