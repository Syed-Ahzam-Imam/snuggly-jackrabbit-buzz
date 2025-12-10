import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: 'Jan', completions: 4000 },
  { name: 'Feb', completions: 3000 },
  { name: 'Mar', completions: 2000 },
  { name: 'Apr', completions: 2780 },
  { name: 'May', completions: 1890 },
  { name: 'Jun', completions: 2390 },
  { name: 'Jul', completions: 3490 },
];

const CompletionRateChart: React.FC = () => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Diagnostic Completions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '8px',
                }}
                labelStyle={{ color: '#333333', fontWeight: 'bold' }}
                itemStyle={{ color: '#666666' }}
              />
              <Line type="monotone" dataKey="completions" stroke="#3b82f6" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionRateChart;