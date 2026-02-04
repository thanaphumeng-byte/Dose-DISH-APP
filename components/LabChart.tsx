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
  isDark?: boolean;
}

const LabChart: React.FC<LabChartProps> = ({ data, title, noDataText, isDark = false }) => {
  if (data.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400 text-center py-8">{noDataText}</div>;
  }

  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipText = isDark ? '#f1f5f9' : '#1e293b';

  return (
    <div className="w-full h-64 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: textColor, fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                backgroundColor: tooltipBg,
                color: tooltipText
            }}
          />
          <ReferenceLine y={100} label="Target" stroke="#10b981" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#0f766e" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#0f766e', strokeWidth: 2, stroke: isDark ? '#1e293b' : '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LabChart;