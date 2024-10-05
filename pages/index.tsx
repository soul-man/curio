import * as React from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import Intro from '@/components/_intro/Intro';
import About from '@/components/sections/About';
import Dashboard from '@/components/sections/Dashboard';
import Pools from '@/components/sections/Pools';
import Store from '@/components/sections/Store';
import MadeBy from '@/components/sections/MadeBy';

export default function CurioDao() {
  return (
    <Layout>
      <Header />
      <Intro />
      <About />
      <Dashboard />
      <Pools />
      {/* <Store /> */}
      <MadeBy />
    </Layout>
  );
}
