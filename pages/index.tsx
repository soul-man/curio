import * as React from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import Intro from '@/components/sections/Intro';
import Dashboard from '@/components/sections/Dashboard';
import DexTrades from '@/components/sections/DexTrades';
import Pools from '@/components/sections/Pools';
import MadeBy from '@/components/sections/MadeBy';

export default function CurioDao() {
  return (
    <Layout>
      <Header />
      <Intro />
      <Dashboard />
      <Pools />
      <DexTrades />
      <MadeBy />
    </Layout>
  );
}
