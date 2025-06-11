import { LineChart as LChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartLine } from 'react-icons/fa';
const LineChart = ({ data, title, dataKey, color }) => {
  return (
    <div className="h-64">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaChartLine className="text-purple-400" />
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <LChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '0.5rem'
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2 }}
          />
        </LChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;