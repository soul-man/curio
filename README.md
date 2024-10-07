<div align="center">
  <h2>Curio Insights</h2>
  <p>Curio Insights is a comprehensive analytics platform dedicated to Curio Invest, a Real World Asset (RWA) tokenization platform.</p>
</div>

![Screenshot of Curio Info intro screen.](https://github.com/soul-man/curio/blob/master/public/images/curio.png?raw=true)

![Screenshot of Curio Info intro screen.](https://github.com/soul-man/curio/blob/master/public/images/dashboard.png?raw=true)

##  💖  Features
- Multi-Chain Analytics: In-depth analytics for the Curio Gas Token (CGT) across multiple blockchain networks, including Ethereum, Binance Smart Chain, Curio Chain, TON, and more.
- Market Data Dashboard: Users can access market data for CGT, including current price, market cap, 24-hour trading volume, and historical price charts.
- Liquidity Information: The platform displays detailed information about CGT liquidity pools on various decentralized exchanges, including Uniswap (Ethereum) and PancakeSwap (BSC).
- Supply Distribution: It shows the distribution of CGT supply across different blockchain networks, giving users a clear picture of token circulation.
- Staking Analytics: Users can view CGT staking statistics on the Curio Chain, including APY, total staked amount, and percentage of supply staked.
- Trade Data: The platform provides recent trade data, including trade sizes, price impacts, and transaction details.
- Historical Performance: Users can see all-time high and all-time low prices for CGT, along with the dates these milestones were achieved.
- Curio Wallet Integration: Users can connect their Curio wallet to view detailed wallet information, including transferable balance, total balance, total staked amount, staking percentage, and pending rewards.

 
## Run the development server

###Install:

```bash
yarn install
```

### Setting Up Environment Variables:

To configure your Next.js application with the necessary environment variables, follow these steps:

1. **Create a `.env.local` file** in the root of your project if it doesn't already exist.

2. **Add the following environment variables** to the `.env.local` file:

   ```plaintext
   NEXT_INFURA_API_KEY=your_infura_api_key_here
   NEXT_MORALIS_API_KEY=your_moralis_api_key_here
   NEXT_HOST_BASE_URL=your_host_base_url_here
   NEXT_TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
   NEXT_TONCENTER_RPC_API_KEY=your_toncenter_rpc_api_key_here
   ```

3. **Replace the placeholder values** with your actual API keys and URLs.

These environment variables will be accessible in your application via `process.env`, allowing you to securely use sensitive information without hardcoding it into your source code.

###Start the server using this command:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/index.tsx`.
