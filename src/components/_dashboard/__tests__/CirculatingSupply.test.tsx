import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CirculatingSupply from '../CirculatingSupply';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn().mockImplementation(({ children, ...props }) => (
      <div {...props}>{children}</div>
    )),
  },
  useInView: jest.fn().mockReturnValue(true),
}));

// Mock the dynamic import of react-apexcharts
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="mocked-chart">Mocked Chart</div>;
  return DynamicComponent;
});

jest.mock('@/components/ui/render-skeleton', () => ({
  Skeleton: jest.fn(() => <div data-testid="skeleton" />)
}));

jest.mock('@/components/ui/GradientHeaderH4', () => ({
  GradientHeaderH4: jest.fn(({ headline }) => <div data-testid="gradient-header-h4">{headline}</div>)
}));

jest.mock('../../../utils/helpers', () => ({
  abbreviateNumber: jest.fn((num) => `${num}`)
}));

describe('CirculatingSupply Component', () => {
  const mockSupply = {
    cgtSupplyOnEth: 1000000,
    cgtSupplyOnBsc: 2000000,
    cgtSupplyOnKusama: 3000000,
    cgtSupplyOnTon: 4000000,
    cgtSupplyOnNeon: 5000000
  };

  it('renders skeletons initially', () => {
    render(<CirculatingSupply supply={mockSupply} />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(2);
  });

  it('renders data after skeletons disappear and animation completes', async () => {
    render(<CirculatingSupply supply={mockSupply} />);

    // Wait for skeletons to disappear and animation to complete
    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    // Check for rendered data
    await waitFor(() => {
      expect(screen.getAllByText('100000000')).toHaveLength(2);
    });
  });

  it('renders GradientHeaderH4 components', async () => {
    render(<CirculatingSupply supply={mockSupply} />);
    
    await waitFor(() => {
      expect(screen.getByText('Circ. Supply')).toBeInTheDocument();
      expect(screen.getByText('Max. Supply')).toBeInTheDocument();
    });
  });

  it('renders the Chart component', async () => {
    render(<CirculatingSupply supply={mockSupply} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('mocked-chart')).toBeInTheDocument();
    });
  });
});