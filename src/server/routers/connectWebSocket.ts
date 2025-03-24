import { SetStateAction, type Dispatch } from "react";
import { type transaction } from "@/lib/types/mockTransactions";

type args = {
  WsConnected: boolean;
  address: string;
  setWsConnected: Dispatch<SetStateAction<boolean>>;
  setTransactions: Dispatch<SetStateAction<transaction[]>>;
};

export const connectWebSocket = ({
  WsConnected,
  setWsConnected,
  address,
  setTransactions,
}: args) => {
  // In a real app, this would connect to your WebSocket server
  // const ws = new WebSocket(`wss://your-backend.com/ws/transactions/${address}`)

  // Mock WebSocket connection for demonstration
  setTimeout(() => {
    setWsConnected(true);
    // toast({
    //   title: "WebSocket Connected",
    //   description: "Now streaming new transactions",
    // });

    // Simulate receiving new transactions
    const interval = setInterval(() => {
      const newTransaction = {
        id: `0x${Math.random().toString(16).slice(2)}`,
        from:
          Math.random() > 0.5
            ? address
            : `0x${Math.random().toString(16).slice(2, 42)}`,
        to:
          Math.random() > 0.5
            ? address
            : `0x${Math.random().toString(16).slice(2, 42)}`,
        value: (Math.random() * 0.5).toFixed(4),
        timestamp: Date.now(),
        status: "pending",
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      //   toast({
      //     title: "New Transaction",
      //     description: `${newTransaction.value} ETH ${newTransaction.from.slice(
      //       0,
      //       6
      //     )}...${newTransaction.from.slice(-4)} → ${newTransaction.to.slice(
      //       0,
      //       6
      //     )}...${newTransaction.to.slice(-4)}`,
      //   });
    }, 30000); // New transaction every 30 seconds

    return () => clearInterval(interval);
  }, 2000);
};
