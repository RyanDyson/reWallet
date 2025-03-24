"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { ModalButton } from "./components/ModalButton";
import { WalletStats } from "./components/WalletStats";
import { WalletTransactionList } from "./components/WalletTransactionList";
// import { useEffect } from "react";

export default function Home() {
  const { isConnected, address, chain, chainId, connector } = useAccount();
  console.log({ isConnected, address, chain, chainId, connector });

  return (
    <main className="px-4 py-8 h-screen">
      {!isConnected ? (
        <div className="flex justify-between items-center h-full gap-x-16 px-32">
          <div className="flex flex-col items-start justify-start mb-8 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">UWallet</h1>
            </div>
            <p className="text-muted-foreground text-center max-w-2xl">
              Dashboard to view and manage your crypto transactions.
            </p>
            <p className="text-muted-foreground text-center max-w-2xl">
              Trial project for chaos theory interview.
            </p>
            <p className="text-muted-foreground text-center max-w-2xl">
              Powered by WalletConnect.
            </p>
          </div>
          <div className="flex justify-center h-min">
            <Card className="w-full max-w-md rounded-sm min-w-96 bg-neutral-900/60 backdrop-blur-xl divide-neutral-800 flex flex-col gap-y-4">
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <ModalButton />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center h-full px-32 py-16">
          <div className="relative flex flex-col gap-y-4 max-w-4xl w-full bg-neutral-900 border rounded-sm p-8 border-neutral-800 z-20">
            <div className="flex gap-x-2 absolute right-0 z-0 -top-14 bg-emerald-950/80 border border-emerald-800 p-2 px-4 justify-center items-center rounded-full">
              <div className="rounded-full bg-emerald-600 w-4 h-4" />
              <p>Connected</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-neutral-400">wallet address</p>
                <p>{address}</p>
              </div>
              <ModalButton className="max-w-48 w-min" />
            </div>
            <WalletStats />
            <WalletTransactionList walletAddress={address ?? ""} />
          </div>
        </div>
      )}
    </main>
  );
}
