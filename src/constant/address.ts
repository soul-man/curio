export const addresses = {
    // Coingecko Endpoints
    gasPrice: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=',
    marketDataCgt: 'https://api.coingecko.com/api/v3/coins/curio-gas-token',
    marketDataEth: 'https://api.coingecko.com/api/v3/coins/ethereum',
    marketDataSkale: 'https://api.coingecko.com/api/v3/coins/skale',
    marketDataBnb: 'https://api.coingecko.com/api/v3/coins/binancecoin',
    historicalDataCgt: 'https://api.coingecko.com/api/v3/coins/curio-gas-token/market_chart?vs_currency=usd&days=30&interval=daily',
    // Provider ETH
    providerEth: 'https://eth.llamarpc.com',
    // Provider BSC
    providerBsc1: 'https://binance.llamarpc.com',
    providerBsc2: 'https://bsc-mainnet.infura.io/v3/',
    providerBsc3: 'https://bsc-dataseed1.binance.org:443',
    providerBsc4: 'https://bsc-dataseed.binance.org',
    providerBsc5: 'https://bsc-dataseed1.defibit.io',
    providerBsc6: 'https://bsc-dataseed1.ninicoin.io',
    // Provider NEON
    providerNeon: 'https://neon-proxy-mainnet.solana.p2p.org',
    providerNeonDrpc: 'https://lb.drpc.org/ogrpc?network=neon-evm&dkey=Aj-GqjjG4kLLg088MNUvmnKibuYvexwR75BVhlDYfw4q',

    // Provider OTHERS
    providerSkale: 'https://mainnet.skalenodes.com/v1/fit-betelgeuse',
    providerBoba: 'https://mainnet.boba.network',

    // Token Contract Address
    cgtToken_address: '0x0E186357c323c806C1efdad36D217F7a54b63D18',
    cgtOnBsc_address: '0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad',
    cgtOnSkale_address: '0x134EbAb7883dFa9D04d20674dd8A8A995fB40Ced',
    cgtOnBoba_address: '0xF56b164efd3CFc02BA739b719B6526A6FA1cA32a',
    cgtOnNeon_address: '0xC1eD606683a3f89317d64BDA602628d68a0B4b24',

    WETH_ETH_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    WBNB_BNB_ADDRESS: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    CGT_ETH_ADDRESS: '0x0E186357c323c806C1efdad36D217F7a54b63D18',
    CGT_BNB_ADDRESS: '0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad',

    TON_TON_USDT: 'EQBn8irkO9ELo8OskpTq5DlGNh1G30zAazs0BvdGFn1iEwla',

    // POOLS ON TON - Holder Wallet: EQBn8irkO9ELo8OskpTq5DlGNh1G30zAazs0BvdGFn1iEwla
    TON_POOL_CGTUSDT: 'EQAvxmcZmgoM7TBT8n4euj8JIMer7dIX3IQxpHSYl2GviS99',       // Pool
    TON_POOL_CGTUSDT_CGT: 'EQCowb2xZ0hVBMbTmU65u45A8JvdJPRhHwF0c7qMkNlyaFyP',   // token0_address
    TON_POOL_CGTUSDT_USDT: 'EQCZyigxKetocGx1lMo3ydT4egwZXuFudklC34mSLea88ZfH',  // token1_address
    

    TON_POOL_CGTTON: 'EQBnZ8ILpiJYxGv0Yliwg9wwBf4v9_CWbboW-GqYTM5GXgvn',       // Pool
    TON_POOL_CGTTON_CGT: 'EQCowb2xZ0hVBMbTmU65u45A8JvdJPRhHwF0c7qMkNlyaFyP',   // token0_address
    TON_POOL_CGTTON_TON: 'EQA17wyB_VDQQHlas33FRzpaeh1LS5PiAzzDjP20cxNCl56R',

    

    // BRIDGES
    bridge_Neon: '0xC1eD606683a3f89317d64BDA602628d68a0B4b24',

    // POOLS
    POOL_ETH_CGT_ETH: '0xab2F2689cDE4EE1a44100Bc4FF9bF292D811E1eB',
    POOL_BSC_CGT_BNB: '0x626a93958F8C0906D119250c41eb50d46A0F9781',
    POOL_NEON_CGT_USD: '0xf013FD8b44798f844c9bAD09D67Da79881222A7F',
    POOL_NEON_CGT_jSOL: '0x301F3047056976c03cd3BC885c46014Ad8dec1a5',
}
