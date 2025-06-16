'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { fetchLocationStats } from '@/lib/fetch-location-stats';
import { ChartSkeleton } from './skeleton';
import { LocationStats } from '@/type/character';

interface LocationChartProps {
  searchTerm?: string;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
];

export function LocationChart({ searchTerm }: LocationChartProps) {
  const [data, setData] = useState<LocationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocationStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await fetchLocationStats(searchTerm || '');
        setData(stats);
      } catch (err) {
        setError('Failed to load location data');
        console.error('Error loading location stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLocationStats();
  }, [searchTerm]);

  if (loading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No location data available
      </div>
    );
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
