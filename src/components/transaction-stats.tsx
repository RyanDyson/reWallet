"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownUp, ArrowUpRight, Clock } from "lucide-react"

export function TransactionStats({ transactions }) {
  // Calculate total incoming value
  const totalIncoming = transactions
    .filter((tx) => tx.to === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.value), 0)
    .toFixed(4)

  // Calculate total outgoing value
  const totalOutgoing = transactions
    .filter((tx) => tx.from === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.value), 0)
    .toFixed(4)

  // Count pending transactions
  const pendingCount = transactions.filter((tx) => tx.status === "pending").length

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Incoming</CardTitle>
          <ArrowDownUp className="h-4 w-4 text-green-500 rotate-180" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalIncoming} ETH</div>
          <p className="text-xs text-muted-foreground">
            {transactions.filter((tx) => tx.to === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F").length} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalOutgoing} ETH</div>
          <p className="text-xs text-muted-foreground">
            {transactions.filter((tx) => tx.from === "0x71C7656EC7ab88b098defB751B7401B5f6d8976F").length} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <p className="text-xs text-muted-foreground">
            {pendingCount > 0 ? "Waiting for confirmation" : "All transactions confirmed"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

