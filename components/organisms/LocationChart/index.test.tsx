import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';

vi.mock('./skeleton', () => ({
  ChartSkeleton: () => <div data-testid="chart-skeleton">Loading chart...</div>,
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ data }: { data: any[] }) => (
    <div data-testid="pie" data-count={data.length}>
      {data.map((item, index) => (
        <div key={index} data-testid="pie-cell">{item.name}: {item.count}</div>
      ))}
    </div>
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

vi.mock('@/lib/fetch-location-stats', () => ({
  fetchLocationStats: vi.fn(),
}));

import { LocationChart } from './';

import { fetchLocationStats } from '@/lib/fetch-location-stats';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const mockData = [
  { name: 'Earth', count: 10 },
  { name: 'Mars', count: 5 },
];

test('shows skeleton while loading', () => {
  vi.mocked(fetchLocationStats).mockImplementation(() => new Promise(() => { }));

  render(<LocationChart />);

  expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
});

test('renders chart with data', async () => {
  vi.mocked(fetchLocationStats).mockResolvedValue(mockData);

  render(<LocationChart searchTerm="rick" />);

  await waitFor(() => {
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByText('Earth: 10')).toBeInTheDocument();
    expect(screen.getByText('Mars: 5')).toBeInTheDocument();
  });
});

test('shows error message on fetch failure', async () => {
  vi.mocked(fetchLocationStats).mockRejectedValue(new Error('API Error'));

  render(<LocationChart />);

  await waitFor(() => {
    expect(screen.getByText('Failed to load location data')).toBeInTheDocument();
  });
});

test('shows no data message when empty', async () => {
  vi.mocked(fetchLocationStats).mockResolvedValue([]);

  render(<LocationChart />);

  await waitFor(() => {
    expect(screen.getByText('No location data available')).toBeInTheDocument();
  });
});

test('calls fetch with search term', () => {
  vi.mocked(fetchLocationStats).mockResolvedValue(mockData);

  render(<LocationChart searchTerm="morty" />);

  expect(fetchLocationStats).toHaveBeenCalledWith('morty');
});
