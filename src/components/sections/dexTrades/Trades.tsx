import React, { useState, useEffect } from 'react';
import { format } from 'timeago.js';
import { FaExternalLinkAlt, FaEthereum, FaArrowRight, FaArrowLeft, FaChevronLeft, FaChevronRight, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import CardLayout from '@/components/layout/common/CardLayout';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { Skeleton } from "@/components/ui/render-skeleton";


interface Trade {
  type: 'buy' | 'sell';
  timestamp: number;
  amount0: string;
  amount1: string;
  priceImpact: string;
  transactionHash: string;
  chain: 'ETH' | 'BSC';
  usdValue: string;
  pricePerToken: string;
  tradeSize: 'Small' | 'Medium' | 'Large';
}

interface TradesTableProps {
  trades: Trade[] | null | undefined;
  marketPrices: {
    eth: number;
    bnb: number;
  };
}

const TradesTable: React.FC<TradesTableProps> = ({ trades, marketPrices }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortedTrades, setSortedTrades] = useState<Trade[]>([]);
  const [biggestTrade, setBiggestTrade] = useState<number>(0);
  const [smallestTrade, setSmallestTrade] = useState<number>(Infinity);
  const [totalCGTTraded, setTotalCGTTraded] = useState<number>(0);

  useEffect(() => {
    if (trades) {
      const sorted = [...trades].sort((a, b) => {
        if (sortField === 'timestamp') {
          return sortDirection === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
        } else if (sortField === 'type') {
          return sortDirection === 'asc' ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
        } else if (sortField === 'tradeSize') {
          const sizeOrder = { Small: 1, Medium: 2, Large: 3 };
          return sortDirection === 'asc' 
            ? sizeOrder[a.tradeSize] - sizeOrder[b.tradeSize]
            : sizeOrder[b.tradeSize] - sizeOrder[a.tradeSize];
        } else if (sortField === 'priceImpact') {
          return sortDirection === 'asc'
            ? parseFloat(a.priceImpact) - parseFloat(b.priceImpact)
            : parseFloat(b.priceImpact) - parseFloat(a.priceImpact);
        } else if (sortField === 'chain') {
          return sortDirection === 'asc' ? a.chain.localeCompare(b.chain) : b.chain.localeCompare(a.chain);
        }
        return 0;
      });
      setSortedTrades(sorted);

      // Calculate biggest, smallest, and total CGT traded
      let biggest = 0;
      let smallest = Infinity;
      let total = 0;
      trades.forEach(trade => {
        const cgtAmount = Math.abs(parseFloat(trade.amount0));
        biggest = Math.max(biggest, cgtAmount);
        smallest = Math.min(smallest, cgtAmount);
        total += cgtAmount;
      });
      setBiggestTrade(biggest);
      setSmallestTrade(smallest);
      setTotalCGTTraded(total);

    }
  }, [trades, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // if (!trades || trades.length === 0) {
  //   return (
  //     <div className='flex flex-col md:flex-col mb-10 md:mb-10 px-5'>
  //     <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-white">Pools and <span className="font-bold bg-gradient-to-r from-[#0A85E1] to-[#0763A7] inline-block text-transparent bg-clip-text"> Latest Trades</span></h3>
  //     <p className="text-lg sm:text-xl md:text-2xl w-full font-extralight text-blue-300/80">
  //       24h trade data from the Uniswap V3 (ETH) and PancakeSwap V3 (BSC) pools. USD values are estimates based on current ETH/BNB prices. 
  //       Data updates every 15 mins!
  //     </p>
  //     <div className="mt-5 text-lg sm:text-2xl md:text-4xl">
  //         <p className="text-white/80">Loading...</p>
  //       </div>
  //   </div>
  //   );
  // }

  // const sortedTrades = [...trades].sort((a, b) => b.timestamp - a.timestamp);
  const totalPages = Math.ceil(sortedTrades.length / pageSize);
  const currentTrades = sortedTrades.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const getTradeSizeColor = (size: string): string => {
    switch (size) {
      case 'Small': return 'text-blue-300';
      case 'Medium': return 'text-blue-500';
      case 'Large': return 'text-blue-700';
      default: return '';
    }
  };

  const getExplorerUrl = (chain: 'ETH' | 'BSC', txHash: string): string => {
    return chain === 'ETH' 
      ? `https://etherscan.io/tx/${txHash}`
      : `https://bscscan.com/tx/${txHash}`;
  };

  const renderStatCard = (title: string, value: string | number | null) => (
    <div className="col-span-6 md:col-span-3">
      <GradientHeaderH4 headline={title} />
      {value ? (
        <div className="mt-1 text-white text-xl lg:text-2xl font-bold">
          {typeof value === 'number' 
            ? Number(value).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })
            : value}
          {title !== "24h trades" && " CGT"}
        </div>
      ) : (
        <Skeleton className="h-8 w-32 bg-blue-500/20 mt-1" />
      )}
    </div>
  );

  return (
    <div id="trades" className="max-w-screen-2xl mx-auto py-10 mb-16 md:mb-56 px-5">

      <div className='flex flex-col md:flex-col justify-center items-center mb-8 md:mb-10'>
        <h3 className="text-4xl sm:text-4xl md:text-4xl lg:text-6xl font-sans font-bold mb-2 md:mb-5 text-white/90 uppercase"><span className="font-bold bg-gradient-to-r from-[#224eae] to-[#0f9ef2] inline-block text-transparent bg-clip-text">Latest Trades</span></h3>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">

          <p className="text-md md:text-lg lg:text-xl font-thin text-white md:w-9/12 text-center">
            24h trade data from the Uniswap V3 (ETH) pool. USD values are estimates based on the current ETH price. 
            Data updates every 15 mins!
          </p>

        </div>
      </div>

      <div className="flex flex-col h-full w-full mb-10 items-center">
            <div className="flex flex-row flex-grow justify-between">
                <div className="grid grid-cols-12 gap-5 md:gap-10">

                {renderStatCard("24h trades", trades ? sortedTrades.length : null)}
            {renderStatCard("Total traded", trades ? totalCGTTraded : null)}
            {renderStatCard("Biggest Trade", trades ? biggestTrade : null)}
            {renderStatCard("Smallest Trade", trades ? smallestTrade : null)}

                </div>
            </div>
          </div>

      <CardLayout gradientStart="from-blue-700/30" gradientEnd="to-blue-600/20" padding="p-5">

        <div className="w-full rounded-md">
        

          {/* <AppleCardsCarousel 
            liquidity={liquidity}
            sortedTrades={sortedTrades}
            totalCGTTraded={totalCGTTraded}
            biggestTrade={biggestTrade}
            smallestTrade={smallestTrade}
          /> */}

          {/* sorting and stats */}
          <div className="mb-6 flex items-center flex-wrap gap-3 justify-between">
            <div className="flex items-center flex-wrap gap-3">
              <div className="text-sm md:text-md font-thin text-blue-300/70">
                Sort by:
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-black/30 text-white text-xs md:text-sm py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none"
                  onChange={(e) => handleSort(e.target.value)}
                  value={sortField}
                >
                  <option value="type">Type</option>
                  {/* <option value="chain">Chain</option> */}
                  <option value="timestamp">Time</option>
                  <option value="tradeSize">Trade Size</option>
                  <option value="priceImpact">Price Impact</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <IoIosArrowDown />
                </div>
              </div>
              <button
                className={`bg-black/40 text-white py-2 px-3 rounded-md`}
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? <RiSortDesc /> : <RiSortAsc />}
              </button>
            </div>
          </div>
          {/* sorting and stats end */}

          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[1200px]">

              <div className="flex flex-col">
                <div className="flex flex-row gap-2 lg:gap-5 text-sm md:text-md font-normal text-white mb-2 px-2">
                  <div className="w-[4%]">Type</div>
                  <div className="w-[4%]"></div>
                  <div className="w-[10%]">Time</div>
                  <div className="w-[8%] text-right">Trade Size</div>

                  <div className="w-[22%]">Trade</div>
                  {/* <div className="w-[8%]">CGT</div>
                  <div className="w-[10%] text-center"></div>
                  <div className="w-[10%]">ETH/BNB</div> */}
                  <div className="w-[14%]">Price per CGT</div>
                  <div className="w-[14%] text-center">Price Impact</div>
                  <div className="w-[5%] text-center">Tx</div>
                </div>

                {sortedTrades.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((trade, index) => {
                  const cgtAmount = Math.abs(parseFloat(trade.amount0));
                  const ethAmount = Math.abs(parseFloat(trade.amount1));
                  const usdValue = parseFloat(trade.usdValue);
                  const pricePerCGT = parseFloat(trade.pricePerToken);
                  const priceImpactValue = parseFloat(trade.priceImpact);
                  const tradeSizeColor = getTradeSizeColor(trade.tradeSize);

                  return (
                    <div key={index} className="flex flex-row gap-2 lg:gap-5 text-white/70 bg-blue-500/10 rounded-sm px-1 py-0.5 items-center mb-2">
                      <div className="w-[4%] flex flex-col justify-center">
                        <div className={`text-sm md:text-md text-center bg-black/30 px-2 py-0.5 w-fit rounded-md ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.type.toUpperCase()}
                        </div>
                      </div>
                      <div className="w-[4%] flex justify-center items-center">
                        {trade.chain === 'ETH' ? (
                          <FaEthereum className="text-md md:text-lg text-blue-400" title="Ethereum" />
                        ) : (
                          <SiBinance className="text-md text-yellow-400" title="Binance Smart Chain" />
                        )}
                      </div>
                      <div className="w-[10%] text-white/70 text-xs">{format(trade.timestamp * 1000)}</div>

                      <div className="w-[8%] flex flex-row justify-end rounded-md text-sm text-white font-bold">
                          ${Number(usdValue).toLocaleString('en-US', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </div>

                      <div className=" w-[22%] flex flex-row justify-between bg-black/20 py-1 px-3 rounded-md">
                        <div className="w-5/12 text-blue-200/80 text-sm md:text-md">
                          {Number(cgtAmount).toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })} CGT
                        </div>
                        <div className="w-2/12 flex justify-center items-center">
                          {trade.type === 'sell' ? (
                            <FaArrowRight className="text-lg text-red-500" />
                          ) : (
                            <FaArrowLeft className="text-lg text-green-500" />
                          )}
                        </div>
                        <div className="w-5/12 text-right text-blue-200/80 text-sm md:text-md">{ethAmount.toFixed(6)} {trade.chain === 'ETH' ? 'ETH' : 'BNB'}</div>
                      </div>

                      <div className="w-[15%] flex flex-row gap-3 text-sm">
                        <div>{pricePerCGT.toFixed(8)} {trade.chain === 'ETH' ? 'ETH' : 'BNB'}</div>
                        <div>
                          ${(pricePerCGT * (trade.chain === 'ETH' ? marketPrices.eth : marketPrices.bnb)).toFixed(4)}
                        </div>
                      </div>
                      <div className={`w-[14%] text-sm md:text-md text-center ${priceImpactValue > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {priceImpactValue > 0 ? '+' : '-'}{Math.abs(priceImpactValue).toFixed(2)}%
                      </div>
                      <div className="w-[5%] flex justify-center">
                        <a href={getExplorerUrl(trade.chain, trade.transactionHash)} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm md:text-md">
                          <FaExternalLinkAlt />
                        </a>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center md:justify-end items-center mt-10">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="mr-2 px-2 py-1 bg-blue-600 text-white rounded-md disabled:bg-black/40"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            <span className="mx-2 text-white/70 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-md disabled:bg-black/40"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>

        </div>

      </CardLayout>
    </div>
  );
};

export default TradesTable;