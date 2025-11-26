import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Droplets, 
  Bell, 
  Wifi, 
  Battery, 
  Zap, 
  Calendar,
  MapPin,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function PlantSettings() {
  return (
    <div className="space-y-4">
      {/* Plant Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Plant Profile</CardTitle>
          <CardDescription>Your Monstera Deliciosa information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Plant Name</Label>
              <p className="text-sm text-gray-500">Monstera Deliciosa</p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Planted Date</Label>
              <p className="text-sm text-gray-500">March 15, 2024</p>
            </div>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Location</Label>
              <p className="text-sm text-gray-500">Living Room, East Window</p>
            </div>
            <MapPin className="w-4 h-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Automation</CardTitle>
          <CardDescription>AI-powered watering and care automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-600" />
                <Label>Auto-Watering</Label>
                <Badge variant="outline" className="bg-green-500 text-white border-0 text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-gray-500">System learns optimal watering patterns</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <Label>Adaptive Learning</Label>
              </div>
              <p className="text-sm text-gray-500">AI adjusts care based on plant response</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Learning Progress</span>
              <span>78%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <p className="text-xs text-gray-500">22 days of pattern analysis completed</p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Stay updated on your plant's needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Watering Reminders</Label>
              <p className="text-sm text-gray-500">Get notified when watering is needed</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Health Alerts</Label>
              <p className="text-sm text-gray-500">Alerts for potential issues detected</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Growth Milestones</Label>
              <p className="text-sm text-gray-500">Celebrate your plant's progress</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Daily Check-ins</Label>
              <p className="text-sm text-gray-500">Morning plant status summary</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Sensor Status */}
      <Card>
        <CardHeader>
          <CardTitle>PlantPal Sensor</CardTitle>
          <CardDescription>Device status and connectivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-600" />
                <Label>Connection Status</Label>
              </div>
              <p className="text-sm text-gray-500">Connected via WiFi</p>
            </div>
            <Badge variant="outline" className="bg-green-500 text-white border-0">
              Online
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-green-600" />
                <Label>Battery Level</Label>
              </div>
              <p className="text-sm text-gray-500">Estimated 45 days remaining</p>
            </div>
            <span>87%</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Last Sync</Label>
              <p className="text-sm text-gray-500">2 minutes ago</p>
            </div>
            <Button variant="outline" size="sm">Sync Now</Button>
          </div>
          <Separator />
          <div className="space-y-1">
            <Label>Firmware Version</Label>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">v2.1.3</p>
              <Badge variant="outline" className="text-xs">Up to date</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Mode */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1">Going on a trip?</p>
              <p className="text-sm text-blue-700">Enable Travel Mode for extended auto-care</p>
            </div>
            <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Enable
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
