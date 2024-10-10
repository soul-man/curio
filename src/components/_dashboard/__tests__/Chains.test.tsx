import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chains from '../Chains';

// Mock the required components and hooks
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  },
  useInView: jest.fn(() => true),
}));

jest.mock('@/components/ui/GradientHeaderH4', () => ({
  GradientHeaderH4: jest.fn(() => <div data-testid="gradient-header-h4" />),
}));

jest.mock('@/components/ui/Tooltip', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="tooltip">{children}</div>),
}));

describe('Chains Component', () => {
  it('renders the component with correct header', () => {
    render(<Chains />);
    expect(screen.getByTestId('gradient-header-h4')).toBeInTheDocument();
  });

  it('renders all chain items', async () => {
    render(<Chains />);
    await waitFor(() => {
      expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
    });
    
    // Check for specific chains
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Binance Smart Chain')).toBeInTheDocument();
    expect(screen.getByText('Curio Chain')).toBeInTheDocument();
    expect(screen.getByText('TON')).toBeInTheDocument();
    expect(screen.getByText('Solana Neon EVM')).toBeInTheDocument();
  });

  it('displays "coming soon" for upcoming chains', () => {
    render(<Chains />);
    expect(screen.getAllByText('coming soon').length).toBeGreaterThan(0);
  });

  it('renders correct icons for each chain', () => {
    render(<Chains />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('src', './images/chains/ethereum.png');
    expect(images[1]).toHaveAttribute('src', './images/chains/binance-chain.png');
  });

  it('renders tooltips for contract and bridge icons', () => {
    render(<Chains />);
    const tooltips = screen.getAllByTestId('tooltip');
    expect(tooltips.length).toBeGreaterThan(0);
  });
});