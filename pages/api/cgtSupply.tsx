import cacheData from "memory-cache";
import Web3 from "web3";
import NodeCache from 'node-cache';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { TonClient } from 'ton';
import { Address } from 'ton-core';
import CgtOnBscABI from "@/utils/abis/CgtOnBsc.json";
import { addresses } from "@/constant/address";

const cache = new NodeCache({ stdTTL: 900 });

// Interfaces
interface SupplyResult {
  cgtSupplyOnBsc: number;
  cgtSupplyOnEth: number;
  cgtSupplyOnNeon: number;
  cgtSupplyOnKusama: number;
  cgtSupplyOnTon: number;
}

// Constants
const DECIMALS = 18;
const TOTAL_SUPPLY = 100000000;
const TON_ADDRESS = 'EQC16UcPDOF1YBcDfI3-SNA8nr8ECliCRN3O5d_-SSBcUSjf';

// Utility functions
const formatSupply = (supply: number): string => 
  supply.toLocaleString('en-US', { maximumFractionDigits: 0 });

const getWeb3Contract = (provider: string, address: string) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  return new web3.eth.Contract(CgtOnBscABI, address);
};

// Supply fetching functions
const getSupplyOnChain = async (provider: string, address: string): Promise<number> => {
  try {
    const contract = getWeb3Contract(provider, address);
    const supply = await contract.methods.totalSupply().call();
    return Number(supply) / 10 ** DECIMALS;
  } catch (err) {
    console.log(`Error getting supply: ${err}`);
    return 0;
  }
};

const getSupplyOnKusama = async (): Promise<number> => {
  try {
    const provider = new WsProvider(process.env.NEXT_CURIO_PROVIDER);
    const api = await ApiPromise.create({ provider, noInitWarn: true });
    const supply = await api.query.balances.totalIssuance();
    await api.disconnect();
    return Number(supply) / 10 ** DECIMALS;
  } catch (err) {
    console.log(`Error getting Kusama supply: ${err}`);
    return 0;
  }
};

const getSupplyOnTon = async (): Promise<number> => {
  try {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.NEXT_TONCENTER_RPC_API_KEY
    });
    const tokenAddress = Address.parse(TON_ADDRESS);
    const { stack } = await client.runMethod(tokenAddress, 'get_jetton_data');
    const totalSupply = stack.readBigNumber();
    return Number(totalSupply) / 10 ** DECIMALS;
  } catch (error) {
    console.error('Error fetching TON token data:', error);
    return 0;
  }
};

// Main handler function
export default async function handler(req: any, res: any) {

  const cachedData = cache.get('supply');
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const [supplyOnBsc, supplyOnNeon, supplyOnKusama, supplyOnTon] = await Promise.all([
      getSupplyOnChain(addresses.providerBsc1, addresses.cgtOnBsc_address),
      getSupplyOnChain(addresses.providerNeon, addresses.cgtOnNeon_address),
      getSupplyOnKusama(),
      getSupplyOnTon()
    ]);
  
    const supplyOnEth = TOTAL_SUPPLY - supplyOnBsc - supplyOnKusama - supplyOnTon - supplyOnNeon;

    const result: SupplyResult = {
      cgtSupplyOnBsc: supplyOnBsc,
      cgtSupplyOnEth: supplyOnEth,
      cgtSupplyOnNeon: supplyOnNeon,
      cgtSupplyOnKusama: supplyOnKusama,
      cgtSupplyOnTon: supplyOnTon,
    };

    cache.set('allLiquidity', result);

    res.send(result);
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).send({ error: 'An error occurred while fetching supplies' });
  }
}