import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell,Legend } from 'recharts';


const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const outerData = [
    { name: 'Chrome', value: 69, color: '#0088FE' },
    { name: 'Safari', value: 9, color: '#00C49F' },
    { name: 'Edge', value: 8, color: '#FFBB28' },
    { name: 'Firefox', value: 7, color: '#FF8042' },
    { name: 'Other', value: 7, color: '#8884d8' },
  ];
  
  const innerData = [
    { name: 'Chrome 2020', value: 60, color: '#FF8042' },
    { name: 'Safari 2020', value: 10, color: '#FFBB28' },
    { name: 'Edge 2020', value: 10, color: '#00C49F' },
    { name: 'Firefox 2020', value: 10, color: '#0088FE' },
  ];

const Dashboard:React.FC = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Desktop Browser Market Share</h3>
        <h4 className="text-sm text-gray-500 mb-4">September 2022</h4>
        <ResponsiveContainer width="100%" height={350}>
        <PieChart width={350} height={350}>
      <Pie
        data={outerData}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={70}
        fill="#8884d8"
        label
      >
        {outerData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Pie
        data={innerData}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={100}
        outerRadius={120}
        fill="#82ca9d"
        label
      >
        {innerData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
   
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
   
    </div>
  
);

export default Dashboard;