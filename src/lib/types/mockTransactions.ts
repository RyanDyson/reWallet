// Mock data for demonstration
export type Transaction = {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: bigint;
  timestamp: number;
  type?: "incoming" | "outgoing" | "pending";
};

export const mockTransactions: Transaction[] = [
  {
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    to: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    value: "0.1",
    timestamp: Date.now() - 3600000,
    blockNumber: BigInt(123456),
    type: "pending",
  },
  {
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    from: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    to: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    value: "0.05",
    timestamp: Date.now() - 7200000,
    blockNumber: BigInt(123456),
    type: "incoming",
  },
  {
    hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    from: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    to: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    value: "0.2",
    timestamp: Date.now() - 86400000,
    blockNumber: BigInt(123456),
    type: "outgoing",
  },
];
