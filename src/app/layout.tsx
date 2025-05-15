import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";

import { headers } from "next/headers";
import ContextProvider from "@/context";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "re:Wallet",
  description: "Powered by WalletConnect",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");

  return (
    <html style={merriweather.style} lang="en">
      <body className="dark bg-gradient-to-br from-neutral-800 to-neutral-950 font-sans">
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
