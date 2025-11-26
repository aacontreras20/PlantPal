import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function SensorChart() {
  // Mock historical data for the past week
  const data = [
    { time: 'Mon', moisture: 75, temperature: 21, light: 65 },
    { time: 'Tue', moisture: 70, temperature: 22, light: 70 },
    { time: 'Wed', moisture: 65, temperature: 23, light: 68 },
    { time: 'Thu', moisture: 72, temperature: 22, light: 72 },
    { time: 'Fri', moisture: 68, temperature: 21, light: 75 },
    { time: 'Sat', moisture: 64, temperature: 22, light: 73 },
    { time: 'Today', moisture: 68, temperature: 22, light: 75 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Trends</CardTitle>
        <CardDescription>Historical sensor data and patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="moisture" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Moisture %"
              dot={{ fill: '#3b82f6', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Temp °C"
              dot={{ fill: '#f59e0b', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="light" 
              stroke="#eab308" 
              strokeWidth={2}
              name="Light %"
              dot={{ fill: '#eab308', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
