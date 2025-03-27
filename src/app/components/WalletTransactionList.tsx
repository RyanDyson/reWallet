"use client";
import React, { useEffect, useState } from "react";
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

interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  confirmations: string;
}

interface EtherscanResponse {
  status: string;
  message: string;
  result: EtherscanTransaction[];
}

export function WalletTransactionList({
  walletAddress,
  setIncome,
  setOutcome,
  setPending,
}: WalletTransactionListProps) {
  //formatted transactions for ui display
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  //wagmi client
  const client = usePublicClient();

  const { isConnected, address } = useAccount();
  let pending = 0;

  //api call is server only, so wrap in useQuery from react-query
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      if (isConnected && address) {
        //api call to db to get all tags
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

  //usewatchblocks and usependingtransactions opens websocket connection to blockchain via wagmi
  //both hooks only fetch recent transactions (i.e. transactions that happen while the websocket connection is open)
  //watch for new blocks on the blockhain
  useWatchBlocks({
    enabled: isConnected, //only watch if walletConnect is connected
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

          // calculate and update income, outgoing for the stats
          let income: number = 0;
          let outgoing: number = 0;
          formattedTransactions.map((tx) => {
            if (tx.to === walletAddress) {
              income += parseFloat(tx.value);
            } else if (tx.from === walletAddress) {
              outgoing += parseFloat(tx.value);
            }
          });

          // set transactions, income, outgoing
          setTransactions((prev) => [...formattedTransactions, ...prev]);
          if (setIncome) {
            setIncome(income);
          }
          if (setOutcome) {
            setOutcome(outgoing);
          }
        }
      } catch (error) {
        //create sonner when error
        toast(<div>{error as string}</div>);
      }
    },
  });

  //watch for pending transactions on the blockchain
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

  //fetches historical transactions
  useEffect(() => {
    if (isConnected && walletAddress) {
      const fetchHistoricalTransactions = async () => {
        try {
          //validates wallet address to match etherscan api
          if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            throw new Error("Invalid wallet address format");
          }
          // Etherscan API URL
          const apikey = process.env.NEXT_PUBLIC_ETHER_SCAN_API_KEY;
          const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${apikey}`;

          const controller = new AbortController();

          // Fetch data from Etherscan
          const response = await fetch(apiUrl, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data: EtherscanResponse = await response.json();

          if (data.status === "1") {
            // Process and format the transactions
            const historicalTxs = data.result.map((tx) => ({
              hash: tx.hash,
              from: tx.from,
              to: tx.to === "" ? null : tx.to,
              value: formatEther(BigInt(tx.value)),
              blockNumber: BigInt(tx.blockNumber),
              timestamp: parseInt(tx.timeStamp) * 1000, // Convert to milliseconds
            }));

            // Add historical transactions to state
            setTransactions((prevTxs) => {
              // Combine without duplicates
              const existingHashes = new Set(prevTxs.map((tx) => tx.hash));
              const history = historicalTxs
                .map((tx) => {
                  if (tx.to === walletAddress) {
                    //if to wallet, then incoming
                    if (setIncome) {
                      setIncome(
                        (prevIncome) => prevIncome + parseFloat(tx.value)
                      );
                    }
                    return { ...tx, type: "incoming" as const };
                  }

                  //if from wallet, then outgoing
                  if (setOutcome) {
                    setOutcome(
                      (prevOutcome) => prevOutcome + parseFloat(tx.value)
                    );
                  }
                  return { ...tx, type: "outgoing" as const };
                })
                .filter((tx) => !existingHashes.has(tx.hash)); // Filter out undefined values

              const newTxs = [...prevTxs, ...history];
              return newTxs;
            });
          } else {
            throw new Error(`Etherscan API error: ${data.message}`);
          }
        } catch (error) {
          console.log(error);
          toast("Failed to fetch historical transactions");
        }
      };

      fetchHistoricalTransactions();
    }
  }, [walletAddress, isConnected, setIncome, setOutcome]);

  // Manually disconnect WebSockets when isConnected changes to false

  // Format and sort transactions for display based on transaction date
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  console.log({ transactions });

  return (
    <div className="px-8 ">
      <h2 className="mb-2">Transactions List</h2>

      {sortedTransactions.length === 0 ? (
        <p className="text-neutral-400">
          No transactions detected yet. Waiting for new transactions...
        </p>
      ) : (
        <div className="w-full max-h-80 overflow-y-scroll flex flex-col gap-y-2 divide-y divide-neutral-800">
          {sortedTransactions.map((transaction, index) => {
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
