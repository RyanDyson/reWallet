// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { headers } from "next/headers"; // added
import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: "Wallet Chaos Theory",
  description: "Powered by WalletConnect",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en">
      <body className="dark bg-gradient-to-br from-neutral-800 to-neutral-950">
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
