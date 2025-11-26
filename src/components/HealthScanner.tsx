import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Camera, Upload, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';

export function HealthScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const performScan = () => {
    setScanning(true);
    setScanResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      setScanResult({
        healthScore: 92,
        status: 'Excellent',
        issues: [],
        insights: [
          {
            type: 'success',
            title: 'Vibrant Foliage',
            description: 'Leaves show healthy deep green coloration with excellent fenestration patterns.',
          },
          {
            type: 'success',
            title: 'No Pest Activity',
            description: 'No signs of common pests like spider mites, thrips, or scale insects detected.',
          },
          {
            type: 'info',
            title: 'Minor Dust Accumulation',
            description: 'Some dust on leaves detected. Consider gently wiping leaves with a damp cloth for optimal photosynthesis.',
          },
        ],
        recommendations: [
          'Continue current watering schedule',
          'Wipe leaves monthly to remove dust',
          'Monitor new growth for fenestration development',
        ],
      });
      setScanning(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Visual Health Scanner</CardTitle>
          <CardDescription>
            Use AI-powered computer vision to detect early signs of stress, disease, or nutrient deficiency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!scanResult && !scanning && (
            <>
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300">
                <div className="text-center p-6">
                  <Camera className="w-16 h-16 text-green-600 mx-auto mb-3" />
                  <p className="text-green-700 mb-2">Take or upload a photo</p>
                  <p className="text-sm text-gray-500">Position your plant's leaves in frame</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={performScan}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  onClick={performScan}
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </>
          )}

          {scanning && (
            <div className="space-y-4 py-8">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                <Camera className="w-16 h-16 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing image...</span>
                  <span>AI Processing</span>
                </div>
                <Progress value={66} className="h-2" />
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Detecting leaf structure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Analyzing color patterns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking for anomalies...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="space-y-4 py-4">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-4xl">{scanResult.healthScore}</span>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600 text-lg px-4 py-1">
                    {scanResult.status}
                  </Badge>
                </div>
              </div>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-green-900 mb-1">Overall Health: Excellent</h3>
                      <p className="text-sm text-green-700">
                        Your Monstera is in great condition! All vitals are optimal and no issues detected.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h3>Detailed Analysis</h3>
                {scanResult.insights.map((insight: any, index: number) => (
                  <Alert key={index} className={insight.type === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
                    {insight.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-600" />
                    )}
                    <AlertTitle className={insight.type === 'success' ? 'text-green-900' : 'text-blue-900'}>
                      {insight.title}
                    </AlertTitle>
                    <AlertDescription className={insight.type === 'success' ? 'text-green-700' : 'text-blue-700'}>
                      {insight.description}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {scanResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={() => setScanResult(null)}
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
              >
                Scan Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          Our AI analyzes leaf color, texture, spots, and patterns to detect over 50 common plant issues including nutrient deficiencies, pests, and diseases.
        </AlertDescription>
      </Alert>
    </div>
  );
}
