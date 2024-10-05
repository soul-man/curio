import Web3 from 'web3';
import BigNumber from 'bignumber.js';

interface PoolInfo {
  lpToken: string;
  allocPoint: string;
  lastRewardTimestamp: string;
  accSushiPerShare: string;
}

interface Reserves {
  _reserve0: string;
  _reserve1: string;
  _blockTimestampLast: string;
}

const NEON_RPC_URL = 'https://neon-proxy-mainnet.solana.p2p.org';
const MASTERCHEF_ADDRESS = '0xbb8343122C79D706AC251005C8D14887dda3bd3D';
const MASTERCHEF_ABI = [
  { "inputs": [], "name": "sushiPerSec", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalAllocPoint", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "poolInfo", "outputs": [{ "internalType": "contract IERC20", "name": "lpToken", "type": "address" }, { "internalType": "uint256", "name": "allocPoint", "type": "uint256" }, { "internalType": "uint256", "name": "lastRewardTimestamp", "type": "uint256" }, { "internalType": "uint256", "name": "accSushiPerShare", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;

const LP_TOKEN_ABI = [
  { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      {
        "internalType": "uint112",
        "name": "_reserve0",
        "type": "uint112"
      },
      {
        "internalType": "uint112",
        "name": "_reserve1",
        "type": "uint112"
      },
      {
        "internalType": "uint32",
        "name": "_blockTimestampLast",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const web3 = new Web3(NEON_RPC_URL);
const masterChefContract = new web3.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_ADDRESS);

const SECONDS_PER_YEAR = new BigNumber(31536000);
const NEON_BLOCKS_PER_YEAR = SECONDS_PER_YEAR;

const LP_TOKENS = {
  'CGT/JSOL': '0x301F3047056976c03cd3BC885c46014Ad8dec1a5',
  'CGT/USDC': '0xf013FD8b44798f844c9bAD09D67Da79881222A7F'
};

async function getPoolWeight(pid: number): Promise<BigNumber> {
  const poolInfo = await masterChefContract.methods.poolInfo(pid).call() as unknown as PoolInfo;
  const totalAllocPoint = await masterChefContract.methods.totalAllocPoint().call();
  return new BigNumber(poolInfo.allocPoint).div(new BigNumber(totalAllocPoint.toString()));
}

async function getApy(tokenPriceInUsd: BigNumber, poolWeight: BigNumber, totalStakedUsd: BigNumber, sushiPriceUsd: BigNumber) {
  const sushiPerSec = new BigNumber(await masterChefContract.methods.sushiPerSec().call());
  
  return sushiPerSec
    .times(NEON_BLOCKS_PER_YEAR)
    .times(poolWeight)
    .times(sushiPriceUsd)
    .div(totalStakedUsd)
    .times(100);
}

async function getTotalStakedLpTokens(lpTokenAddress: string): Promise<string> {
  const lpContract = new web3.eth.Contract(LP_TOKEN_ABI as any, lpTokenAddress);
  return await lpContract.methods.balanceOf(MASTERCHEF_ADDRESS).call();
}

async function getLpTokenPriceUsd(lpTokenAddress: string, token0PriceUsd: BigNumber, token1PriceUsd: BigNumber): Promise<BigNumber> {
  const lpContract = new web3.eth.Contract(LP_TOKEN_ABI as any, lpTokenAddress);
  const reservesResult = await lpContract.methods.getReserves().call();
  console.log('Raw reserves result:', reservesResult);

  let reserve0: string, reserve1: string;

  if (Array.isArray(reservesResult)) {
    [reserve0, reserve1] = reservesResult;
  } else if (isReserves(reservesResult)) {
    reserve0 = reservesResult._reserve0;
    reserve1 = reservesResult._reserve1;
  } else {
    throw new Error(`Unexpected reserves format: ${JSON.stringify(reservesResult)}`);
  }

  const totalSupply = await lpContract.methods.totalSupply().call() as string;;

  const token0Value = new BigNumber(reserve0).times(token0PriceUsd);
  const token1Value = new BigNumber(reserve1).times(token1PriceUsd);
  const totalLiquidity = token0Value.plus(token1Value);

  return totalLiquidity.div(new BigNumber(totalSupply));
}

function isReserves(obj: any): obj is Reserves {
  return obj && typeof obj === 'object' && '_reserve0' in obj && '_reserve1' in obj && '_blockTimestampLast' in obj;
}

export async function getNeonFarms(cgtPrice: BigNumber, jsolPrice: BigNumber, usdcPrice: BigNumber, sushiPrice: BigNumber) {
  const farms = [];

  for (const [pairName, lpAddress] of Object.entries(LP_TOKENS)) {
    try {
      console.log(`Processing pair: ${pairName}`);
      const pid = Object.keys(LP_TOKENS).indexOf(pairName);
      console.log(`PID: ${pid}`);

      const poolWeight = await getPoolWeight(pid);
      console.log(`Pool weight: ${poolWeight.toString()}`);

      const totalStakedLpTokens = await getTotalStakedLpTokens(lpAddress);
      console.log(`Total staked LP tokens: ${totalStakedLpTokens}`);

      const token1Price = pairName === 'CGT/JSOL' ? jsolPrice : usdcPrice;
      const lpTokenPriceUsd = await getLpTokenPriceUsd(lpAddress, cgtPrice, token1Price);
      console.log(`LP token price USD: ${lpTokenPriceUsd.toString()}`);

      const totalStakedUsd = new BigNumber(totalStakedLpTokens).times(lpTokenPriceUsd).div(new BigNumber(10).pow(18));
      console.log(`Total staked USD: ${totalStakedUsd.toString()}`);

      const apy = await getApy(cgtPrice, poolWeight, totalStakedUsd, sushiPrice);
      console.log(`APY: ${apy.toString()}`);

      farms.push({
        pairName,
        pid,
        apy: apy.toFixed(2),
        totalStakedUsd: totalStakedUsd.toFixed(2),
        poolWeight: poolWeight.toFixed(4),
      });
    } catch (error) {
      console.error(`Error processing ${pairName}:`, error);
      farms.push({
        pairName,
        pid: Object.keys(LP_TOKENS).indexOf(pairName),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return farms;
}