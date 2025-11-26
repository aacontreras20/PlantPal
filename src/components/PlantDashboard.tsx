import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { SensorChart } from './SensorChart';
import { Droplets, ThermometerSun, Sun, Calendar, TrendingUp } from 'lucide-react';

export function PlantDashboard() {
  // Mock sensor data
  const currentData = {
    moisture: 68,
    temperature: 22,
    light: 75,
    lastWatered: '2 days ago',
    nextWatering: 'Tomorrow',
    health: 'Thriving',
  };

  const getSensorStatus = (value: number, type: string) => {
    if (type === 'moisture') {
      if (value > 60) return { color: 'bg-green-500', label: 'Optimal' };
      if (value > 30) return { color: 'bg-yellow-500', label: 'Low' };
      return { color: 'bg-red-500', label: 'Critical' };
    }
    if (type === 'temperature') {
      if (value >= 18 && value <= 26) return { color: 'bg-green-500', label: 'Perfect' };
      if (value >= 15 && value <= 30) return { color: 'bg-yellow-500', label: 'OK' };
      return { color: 'bg-red-500', label: 'Stress' };
    }
    if (type === 'light') {
      if (value > 60) return { color: 'bg-green-500', label: 'Excellent' };
      if (value > 30) return { color: 'bg-yellow-500', label: 'Moderate' };
      return { color: 'bg-red-500', label: 'Low' };
    }
    return { color: 'bg-gray-500', label: 'Unknown' };
  };

  return (
    <div className="space-y-4">
      {/* Plant Status Card */}
      <Card className="border-green-200 bg-gradient-to-br from-white to-green-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                🪴 Monstera Deliciosa
              </CardTitle>
              <CardDescription>Swiss Cheese Plant</CardDescription>
            </div>
            <Badge className="bg-green-500 hover:bg-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              {currentData.health}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-gray-500 text-xs">Last watered</div>
                <div>{currentData.lastWatered}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-gray-500 text-xs">Next watering</div>
                <div>{currentData.nextWatering}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Readings */}
      <Card>
        <CardHeader>
          <CardTitle>Live Sensor Data</CardTitle>
          <CardDescription>Real-time monitoring from your PlantPal sensor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Soil Moisture */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>Soil Moisture</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{currentData.moisture}%</span>
                <Badge variant="outline" className={`${getSensorStatus(currentData.moisture, 'moisture').color} text-white border-0`}>
                  {getSensorStatus(currentData.moisture, 'moisture').label}
                </Badge>
              </div>
            </div>
            <Progress value={currentData.moisture} className="h-2" />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-orange-600" />
                <span>Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{currentData.temperature}°C</span>
                <Badge variant="outline" className={`${getSensorStatus(currentData.temperature, 'temperature').color} text-white border-0`}>
                  {getSensorStatus(currentData.temperature, 'temperature').label}
                </Badge>
              </div>
            </div>
            <Progress value={(currentData.temperature / 40) * 100} className="h-2" />
          </div>

          {/* Light Exposure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-600" />
                <span>Light Exposure</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{currentData.light}%</span>
                <Badge variant="outline" className={`${getSensorStatus(currentData.light, 'light').color} text-white border-0`}>
                  {getSensorStatus(currentData.light, 'light').label}
                </Badge>
              </div>
            </div>
            <Progress value={currentData.light} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Historical Charts */}
      <SensorChart />
    </div>
  );
}
