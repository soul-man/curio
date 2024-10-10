import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import CardAtl from '../Atl';

jest.mock('@/components/ui/render-skeleton', () => ({
  Skeleton: jest.fn(() => <div data-testid="skeleton" />)
}));

jest.mock('@/components/ui/GradientHeaderH4', () => ({
  GradientHeaderH4: jest.fn(() => <div data-testid="gradient-header-h4" />)
}));

describe('CardAtl Component', () => {
  it('renders skeletons initially', () => {
    render(<CardAtl />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('renders data after skeletons disappear', async () => {
    const props = {
      atl: '1000',
      atlTime: '2020-03-13',
      atlChange: '500'
    };

    render(<CardAtl {...props} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByText('2020-03-13')).toBeInTheDocument();
    expect(screen.getByText('+500 %')).toBeInTheDocument();
  });

  it('renders negative atlChange correctly', async () => {
    const props = {
      atl: '1000',
      atlTime: '2020-03-13',
      atlChange: '-20'
    };

    render(<CardAtl {...props} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    expect(screen.getByText('-20 %')).toHaveClass('text-red-500');
  });

  it('renders positive atlChange correctly', async () => {
    const props = {
      atl: '1000',
      atlTime: '2020-03-13',
      atlChange: '500'
    };

    render(<CardAtl {...props} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    expect(screen.getByText('+500 %')).toHaveClass('text-green-500');
  });

  it('renders GradientHeaderH4 component', () => {
    render(<CardAtl />);

    expect(screen.getByTestId('gradient-header-h4')).toBeInTheDocument();
  });
});