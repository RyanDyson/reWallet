"use client";

import { useState, useEffect } from "react";
import { WalletConnection } from "@/components/wallet-connection";
import { TransactionHistory } from "@/components/transaction-history";
import { AddressTagging } from "@/components/address-tagging";
import { TransactionStats } from "@/components/transaction-stats";
import { toast } from "sonner";
import { ToastItem } from "@/components/toast-item";
// import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { type transaction } from "@/lib/types/mockTransactions";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [addressTags, setAddressTags] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  // const { toast } = useToast()

  // Handle wallet connection
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);

    // Fetch initial transaction history
    fetchTransactionHistory(address);

    // Connect to WebSocket for streaming transactions
    connectWebSocket(address);

    // Fetch saved address tags
    fetchAddressTags(address);

    const res = {
      title: "Wallet Connected",
      description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
    };

    toast(<ToastItem {...res} />);
  };

  // Fetch transaction history
  const fetchTransactionHistory = async (address: string) => {
    try {
      // In a real app, this would be an API call to your backend
      // const response = await fetch(`/api/transactions/${address}`)
      // const data = await response.json()

      // Mock data for demonstration
      const mockTransactions = [
        {
          id: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          to: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
          value: "0.1",
          timestamp: Date.now() - 3600000,
          status: "confirmed",
        },
        {
          id: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          from: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
          to: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          value: "0.05",
          timestamp: Date.now() - 7200000,
          status: "confirmed",
        },
        {
          id: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
          from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          to: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          value: "0.2",
          timestamp: Date.now() - 86400000,
          status: "confirmed",
        },
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch transaction history",
      //   variant: "destructive",
      // });
    }
  };

  // Connect to WebSocket for streaming transactions
  const connectWebSocket = (address: string) => {
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
              ? walletAddress
              : `0x${Math.random().toString(16).slice(2, 42)}`,
          to:
            Math.random() > 0.5
              ? walletAddress
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

  // Fetch saved address tags
  const fetchAddressTags = async (address: string) => {
    try {
      // In a real app, this would be an API call to your backend
      // const response = await fetch(`/api/tags/${address}`)
      // const data = await response.json()

      // Mock data for demonstration
      const mockTags = {
        "0x71C7656EC7ab88b098defB751B7401B5f6d8976F": "My Wallet",
        "0x2546BcD3c84621e976D8185a91A922aE77ECEc30": "Exchange",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC": "DeFi Protocol",
      };

      setAddressTags(mockTags);
    } catch (error) {
      console.error("Error fetching address tags:", error);
    }
  };

  // Save a new address tag
  const saveAddressTag = async (address: string, tag: string) => {
    try {
      // In a real app, this would be an API call to your backend with wallet signature
      // const signature = await requestSignature()
      // await fetch('/api/tags', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ address, tag, signature })
      // })

      // Update local state
      setAddressTags((prev) => ({
        ...prev,
        [address]: tag,
      }));

      // toast({
      //   title: "Tag Saved",
      //   description: `Address ${address.slice(0, 6)}...${address.slice(
      //     -4
      //   )} tagged as "${tag}"`,
      // });
    } catch (error) {
      console.error("Error saving address tag:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to save address tag",
      //   variant: "destructive",
      // });
    }
  };

  // Handle WebSocket reconnection
  useEffect(() => {
    const handleOnline = () => {
      if (isConnected && !wsConnected) {
        // toast({
        //   title: "Reconnecting",
        //   description: "Attempting to reconnect WebSocket...",
        // });
        connectWebSocket(walletAddress);
      }
    };

    const handleOffline = () => {
      setWsConnected(false);
      // toast({
      //   title: "Disconnected",
      //   description: "WebSocket connection lost. Will reconnect when online.",
      //   variant: "destructive",
      // });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isConnected, wsConnected, walletAddress]);

  return (
    <main className="container mx-auto px-4 py-8 flex justify-between items-center h-screen gap-x-16">
      {!isConnected ? (
        <>
          {" "}
          <div className="flex flex-col items-start justify-start mb-8 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Chaos Theory Wallet View</h1>
            </div>
            <p className="text-muted-foreground text-center max-w-2xl">
              Connect your wallet to view transaction history and manage address
              tags
            </p>
            <p className="text-muted-foreground text-center max-w-2xl">
              Trial project for chaos theory interview
            </p>
          </div>
          <div className="flex justify-center h-min">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your crypto wallet to view your transaction history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WalletConnection onConnect={handleWalletConnect} />
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Wallet Connected</CardTitle>
                  <CardDescription>
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      wsConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {wsConnected ? "Streaming active" : "Streaming inactive"}
                  </span>
                </div>
              </CardHeader>
            </Card>

            <TransactionStats transactions={transactions} />
          </div>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="tags">Address Tags</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions">
              <TransactionHistory
                transactions={transactions}
                addressTags={addressTags}
                walletAddress={walletAddress}
              />
            </TabsContent>
            <TabsContent value="tags">
              <AddressTagging
                addressTags={addressTags}
                saveAddressTag={saveAddressTag}
                transactions={transactions}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </main>
  );
}
