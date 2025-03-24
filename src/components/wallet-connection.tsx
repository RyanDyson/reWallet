"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"

export function WalletConnection({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      // In a real app, this would use WalletConnect or similar library
      // const provider = await getWalletConnectProvider()
      // const accounts = await provider.enable()
      // const address = accounts[0]

      // Mock wallet connection for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"

      onConnect(mockAddress)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-muted p-6 rounded-full">
        <Wallet className="h-12 w-12 text-primary" />
      </div>

      <Button size="lg" onClick={connectWallet} disabled={isConnecting} className="w-full">
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Connect your wallet to view your transaction history and manage address tags
      </p>
    </div>
  )
}

