import { Droplets, Sun, Sprout } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HealthBar } from './HealthBar';
import type { Plant, Environment } from '../App';

type PlantCardProps = {
  plant: Plant;
  environment?: Environment;
  onClick: () => void;
};

export function PlantCard({ plant, environment, onClick }: PlantCardProps) {
  const getOverallStatus = (health: number) => {
    if (health >= 80) return { text: 'Thriving', color: 'text-green-600' };
    if (health >= 60) return { text: 'Healthy', color: 'text-green-600' };
    if (health >= 40) return { text: 'Needs Attention', color: 'text-amber-600' };
    return { text: 'Needs Care', color: 'text-red-600' };
  };

  const status = getOverallStatus(plant.health.overall);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-colors"
    >
      <div className="flex gap-4 p-4">
        {/* Plant image */}
        <div className="flex-shrink-0 w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={plant.image}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Plant info */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="min-w-0 flex-1">
              <h3 className="truncate">{plant.name}</h3>
              <p className="text-sm text-neutral-600 truncate">{plant.species}</p>
            </div>
            <span className={`text-sm ml-2 flex-shrink-0 ${status.color}`}>
              {status.text}
            </span>
          </div>

          {/* Health indicators */}
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <HealthBar value={plant.health.water} color="blue" size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <HealthBar value={plant.health.sunlight} color="amber" size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-green-600 flex-shrink-0" />
              <HealthBar value={plant.health.soil} color="green" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Next action */}
      {plant.nextWatering && (
        <div className="px-4 pb-4">
          <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
            <p className="text-sm text-blue-900">
              Next watering: {plant.nextWatering}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
