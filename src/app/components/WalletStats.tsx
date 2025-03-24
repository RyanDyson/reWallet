"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownUp, ArrowUpRight, Clock } from "lucide-react";
import { useAccount } from "wagmi";

type Props = {
  outgoing?: number;
  incoming?: number;
  pending?: number;
};

export function WalletStats({ outgoing, incoming, pending }: Props) {
  const { isConnected } = useAccount();

  return (
    isConnected && (
      <div className="w-full flex flex-col md:flex-row gap-x-2">
        <Card className="w-full min-w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Incoming
            </CardTitle>
            <ArrowDownUp className="h-4 w-4 text-emerald-500 rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {incoming}ETH
            </div>
            <p className="text-xs text-muted-foreground">
              {incoming}transactions
            </p>
          </CardContent>
        </Card>

        <Card className="w-full min-w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Outgoing
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {outgoing} ETH
            </div>
            <p className="text-xs text-muted-foreground"> transactions</p>
          </CardContent>
        </Card>

        <Card className="w-full min-w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Transactions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending}</div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>
      </div>
    )
  );
}
