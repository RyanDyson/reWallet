"use client";
import React, { useState } from "react";
import {
  usePublicClient,
  useWatchBlocks,
  useWatchPendingTransactions,
} from "wagmi";
import { formatEther } from "viem";
import { toast } from "sonner";

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: bigint;
  timestamp: number;
}

type WalletTransactionListProps = {
  walletAddress: string;
};

//formate date for ui
// const formatDate = (timestamp: number) => {
//   const date = new Date(timestamp);
//   return date.toLocaleString();
// };

export function WalletTransactionList({
  walletAddress,
}: WalletTransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const client = usePublicClient();

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
                };
              }
              return null;
            })
            .filter((tx) => tx !== null) as Transaction[];

          // set transactions
          setTransactions((prev) => [...formattedTransactions, ...prev]);
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
            };
            setTransactions((prev) => {
              if (!prev.some((t) => t.hash === newTransaction.hash)) {
                return [newTransaction, ...prev];
              }
              return prev;
            });
          }

          //set new transcation
        }
      } catch (error) {
        toast(<div>{error as string}</div>);
      }
    },
  });

  return (
    <div>
      <h2>Wallet Transactions</h2>
      <p>Monitoring address: {walletAddress}</p>

      {transactions.length === 0 ? (
        <p>No transactions detected yet. Waiting for new transactions...</p>
      ) : (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.hash}>
              <div>Hash: {tx.hash}</div>
              <div>From: {tx.from}</div>
              <div>To: {tx.to || "Contract Creation"}</div>
              <div>Value: {tx.value} ETH</div>
              <div>Block #: {tx.blockNumber.toString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
