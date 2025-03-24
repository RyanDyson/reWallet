import { type Dispatch, SetStateAction } from "react";
import { type transaction } from "@/lib/types/mockTransactions";
import { type toastProps } from "@/components/toast-item";

type args = {
  WsConnected: boolean;
  address: string;
  setWsConnected: Dispatch<SetStateAction<boolean>>;
  setWalletAddress: Dispatch<SetStateAction<string>>;
  setTransactions: Dispatch<SetStateAction<transaction[]>>;
};

export function connetWallet({
  WsConnected,
  address,
  setWsConnected,
  setTransactions,
}: args) {
  let res: toastProps;
}
