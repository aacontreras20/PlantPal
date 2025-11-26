import { ArrowLeft, Sun, Thermometer, Droplets, Wind, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import type { Plant, Environment } from '../App';

type EnvironmentDetailProps = {
  environment: Environment;
  plants: Plant[];
  onBack: () => void;
};

export function EnvironmentDetail({ environment, plants, onBack }: EnvironmentDetailProps) {
  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 80) return 'text-green-600 bg-green-100';
    if (suitability >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const maxIntensity = Math.max(...environment.lightPattern.map(p => p.intensity));

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3 mb-6">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2>{environment.name}</h2>
            <p className="text-sm text-neutral-600">{environment.direction}</p>
          </div>
        </div>

        {/* Suitability score */}
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getSuitabilityColor(environment.suitability)}`}>
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">{environment.suitability}% suitable for plants</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Current conditions */}
        <div className="mb-6">
          <h3 className="mb-3">Current Conditions</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-neutral-600">Light</span>
              </div>
              <p className="text-xl">{environment.lightIntensity}%</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-red-600" />
                <span className="text-sm text-neutral-600">Temp</span>
              </div>
              <p className="text-xl">{environment.weather.temperature}°F</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-neutral-600">Humidity</span>
              </div>
              <p className="text-xl">{environment.weather.humidity}%</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-neutral-600" />
                <span className="text-sm text-neutral-600">Weather</span>
              </div>
              <p className="text-sm">{environment.weather.current}</p>
            </div>
          </div>
        </div>

        {/* Light pattern throughout day */}
        <div className="mb-6">
          <h3 className="mb-3">Daily Light Pattern</h3>
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
            <div className="flex items-end justify-between h-32 gap-2">
              {environment.lightPattern.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 flex items-end w-full">
                    <div
                      className="w-full bg-amber-400 rounded-t transition-all"
                      style={{
                        height: `${(point.intensity / maxIntensity) * 100}%`,
                        minHeight: '4px',
                      }}
                    />
                  </div>
                  <span className="text-xs text-neutral-600">{point.hour}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-neutral-600 mt-3">
            Peak sunlight occurs between 8AM-12PM. This is ideal for most indoor plants that prefer bright, indirect light.
          </p>
        </div>

        {/* Placement recommendations */}
        <div className="mb-6">
          <h3 className="mb-3">Placement Recommendations</h3>
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-900 mb-1">✓ Well-suited for</p>
              <p className="text-sm text-green-700">
                Medium to high light plants like Monstera, Pothos, and Philodendron
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-900 mb-1">⚠ May need adjustment</p>
              <p className="text-sm text-amber-700">
                Low-light plants might get too much sun during morning hours
              </p>
            </div>
          </div>
        </div>

        {/* Seasonal note */}
        <div className="mb-6">
          <h3 className="mb-3">Seasonal Changes</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              In winter months, light intensity may decrease by 20-30%. Consider using supplemental grow lights or relocating plants closer to the window.
            </p>
          </div>
        </div>

        {/* Plants in this environment */}
        {plants.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3">
              Plants in this location ({plants.length})
            </h3>
            <div className="space-y-2">
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                  <div className="flex-1">
                    <p className="text-sm">{plant.name}</p>
                    <p className="text-xs text-neutral-600">{plant.species}</p>
                  </div>
                  <span className="text-xs text-neutral-600">
                    {plant.health.overall}% health
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
