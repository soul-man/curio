import React from 'react';
import CardLayout from '@/components/layout/common/CardLayout';


interface PoolInfoCardProps {
  poolDataEth: {
    usdValue: string;
    WETH: string;
    CGT: string;
  };
  poolDataBsc: {
    usdValue: string;
    WBNB: string;
    CGT: string;
  };
  chain: string;
  tokenPair: string;
}

const PoolInfoCard: React.FC<PoolInfoCardProps> = ({ poolDataEth, poolDataBsc, chain, tokenPair }) => {
  
    if (!poolDataEth && !poolDataBsc) {
    return <div className="col-span-12 bg-black/40 p-5 rounded-md">Loading pool data...</div>;
  }

  return (
    <div className="col-span-12 md:col-span-6">
            <div className="flex flex-col h-full">

                {/* <div className='rounded-md flex flex-col md:flex-col md:mb-2'>
                    <h3 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-4xl font-sans font-bold text-white uppercase">Best Pools</h3>
                </div> */}

                <div className="flex flex-row md:flex-row gap-3 h-full">
                    <div className="flex flex-col w-full">
                        <CardLayout gradientStart="from-blue-700/50" gradientEnd="to-transparent" padding="p-0">
                            <div className="flex flex-col items-center h-full">
                                <div className=" w-fit bg-black/30 text-blue-300 text-center border-b border-blue-300/30 py-1 px-4 mb-5 md:mb-3 lg:mb-5 rounded-b-md">
                                    <a className="flex flex-row gap-2 justify-center items-center" href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0E186357c323c806C1efdad36D217F7a54b63D18" target="_blank">
                                        <span className="hidden lg:block px-0.5 py-0.5 text-xs">
                                            Buy on Uniswap 
                                        </span>
                                        <img src="images/dex/uniswap.png" className="w-7 h-7 md:w-5 md:h-5"/>
                                    </a>
                                </div>

                                <div className="flex flex-col lg:flex-row md:w-full rounded-md justify-center lg:gap-5">
                                    <div className="flex flex-row mb-2 lg:mb-0 -space-x-3 relative justify-center items-center">
                                        <img src="/images/tokens/cgt.png" alt="CGT" className="w-10 h-10 lg:w-12 lg:h-12 lg:mr-0" />
                                        <img src="/images/chains/ethereum-new.png" alt="Ethereum" className="bg-white rounded-full p-[1px] w-10 h-10 lg:w-12 lg:h-12"/>
                                    </div>
                                    <div>
                                        <div className="text-xl font-semibold text-white text-center lg:text-left">
                                            CGT/WETH
                                        </div>
                                        <div className="text-md md:text-lg text-white font-light text-center lg:text-left">
                                            ${Number(poolDataEth.usdValue).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center w-full font-light text-xs lg:text-sm text-blue-300/90 pt-1 my-3">
                                    {Number(poolDataEth.WETH).toFixed(2)} <span className="mr-2 px-1 py-0.5 bg-blue-900/30 rounded-md">WETH</span> 
                                    {Number(poolDataEth.CGT).toLocaleString()} <span className="px-1 py-0.5 bg-blue-900/30 rounded-md">CGT</span>
                                </div>
                            </div>
                            <div className="bg-blue-400 text-sm w-full py-1 rounded-b-md text-center text-white/90">
                                    ETHEREUM
                                </div>
                        </CardLayout>
                    </div>

                    <div className="flex flex-col w-full">
                        <CardLayout gradientStart="from-yellow-500/20" gradientEnd="to-transparent" padding="p-0">
                            <div className="flex flex-col items-center pb-3 px-1 rounded-t-md h-full">
                                <div className="w-fit bg-black/30 text-blue-300 text-center border-b border-blue-300/30 py-1 px-4 mb-5 md:mb-3 lg:mb-5 rounded-b-md">
                                    <a className="flex flex-row gap-2 justify-center items-center" href="https://pancakeswap.finance/swap?outputCurrency=0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad" target="_blank">
                                        <span className="hidden lg:block px-0.5 py-0.5 text-xs">
                                            Buy on Pancakeswap 
                                        </span>
                                        <img src="images/dex/pancakeswap.png" className="w-7 h-7 md:w-5 md:h-5"/>
                                    </a>
                                </div>
                                <div className="flex flex-col lg:flex-row md:w-full rounded-md justify-center lg:gap-5">
                                    <div className="flex flex-row mb-2 lg:mb-0 -space-x-3 relative justify-center items-center">
                                        <img src="/images/tokens/cgt.png" alt="CGT" className="w-10 h-10 lg:w-12 lg:h-12 mr-0" />
                                        <img src="/images/tokens/bnb.png" alt="Binance Smart Chain" className="bg-white rounded-full p-[1px] w-10 h-10 lg:w-12 lg:h-12" />
                                    </div>
                                    <div>
                                        <div className="text-lg lg:text-xl font-semibold text-white text-center lg:text-left">
                                            CGT/WBNB
                                        </div>
                                        <div className="text-md md:text-lg text-white font-light text-center lg:text-left">
                                            ${Number(poolDataBsc.usdValue).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center w-full font-light text-xs lg:text-sm text-blue-300/90 border-t border-blue-400/20 pt-3 mt-3">
                                    {Number(poolDataBsc.WBNB).toFixed(2)} <span className="mr-2 px-1 py-0.5 bg-blue-900/30 rounded-md">WBNB</span> {Number(poolDataBsc.CGT).toLocaleString()} <span className="px-1 py-0.5 bg-blue-900/30 rounded-md">CGT</span>
                                </div>
                            </div>
                            <div className="bg-yellow-400 py-1 rounded-b-md text-center text-white/90">
                                BSC
                            </div>
                        </CardLayout>
                    </div>
                </div>
            </div>
    </div>
  );
};

export default PoolInfoCard;