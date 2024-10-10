import { NextApiRequest, NextApiResponse } from 'next';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { AnyTuple, CallBase } from '@polkadot/types-codec/types';

interface TransactionInfo {
  blockHash: string;
  extrinsicIndex: number;
  method: string;
  timestamp: number;
  signer: string;
  batchCalls?: BatchCall[];
  interpretedMethod?: string;
}

interface BatchCall {
  section: string;
  method: string;
  args: string[];
}

async function getRecentTransactions(api: ApiPromise, numberOfBlocks: number = 100): Promise<TransactionInfo[]> {
  const transactions: TransactionInfo[] = [];
  
  const latestHash = await api.rpc.chain.getBlockHash();
  let currentHash = latestHash;

  for (let i = 0; i < numberOfBlocks; i++) {
    const signedBlock = await api.rpc.chain.getBlock(currentHash);
    const timestamp = await api.query.timestamp.now.at(currentHash);
    
    for (const [index, extrinsic] of signedBlock.block.extrinsics.entries()) {
      const { method, section, args } = extrinsic.method;
      
      let transactionInfo: TransactionInfo = {
        blockHash: currentHash.toHex(),
        extrinsicIndex: index,
        method: `${section}.${method}`,
        timestamp: timestamp.toPrimitive() as number,
        signer: extrinsic.signer.toString(),
      };

      if (section === 'utility' && (method === 'batch' || method === 'batchAll')) {
        transactionInfo.batchCalls = (args[0] as unknown as CallBase<AnyTuple>[]).map((call) => ({
          section: call.section,
          method: call.method,
          args: call.args.map((arg) => arg.toString())
        }));
      }

      transactions.push(transactionInfo);
    }

    currentHash = signedBlock.block.header.parentHash;
  }

  return transactions;
}

function interpretTransaction(transaction: TransactionInfo): string {
  if (transaction.method === 'utility.batch' || transaction.method === 'utility.batchAll') {
    for (const call of transaction.batchCalls || []) {
      if (call.section === 'parachainStaking' && call.method === 'claimRewards') {
        return 'Claim Staking Rewards';
      }
      // Add more interpretations here for other common operations
    }
  }
  return transaction.method; // Return original method if no specific interpretation
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let api: ApiPromise | null = null;

  try {
    const provider = new WsProvider(process.env.NEXT_CURIO_PROVIDER);
    api = await ApiPromise.create({ provider });

    const recentTransactions = await getRecentTransactions(api);

    const interpretedTransactions = recentTransactions.map(tx => ({
      ...tx,
      interpretedMethod: interpretTransaction(tx)
    }));

    res.status(200).json({ transactions: interpretedTransactions });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent transactions', 
      details: error instanceof Error ? error.message : String(error) 
    });
  } finally {
    if (api) {
      await api.disconnect();
    }
  }
}