import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  YAxis,
} from 'recharts';

const CustomBarChart = ({ data }) => {
  // Fungsi untuk menentukan warna bar berdasarkan priority dengan variasi merah
  const getBarColor = (entry) => {
    if (!entry || !entry.priority) return '#00BC7D';
    const priority = entry.priority.trim().toLowerCase();

    switch (priority) {
      case 'low':
        return '#2bb6ab'; // Hijau
      case 'medium':
        return '#c8d2df'; // Oranye
      case 'high':
        return '#da4e5f'; // Maroon, variasi merah yang agak gelap
      default:
        return '#00BC7D'; // Default (Hijau sedikit berbeda)
    }
  };

  // Tooltip kustom
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.priority || 'Unknown'}
          </p>
          <p className="text-sm text-gray-600">
            Count:{' '}
            <span className="text-sm font-medium text-gray-900">
              {payload[0].payload.count}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: '#555' }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: '#555' }} />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'transparent' }}
            wrapperStyle={{ outline: 'none' }}
          />

          <Bar dataKey="count" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`${entry.priority}-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
