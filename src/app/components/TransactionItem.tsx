import { Transaction } from "@/lib/types/mockTransactions";
import { ArrowDown, ArrowUp, Clock, Edit } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { client } from "@/lib/client";
// import { mockTags } from "@/lib/types/mockTags";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const TagsDialog = async ({
  transaction_hash,
}: {
  transaction_hash: string;
}) => {
  const res = await client.addressTag.getAllAddressTagByTransactionHash.$get({
    transactionHash: transaction_hash,
  });
  const tags = await res.json();

  return (
    <Dialog>
      <DialogTrigger>
        <Edit className="justify-self-end h-4 w-4 text-neutral-400 cursor-pointer hover:text-neutral-200 transition-colors" />
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-y-2 p-2">
        <DialogHeader>
          <h3 className="text-lg font-semibold">Edit Tags</h3>
        </DialogHeader>
        <DialogDescription>Add new tags to your transaction</DialogDescription>
        {tags.map((tag, index) => {
          return (
            <div key={index} className="flex gap-x-2 items-center">
              <div className="w-min rounded-full px-3 py-0.5 border border-neutral-800 bg-neutral-950/60">
                {tag.tag}
              </div>
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export const TransactionItem = async ({
  transaction,
  walletAddress,
}: {
  transaction: Transaction;
  walletAddress: string;
}) => {
  let res;
  try {
    res = await client.transaction.newTransaction.$post({
      ...transaction,
      wallet_address: walletAddress,
      type: transaction.type ?? "pending",
      blockNumber: Number(transaction.blockNumber),
      timestamp: new Date(transaction.timestamp),
    });
  } catch (Error) {
    console.log(Error);
  }

  const newTransaction = await res?.json();
  console.log(newTransaction);

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
          <TagsDialog transaction_hash={transaction.hash} />
        </p>
      </div>
      <div className="flex gap-x-2">
        <div className="rounded-sm border-neutral-800 border p-2 max-w-1/3 w-full overflow-x-scroll">
          <p className="text-neutral-400">From</p>
          <p className="truncate">{transaction.from}</p>
        </div>
        <div className="rounded-sm border-neutral-800 border p-2 max-w-1/3 w-full overflow-x-scroll">
          <p className="text-neutral-400">To</p>
          <p className="truncate">{transaction.to || "Contract Creation"}</p>
        </div>
        <div className="rounded-sm border-neutral-800 border p-2 max-w-1/3 w-full overflow-x-scroll">
          <p className="text-neutral-400">Value</p>
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
