import React from 'react';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import Spinner from '../Spinner';
import { abbreviateNumber } from '../../utils/helpers';

const Volume = (props: any) => {
  if (!props.loaded) {
    return (
      <div className="col-span-12 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-black/90 dark:text-white rounded-2xl">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col">
        <GradientHeaderH4 headline="Volume 24h" />

        <div className="text-2xl md:text-3xl font-bold text-white">
          <span className="font-extralight">$</span>{" "}
          {abbreviateNumber(props.volume)}
        </div>
      </div>
    </>
  );
};

export default Volume;