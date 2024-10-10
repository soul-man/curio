import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import CardAth from '../Ath';

jest.mock('@/components/ui/render-skeleton', () => ({
  Skeleton: jest.fn(() => <div data-testid="skeleton" />)
}));

jest.mock('@/components/ui/GradientHeaderH4', () => ({
  GradientHeaderH4: jest.fn(() => <div data-testid="gradient-header-h4" />)
}));

describe('CardAth Component', () => {
  it('renders skeletons initially', () => {
    render(<CardAth />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('renders data after skeletons disappear', async () => {
    const props = {
      ath: '50000',
      athTime: '2021-04-14',
      athChange: '10'
    };

    render(<CardAth {...props} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    expect(screen.getByText('$50000')).toBeInTheDocument();
    expect(screen.getByText('2021-04-14')).toBeInTheDocument();
    expect(screen.getByText('+10 %')).toBeInTheDocument();
  });

  it('renders negative athChange correctly', async () => {
    const props = {
      ath: '50000',
      athTime: '2021-04-14',
      athChange: '-10'
    };

    render(<CardAth {...props} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    expect(screen.getByText('-10 %')).toHaveClass('text-red-500');
  });

  it('renders positive athChange correctly', async () => {
    const props = {
      ath: '50000',
      athTime: '2021-04-14',
      athChange: '10'
    };

    render(<CardAth {...props} />);

    await waitFor(() => expect(screen.queryAllByTestId('skeleton')).toHaveLength(0), { timeout: 2100 });

    expect(screen.getByText('+10 %')).toHaveClass('text-green-500');
  });
});