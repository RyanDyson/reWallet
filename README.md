# Crypto wallet dashboard

Connect a crypto wallet and view your transaction history. Wallet address are able to be aliased by adding tags to them.

### Tech Stack

Built with NextJs, React, Hono, Drizzle, PostgreSQL (Neon), WalletConnect AppKit, Wagmi, Tailwind

### Support

supports eth mainnet

### Run Locally

1. clone repository
   `git clone https://github.com/RyanDyson/chaos-theory-wallet.git`
2. install dependencies
   `npm install`
3. set up environmental variables
   - create .env fille at root directory
   - go to https://cloud.reown.com/sign-in, sign in, and create a new project
   - obtain projectId Api key (to connect to walletConnect endpoint)
   - go to your postgreSQL db provider of choice (i.e. supabase)
   - obtain connecter string
   - go to https://etherscan.io, sing in, and create a new project
   - click on profile, and go to api dashboard
   - make a new apikey
   - paste all three keys into your env file
   ```
       DATABASE_URL=postgresql://...
       NEXT_PUBLIC_PROJECT_ID= <ReOwnProjectID>
       NEXT_PUBLIC_ETHER_SCAN_API_KEY= <EtherScanApiKey>
   ```
4. populate db
   - generate drizzle client & sql migrations
     `npm run db:generate`
   - push schema onto your db
     `npm run db:push`
5. run local host
   `npm run dev`
