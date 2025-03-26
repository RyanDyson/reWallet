"use client";

import { Transaction } from "@/lib/types/mockTransactions";
import { ArrowDown, ArrowUp, Clock } from "lucide-react";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
// import { mockTags } from "@/lib/types/mockTags";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const fromFormchema = z.object({
  tag: z.string(),
});

export const TransactionItem = ({
  transaction,
  tags,
  address,
}: {
  transaction: Transaction;
  tags: Record<string, string>;
  address: string;
}) => {
  const [tagFrom, setTagFrom] = useState<string | undefined>(
    tags[transaction.from]
  );
  const [tagTo, setTagTo] = useState<string | undefined>(
    tags[transaction.to || ""]
  );

  useEffect(() => {
    setTagFrom(tags[transaction.from]);
    setTagTo(tags[transaction.to || ""]);
  }, [tags, transaction.from, transaction.to]);

  const { mutate: addTag } = useMutation({
    mutationFn: async (newTag: { address: string; tag: string }) => {
      // Initialize the address variable
      await client.wallet.createTag.$post({
        tag: newTag.tag,
        address: newTag.address,
        ownerAddress: address,
      });
    },
    onSuccess: () => {
      toast("Tag added successfully");
    },
    onError: (error) => {
      console.error("Failed to add tag:", error);
    },
  });

  const fromForm = useForm<z.infer<typeof fromFormchema>>({
    resolver: zodResolver(fromFormchema),
    defaultValues: {
      tag: tags[transaction.from] || "",
    },
  });

  function fromOnSubmit(
    type: "from" | "to",
    address: string,
    values: z.infer<typeof fromFormchema>
  ) {
    if (type === "from") {
      setTagFrom(values.tag);
    } else {
      setTagTo(values.tag);
    }
    addTag({ address: address, tag: values.tag });
  }

  const ToDialog = () => {
    return (
      <Dialog>
        <DialogTrigger>
          <Edit className="justify-self-end h-4 w-4 text-neutral-400 cursor-pointer hover:text-neutral-200 transition-colors" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Edit From</DialogHeader>
          <Form {...fromForm}>
            <form
              className="flex gap-y-2 flex-col"
              onSubmit={fromForm.handleSubmit((values) =>
                fromOnSubmit("to", transaction.to || "", values)
              )}
            >
              <FormField
                control={fromForm.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="tag">Tag</FormLabel>
                    <FormControl>
                      <input {...field} id="tag" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

  const FromDialog = () => {
    return (
      <Dialog>
        <DialogTrigger>
          <Edit className="justify-self-end h-4 w-4 text-neutral-400 cursor-pointer hover:text-neutral-200 transition-colors" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Edit Address Tag</DialogHeader>
          <Form {...fromForm}>
            <form
              className="flex gap-y-2 flex-col"
              onSubmit={fromForm.handleSubmit((values) =>
                fromOnSubmit("from", transaction.from, values)
              )}
            >
              <FormField
                control={fromForm.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="tag">Tag</FormLabel>
                    <FormControl>
                      <input {...field} id="tag" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

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
        </p>
      </div>
      <div className="flex gap-x-2">
        <div className="rounded-sm overflow-x-hidden border-neutral-800 border p-2 max-w-1/3 w-full ">
          <div className="text-neutral-400 flex justify-between items-center">
            <p className="text-neutral-400">From</p>
            <FromDialog />
          </div>
          <p className="truncate">{tagFrom || transaction.from}</p>
        </div>
        <div className="rounded-sm overflow-hidden border-neutral-800 border p-2 max-w-1/3 w-full ">
          <div className="text-neutral-400 flex justify-between items-center">
            <p className="text-neutral-400">To</p>
            <ToDialog />
          </div>
          <p className="truncate">{tagTo || transaction.to}</p>
        </div>
        <div className="rounded-sm overflow-hidden border-neutral-800 border p-2 max-w-1/3 w-full ">
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
