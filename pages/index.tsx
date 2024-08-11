import * as React from 'react';
import Layout from '@/components/layout/Layout';
import Intro from '@/components/Intro';
import Dashboard from '@/components/Dashboard';
import Info from '@/components/Info';
import InfoBoxes from '@/components/InfoBoxes';
import DexTrades from '@/components/DexTrades';

export default function HomePage1() {
  return (
    <Layout>
      <Intro />
      <Dashboard />
      <DexTrades />
      {/* <InfoBoxes /> */}
      {/* <Info /> */}
    </Layout>
  );
}
