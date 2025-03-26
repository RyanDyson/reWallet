ALTER TABLE "transaction" DROP CONSTRAINT "transaction_id_unique";--> statement-breakpoint
ALTER TABLE "wallet" DROP CONSTRAINT "wallet_id_unique";--> statement-breakpoint
ALTER TABLE "address_tag" DROP CONSTRAINT "address_tag_transaction_id_transaction_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_wallet_id_wallet_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" ADD PRIMARY KEY ("hash");--> statement-breakpoint
ALTER TABLE "wallet" ADD PRIMARY KEY ("address");--> statement-breakpoint
ALTER TABLE "address_tag" ADD COLUMN "transaction_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "wallet_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "address_tag" ADD CONSTRAINT "address_tag_transaction_hash_transaction_hash_fk" FOREIGN KEY ("transaction_hash") REFERENCES "public"."transaction"("hash") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_wallet_address_wallet_address_fk" FOREIGN KEY ("wallet_address") REFERENCES "public"."wallet"("address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address_tag" DROP COLUMN "transaction_id";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "transaction" DROP COLUMN "wallet_id";--> statement-breakpoint
ALTER TABLE "wallet" DROP COLUMN "id";