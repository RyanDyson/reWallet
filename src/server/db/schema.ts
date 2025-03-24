import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const wallet = pgTable("wallet", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  address: text().unique().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});

export const Transaction = pgTable("transaction", {});

export const AddressTag = pgTable("address_tag", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  address: text().unique().notNull(),
  tag: text().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});
