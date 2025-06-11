import { BarChart as BChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartBar } from 'react-icons/fa';
const BarChart = ({ data, title, dataKey, color }) => {
  return (
    <div className="h-64">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaChartBar className="text-purple-400" />
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BChart data={data}>
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
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;