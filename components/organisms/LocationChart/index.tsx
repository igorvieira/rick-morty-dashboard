'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { fetchLocationStats } from '@/lib/fetch-location-stats';
import { ChartSkeleton } from './skeleton';
import { LocationStats } from '@/type/character';

interface LocationChartProps {
  searchTerm?: string;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'
];

interface CustomLegendProps {
  data: LocationStats[];
  colors: string[];
}

const CustomLegend = ({ data, colors }: CustomLegendProps) => {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.count, 0), [data]);

  return (
    <div className="mt-4 space-y-2">
      {data.map((item, index) => {
        const percentage = ((item.count / total) * 100).toFixed(0);
        return (
          <div key={item.name} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-gray-700 flex-1">
              {item.name} — {item.count} ({percentage}%)
            </span>
          </div>
        );
      })}
    </div>
  );
};

export function LocationChart({ searchTerm }: LocationChartProps) {
  const [data, setData] = useState<LocationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLocationStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const stats = await fetchLocationStats(searchTerm || '');
        
        if (isMounted) {
          setData(stats);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load location data');
          console.error('Error loading location stats:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLocationStats();

    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  const chartData = useMemo(() => data, [data]);

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

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No location data available
      </div>
    );
  }

  return (
    <div className="h-96 flex flex-row gap-4">
      <div className="w-2/3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
        <CustomLegend data={chartData} colors={COLORS} />
    </div>
  );
}
