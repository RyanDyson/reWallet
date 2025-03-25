"use client";
import React, { useState } from "react";
import {
  usePublicClient,
  useWatchBlocks,
  useWatchPendingTransactions,
} from "wagmi";
import { formatEther } from "viem";
import { toast } from "sonner";
import { type Dispatch, type SetStateAction } from "react";
import {
  mockTransactions,
  type Transaction,
} from "@/lib/types/mockTransactions";
import { Edit, ArrowDown, ArrowUp, Clock } from "lucide-react";

type WalletTransactionListProps = {
  walletAddress: string;
  setIncome?: Dispatch<SetStateAction<number>>;
  setOutcome?: Dispatch<SetStateAction<number>>;
  setPending?: Dispatch<SetStateAction<number>>;
};

// format date for ui
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export function WalletTransactionList({
  walletAddress,
  setIncome,
  setOutcome,
  setPending,
}: WalletTransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const client = usePublicClient();
  let pending = 0;

  useWatchBlocks({
    onBlock: async (block) => {
      try {
        // get full block with transactions
        const fBlock = await client?.getBlock({
          blockNumber: block.number,
          includeTransactions: true,
        });

        // gets transaction from block with address prop
        const transactions = fBlock?.transactions.filter(
          (tx) =>
            typeof tx === "object" &&
            (tx.from?.toLowerCase() === walletAddress.toLowerCase() ||
              (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase()))
        );

        // checks for transactions
        if (transactions && transactions.length > 0) {
          //format transactions

          const formattedTransactions = transactions
            .map((tx) => {
              if (typeof tx === "object") {
                return {
                  hash: tx.hash,
                  from: tx.from,
                  to: tx.to,
                  value: formatEther(tx.value || BigInt(0)),
                  blockNumber: block.number,
                  timestamp: Date.now(),
                  type:
                    tx.from?.toLowerCase() === walletAddress.toLowerCase()
                      ? "outgoing"
                      : "incoming",
                };
              }
              return null;
            })
            .filter((tx) => tx !== null) as Transaction[];

          let income: number = 0;
          let outgoing: number = 0;
          formattedTransactions.map((tx) => {
            if (tx.to === walletAddress) {
              income += parseFloat(tx.value);
            } else if (tx.from === walletAddress) {
              outgoing += parseFloat(tx.value);
            }
          });

          // set transactions
          setTransactions((prev) => [...formattedTransactions, ...prev]);
          if (setIncome) {
            setIncome(income);
          }
          if (setOutcome) {
            setOutcome(outgoing);
          }
        }
      } catch (error) {
        toast(<div>{error as string}</div>);
      }
    },
  });

  useWatchPendingTransactions({
    onTransactions: async (hashes) => {
      try {
        for (const hash of hashes) {
          const transaction = await client?.getTransaction({ hash });

          //check if transaction is from our wallet
          if (
            transaction?.from.toLowerCase() === walletAddress.toLowerCase() ||
            (transaction?.to &&
              transaction.to.toLowerCase() === walletAddress.toLowerCase())
          ) {
            const newTransaction: Transaction = {
              hash: transaction.hash,
              from: transaction.from,
              to: transaction.to,
              value: formatEther(transaction.value || BigInt(0)),
              blockNumber: transaction.blockNumber || BigInt(0),
              timestamp: Date.now(),
              type: "pending",
            };
            pending += 1;
            if (setPending) {
              setPending(pending);
            }

            //set new pending transcation
            setTransactions((prev) => {
              if (!prev.some((t) => t.hash === newTransaction.hash)) {
                return [newTransaction, ...prev];
              }
              return prev;
            });
          }
        }
      } catch (error) {
        toast(<div>{error as string}</div>);
      }
    },
  });

  console.log(transactions);

  return (
    <div className="px-8 ">
      <h2 className="mb-2">Transactions List</h2>

      {mockTransactions.length === 0 ? (
        <p className="text-neutral-400">
          No transactions detected yet. Waiting for new transactions...
        </p>
      ) : (
        <div className="w-full max-h-96 overflow-y-scroll flex flex-col gap-y-2 divide-y divide-neutral-800">
          {mockTransactions.map((transaction, index) => (
            <TransactionItem key={index} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
}

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div className="p-2 flex flex-col gap-y-2">
      <div className="w-full flex gap-x-2 items-center justify-between">
        {transaction.type === "incoming" && (
          <div className="flex gap-x-1 items-center w-min rounded-full px-3 py-0.5 border border-emerald-800 bg-emerald-950/60">
            <ArrowDown className="w-4 h-4" />
            Incoming
          </div>
        )}
        {transaction.type === "outgoing" && (
          <div className="flex gap-x-1 items-center w-min rounded-full px-3 py-0.5 border border-indigo-800 bg-indigo-950/60">
            <ArrowUp className="w-4 h-4" />
            Outgoing
          </div>
        )}
        {transaction.type === "pending" && (
          <div className="flex gap-x-1 items-center w-min rounded-full px-3 py-0.5 border border-neutral-800 bg-neutral-950/60">
            <Clock className="w-4 h-4" />
            Pending
          </div>
        )}
        <p className="flex items-center gap-x-2 text-neutral-400 text-sm">
          {formatDate(transaction.timestamp)}
          <Edit className="justify-self-end h-4 w-4 text-neutral-400 cursor-pointer hover:text-neutral-200 transition-colors" />
        </p>
      </div>
      <div className="flex gap-x-2">
        <div className="rounded-sm border-neutral-800 border p-2 max-w-1/3 w-full overflow-x-scroll">
          <p className="text-neutral-400">From</p>{" "}
          <p className="truncate">{transaction.from}</p>
        </div>
        <div className="rounded-sm border-neutral-800 border p-2 max-w-1/3 w-full overflow-x-scroll">
          <p className="text-neutral-400">To</p>{" "}
          <p className="truncate">{transaction.to || "Contract Creation"}</p>
        </div>
        <div className="rounded-sm border-neutral-800 border p-2 max-w-1/3 w-full overflow-x-scroll">
          <p className="text-neutral-400">Value</p>{" "}
          <p className="text-emerald-400">{transaction.value} ETH</p>
        </div>
      </div>
      <div className="flex gap-x-2 items-center">
        <div className="w-min rounded-full px-3 py-0.5 border border-neutral-800 bg-neutral-950/60">
          Hash
        </div>
        {transaction.hash}
      </div>
      <div className="flex gap-x-2 items-center">
        <div className="w-min rounded-full px-3 py-0.5 border border-neutral-800 bg-neutral-950/60">
          Block
        </div>
        {transaction.blockNumber.toString()}
      </div>
    </div>
  );
};
