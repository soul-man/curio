import React from 'react';
import Spinner from '../Spinner';
import ApexChart from '../ApexChart';

const CardAthAtl = (props: any) => {

  if (!props.loaded) {
    return (
      <>
          <div className="col-span-12 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-white rounded-2xl">
            <Spinner />
          </div>
      </>
    );
  } else {
    return (
      <div className="col-span-12 flex flex-col md:flex-row gap-5">
          
        <div className="w-12/12 md:w-6/12 flex flex-col bg-[#074383] px-5 py-3 rounded-md">
          <div className="mb-1 text-lg font-thin text-white/70">
            All-Time High
          </div>
          <div className="flex flex-row gap-10 md:gap-1 justify-between items-center">
            <div className="flex flex-col text-white">
              <div className="text-xl font-semibold">
                ${props.ath}
              </div>
              <div className="text-sm text-blue-300/70 font-light">
              {props.athTime}
              </div>
            </div>
            <div className={"bg-black/40 px-2 py-1 rounded-md text-sm " + (parseInt(props.athChange) > 0 ? 'text-green-500' : 'text-red-500')}>
              {props.athChange > 0 ? '+' : ''}
              {props.athChange} %
            </div>
          </div>
        </div>

        <div className="w-12/12 md:w-6/12  flex flex-col bg-[#074383] px-5 py-3 rounded-md">
          <div className="mb-1 text-lg font-thin text-white/70">
            All-Time Low
          </div>
          <div className="flex flex-row gap-10 md:gap-1 justify-between items-center">
            <div className="flex flex-col text-white">
              <div className="text-xl font-semibold">
                ${props.atl}
              </div>
              <div className="text-sm text-blue-300/70 font-light">
                {props.atlTime}
              </div>
            </div>
            <div className={"bg-black/40 px-2 py-1 rounded-md text-sm " + (parseInt(props.atlChange) > 0 ? 'text-green-500' : 'text-red-500')}>
              {props.atlChange > 0 ? '+' : ''}
              {props.atlChange} %
            </div>
          </div>
        </div>

      </div>
    );
  }
};

export default CardAthAtl;
