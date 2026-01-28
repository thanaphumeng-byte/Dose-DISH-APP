import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { LabDataPoint } from '../types';

interface LabChartProps {
  data: LabDataPoint[];
  title: string;
  noDataText: string;
}

const LabChart: React.FC<LabChartProps> = ({ data, title, noDataText }) => {
  if (data.length === 0) {
    return <div className="text-gray-500 text-center py-8">{noDataText}</div>;
  }

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <ReferenceLine y={100} label="Target" stroke="#10b981" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#0f766e" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#0f766e', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LabChart;