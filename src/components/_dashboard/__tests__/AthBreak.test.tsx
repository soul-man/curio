import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import AthBreak from '../AthBreak';

jest.mock('@/components/ui/render-skeleton', () => ({
  Skeleton: jest.fn(() => <div data-testid="skeleton" />)
}));

jest.mock('@/components/ui/GradientHeaderH4', () => ({
  GradientHeaderH4: jest.fn(() => <div data-testid="gradient-header-h4" />)
}));

describe('AthBreak Component', () => {
  const ath = 0.0676;
  const marketPrice = 0.0207;

  it('renders skeletons initially', () => {
    render(<AthBreak ath={ath} marketPrice={marketPrice} />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('renders data after skeletons disappear', async () => {
    render(<AthBreak ath={ath} marketPrice={marketPrice} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    const growthFactor = (ath / marketPrice).toFixed(1);
    const growthPercentage = ((ath / marketPrice) * 100).toFixed(2);
    const priceDifference = (ath - marketPrice).toFixed(4);

    expect(screen.getAllByText(growthFactor)).toHaveLength(2);
    expect(screen.getByText(new RegExp(`${growthPercentage}%`))).toBeInTheDocument();
    expect(screen.getByText(priceDifference)).toBeInTheDocument();
    expect(screen.getByText(ath.toString())).toBeInTheDocument();
    expect(screen.getByText(marketPrice.toString())).toBeInTheDocument();
  });

  it('renders the correct growth factor', async () => {
    render(<AthBreak ath={ath} marketPrice={marketPrice} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    const growthFactor = (ath / marketPrice).toFixed(1);
    expect(screen.getAllByText(growthFactor)).toHaveLength(2);
  });

  it('renders the correct growth percentage', async () => {
    render(<AthBreak ath={ath} marketPrice={marketPrice} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    const growthPercentage = ((ath / marketPrice) * 100).toFixed(2);
    expect(screen.getByText(new RegExp(`${growthPercentage}%`))).toBeInTheDocument();
  });

  it('renders the correct price difference', async () => {
    render(<AthBreak ath={ath} marketPrice={marketPrice} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    const priceDifference = (ath - marketPrice).toFixed(4);
    expect(screen.getByText(priceDifference)).toBeInTheDocument();
  });
});