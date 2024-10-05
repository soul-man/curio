import { NextApiRequest, NextApiResponse } from 'next';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { Option } from '@polkadot/types';
import NodeCache from 'node-cache';
import { cryptoWaitReady, encodeAddress, decodeAddress, isAddress } from '@polkadot/util-crypto';

const DECIMALS = 18;
const cache = new NodeCache({ stdTTL: 900 }); // 15 minutes cache
const CURIO_SS58_PREFIX = 777; // Curio Chain uses the default Substrate SS58 prefix
const FIXED_TOTAL_ISSUANCE = new BN('100000000000000000000000000'); // 100,000,000 with 18 decimals

const stakingDefinition = {
  types: {
      StakingRates: {
          collatorStakingRate: 'Perquintill',
          collatorRewardRate: 'Perquintill',
          delegatorStakingRate: 'Perquintill',
          delegatorRewardRate: 'Perquintill'
      }
  },
  runtime: {
      Staking: [
          {
              methods: {
                  get_staking_rates: {
                      description: 'Calculate the current staking and reward rates for collators and delegators',
                      params: [],
                      type: 'StakingRates'
                  },
                  get_unclaimed_staking_rewards: {
                      description: 'Calculate the claimable staking rewards for a given account address',
                      params: [
                          {
                              name: 'account',
                              type: 'AccountId32'
                          }
                      ],
                      type: 'Balance'
                  },
                  get_sorted_proposed_candidates: {
                      description: 'Provides a sorted list of collators most suited for given delegator\'s stake amount determined with some heuristic algorithm.',
                      params: [
                          {
                              name: 'balance',
                              type: 'Balance'
                          }
                      ],
                      type: 'Vec<AccountId>'
                  }
              },
              version: 1
          }
      ]
  }
};

const formatBalance = (balance: BN, decimals: number): number =>
  parseFloat(balance.toString()) / Math.pow(10, decimals);

const getCurioAddress = async (mainAddress: string, prefix: number): Promise<string> => {
  await cryptoWaitReady();
  const publicKey = decodeAddress(mainAddress);
  return encodeAddress(publicKey, prefix);
};

const fetchWalletInfo = async (api: ApiPromise, address: string) => {
  try {
    const [accountData, locks, stakingInfo, totalIssuance] = await Promise.all([
      api.query.system.account(address),
      api.query.balances.locks(address),
      api.query.parachainStaking.delegatorState(address),
      api.query.balances.totalIssuance()
    ]);

    const free = new BN((accountData as any).data.free.toString());
    const reserved = new BN((accountData as any).data.reserved.toString());
    const totalBalance = free.add(reserved);

    const lockedBalance = Array.isArray(locks)
      ? locks.reduce((max, lock) => {
          const lockAmount = new BN(lock.amount?.toString() || '0');
          return lockAmount.gt(max) ? lockAmount : max;
        }, new BN(0))
      : new BN(0);

    const transferableBalance = free.sub(lockedBalance);

    const totalStaked = (stakingInfo as unknown as Option<any>).isSome
      ? new BN((stakingInfo as unknown as Option<any>).unwrap().amount?.toString() || '0')
      : new BN(0);

    const stakingPercentage = totalStaked.mul(new BN(10000)).div(FIXED_TOTAL_ISSUANCE).toNumber() / 100;

    return {
      transferableBalance: formatBalance(transferableBalance, DECIMALS).toFixed(2),
      totalBalance: formatBalance(totalBalance, DECIMALS).toFixed(2),
      totalStaked: formatBalance(totalStaked, DECIMALS).toFixed(2),
      stakingPercentage: `${stakingPercentage.toFixed(4)}%`,
      pendingRewards: '0.0000',
    };
  } catch (error) {
    console.error(`Error fetching wallet info for address ${address}:`, error);
    return {
      transferableBalance: '0',
      totalBalance: '0',
      totalStaked: '0',
      stakingPercentage: '0%',
      pendingRewards: '0',
      error: 'Failed to fetch wallet info'
    };
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { address } = req.query;
  if (typeof address !== 'string' || !address || !isAddress(address)) {
    return res.status(400).json({ error: 'Invalid or missing wallet address' });
  }

  // const cacheKey = `wallet_info_${address}`;
  // const cachedResult = cache.get(cacheKey);
  // if (cachedResult) {
  //   return res.status(200).json(cachedResult);
  // }

  let api: ApiPromise | null = null;
  let staking: ApiPromise | null = null;


  try {
    await cryptoWaitReady();

    const provider = new WsProvider(process.env.NEXT_CURIO_PROVIDER);
    api = await ApiPromise.create({ provider });
    staking = await ApiPromise.create({ provider, runtime: { ...stakingDefinition.runtime }});
    const unclaimedStakingRewards = await staking.call.staking.getUnclaimedStakingRewards(address);
    
    const curioAddress = await getCurioAddress(address, CURIO_SS58_PREFIX);
    const walletInfo = await fetchWalletInfo(api, curioAddress);

    walletInfo.pendingRewards = formatBalance(new BN(unclaimedStakingRewards.toString()), DECIMALS).toFixed(2), unclaimedStakingRewards.toString();

    const result = { inputAddress: address, curioAddress, walletInfo };

    // cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error fetching wallet info:`, error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  } finally {
    if (api) {
      await api.disconnect();
    }
  }
}