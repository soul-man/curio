import React from 'react';
import Spinner from '../Spinner';
import { abbreviateNumber } from '../../utils/helpers';

interface CardVolumeCapProps {
  loaded: boolean;
  volume: number;
  liquidity: {
    ETH?: { CGT?: string };
    BSC?: { CGT?: string };
  };
  staking: number;
  marketPrice: number;
}

const TOTAL_SUPPLY = 100000000; // 100 million CGT

const CardVolumeCap: React.FC<CardVolumeCapProps> = ({ loaded, volume, liquidity, staking, marketPrice }) => {
  if (!loaded) {
    return (
      <div className="col-span-12 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-black/90 dark:text-white rounded-2xl">
        <Spinner />
      </div>
    );
  }

  const totalLockedCGT = Number(liquidity?.ETH?.CGT || 0) + Number(liquidity?.BSC?.CGT || 0) + Number(staking || 0);
  const lockedPercentage = (totalLockedCGT / TOTAL_SUPPLY) * 100;

  return (
    <>
      <div className="col-span-12 md:col-span-6 flex flex-col mb-8">
        <div className="mb-2 text-lg font-thin text-white/70">
          Total Locked
        </div>
        <div className="flex flew-row gap-6 items-center mb-1">
          <div className="text-5xl font-bold text-white dark:text-white">
            <span className="font-extralight">$</span>{" "}
            {abbreviateNumber(totalLockedCGT * marketPrice)}
          </div>
        </div>
        <div className="flex flew-row gap-6 items-center mb-3">
          <div className="text-xl font-thin text-white dark:text-white/80">
            {totalLockedCGT.toLocaleString()} CGT
          </div>
          <div className={`text-md bg-black/40 px-2 py-0.5 rounded-md text-blue-300`}>
            {lockedPercentage.toFixed(2)}%
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          <span className="flex items-center bg-blue-400 text-white/90 rounded-sm p-1 pr-2 text-xs">
            <img src="./images/chains/ethereum.png" alt="Ethereum" className="w-5 h-5 mr-1" />
            {Number(liquidity?.ETH?.CGT || 0).toLocaleString()}
          </span>
          <span className="flex items-center bg-yellow-400 text-black/90 rounded-sm p-1 pr-2 text-xs">
            <img src="./images/tokens/bnb.png" alt="BSC" className="w-5 h-5 mr-1" />
            {Number(liquidity?.BSC?.CGT || 0).toLocaleString()}
          </span>
          <span className="flex items-center bg-blue-500/90 text-white/90 rounded-sm p-1 pr-2 text-xs">
            <img src="./images/chains/kusama.png" alt="Kusama" className="w-5 h-5 mr-1" />
            {Number(staking || 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 flex flex-col">
        <div className="mb-2 text-lg font-thin text-white/70">
          Volume 24h
        </div>
        <div className="text-5xl font-bold text-white dark:text-white">
          <span className="font-extralight">$</span>{" "}
          {abbreviateNumber(volume)}
        </div>
      </div>
    </>
  );
};

export default CardVolumeCap;