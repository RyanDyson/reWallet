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
  // mockTransactions,
  type Transaction,
} from "@/lib/types/mockTransactions";
import { useAccount } from "wagmi";
import { TransactionItem } from "./TransactionItem";
import { client as dbclient } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";

type WalletTransactionListProps = {
  walletAddress: string;
  setIncome?: Dispatch<SetStateAction<number>>;
  setOutcome?: Dispatch<SetStateAction<number>>;
  setPending?: Dispatch<SetStateAction<number>>;
};

export function WalletTransactionList({
  walletAddress,
  setIncome,
  setOutcome,
  setPending,
}: WalletTransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const client = usePublicClient();

  const { isConnected, address } = useAccount();
  let pending = 0;

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      if (isConnected && address) {
        const res = await dbclient.wallet.getAllTagsByWalletAddress.$get({
          address,
        });
        const tagsData = await res.json();

        // Create a hash map where the key is the address and the value is the tag
        const temp: Record<string, string> = {};
        tagsData.map((tag) => {
          temp[tag.address] = tag.tag;
        });

        return temp;
      }
    },
  });

  useWatchBlocks({
    enabled: isConnected,
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
    enabled: isConnected,
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

  // useEffect(() => {if (!isConnected) {
  //   watchBlocks();
  //   watchPending();

  // }}, [
  //   isConnected,
  //   walletAddress,
  //   client,
  //   setIncome,
  //   setOutcome,
  //   setPending,
  // ]);

  // if (!isConnected) {
  //   useDisconnect();
  // }

  console.log({ transactions });

  return (
    <div className="px-8 ">
      <h2 className="mb-2">Transactions List</h2>

      {transactions.length === 0 ? (
        <p className="text-neutral-400">
          No transactions detected yet. Waiting for new transactions...
        </p>
      ) : (
        <div className="w-full max-h-80 overflow-y-scroll flex flex-col gap-y-2 divide-y divide-neutral-800">
          {transactions.map((transaction, index) => {
            return (
              <TransactionItem
                tags={tags || {}}
                key={index}
                transaction={transaction}
                address={address || ""}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
