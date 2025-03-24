"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowDownUp,
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
  Search,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type PgTimestamp } from "drizzle-orm/pg-core";

interface Transaction {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: string;
}

interface AddressTags {
  [address: string]: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  addressTags: AddressTags;
  walletAddress: string;
}

export function TransactionHistory({
  transactions,
  addressTags,
  walletAddress,
}: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format address with tag if available
  const formatAddress = (address: string) => {
    if (addressTags[address]) {
      return (
        <div className="flex items-center">
          <span className="font-medium">{addressTags[address]}</span>
          <span className="text-xs text-muted-foreground ml-2">
            ({address.slice(0, 6)}...{address.slice(-4)})
          </span>
        </div>
      );
    }

    return (
      <span>
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    );
  };

  // Determine if transaction is incoming or outgoing
  const getTransactionType = (transaction) => {
    if (transaction.from.toLowerCase() === walletAddress.toLowerCase()) {
      return "outgoing";
    } else if (transaction.to.toLowerCase() === walletAddress.toLowerCase()) {
      return "incoming";
    } else {
      return "other";
    }
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((tx) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      tx.id.toLowerCase().includes(searchLower) ||
      tx.from.toLowerCase().includes(searchLower) ||
      tx.to.toLowerCase().includes(searchLower) ||
      (addressTags[tx.from] &&
        addressTags[tx.from].toLowerCase().includes(searchLower)) ||
      (addressTags[tx.to] &&
        addressTags[tx.to].toLowerCase().includes(searchLower))
    );
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "timestamp") {
      return sortDirection === "asc"
        ? a.timestamp - b.timestamp
        : b.timestamp - a.timestamp;
    } else if (sortBy === "value") {
      return sortDirection === "asc"
        ? Number.parseFloat(a.value) - Number.parseFloat(b.value)
        : Number.parseFloat(b.value) - Number.parseFloat(a.value);
    }
    return 0;
  });

  // Toggle sort direction
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View your recent transactions and their details
        </CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 font-medium"
                    onClick={() => toggleSort("value")}
                  >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 font-medium"
                    onClick={() => toggleSort("timestamp")}
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                sortedTransactions.map((tx) => {
                  const txType = getTransactionType(tx);
                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        {txType === "incoming" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <ArrowDownUp className="h-3 w-3 mr-1 rotate-180" />
                            In
                          </Badge>
                        ) : txType === "outgoing" ? (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <ArrowDownUp className="h-3 w-3 mr-1" />
                            Out
                          </Badge>
                        ) : (
                          <Badge variant="outline">Other</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatAddress(tx.from)}</TableCell>
                      <TableCell>{formatAddress(tx.to)}</TableCell>
                      <TableCell
                        className={cn(
                          "font-medium",
                          txType === "incoming"
                            ? "text-green-600"
                            : txType === "outgoing"
                            ? "text-blue-600"
                            : ""
                        )}
                      >
                        {tx.value} ETH
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(tx.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "confirmed" ? "outline" : "secondary"
                          }
                        >
                          {tx.status === "confirmed" ? "Confirmed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Explorer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Tag className="h-4 w-4 mr-2" />
                              Tag Addresses
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
