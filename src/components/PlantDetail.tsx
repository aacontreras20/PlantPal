import { ArrowLeft, Droplets, Sun, Sprout, CheckCircle2, Circle, MapPin, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HealthBar } from './HealthBar';
import type { Plant, Environment } from '../App';

type PlantDetailProps = {
  plant: Plant;
  environment?: Environment;
  onBack: () => void;
  onUpdate: (plant: Plant) => void;
  onViewEnvironment: (environmentId: string) => void;
};

export function PlantDetail({
  plant,
  environment,
  onBack,
  onUpdate,
  onViewEnvironment,
}: PlantDetailProps) {
  const handleToggleTask = (taskId: string) => {
    const updatedPlant = {
      ...plant,
      tasks: plant.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    };
    onUpdate(updatedPlant);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with image */}
      <div className="relative">
        <div className="h-64 bg-neutral-100 relative overflow-hidden">
          <ImageWithFallback
            src={plant.image}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
        >
          <Camera className="w-4 h-4 mr-2" />
          Rescan Plant
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Plant info */}
          <div className="mb-6">
            <h1 className="mb-1">{plant.name}</h1>
            <p className="text-neutral-600">{plant.species}</p>
          </div>

          {/* Overall health */}
          <div className="bg-neutral-50 rounded-xl p-4 mb-6 border border-neutral-200">
            <p className="text-sm text-neutral-600 mb-3">Overall Health</p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Water</span>
                  </div>
                  <span className="text-sm text-neutral-600">{plant.health.water}%</span>
                </div>
                <HealthBar value={plant.health.water} color="blue" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Sunlight</span>
                  </div>
                  <span className="text-sm text-neutral-600">{plant.health.sunlight}%</span>
                </div>
                <HealthBar value={plant.health.sunlight} color="amber" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Soil Quality</span>
                  </div>
                  <span className="text-sm text-neutral-600">{plant.health.soil}%</span>
                </div>
                <HealthBar value={plant.health.soil} color="green" />
              </div>
            </div>
          </div>

          {/* Care instructions */}
          <div className="mb-6">
            <h3 className="mb-3">Care Instructions</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Watering</p>
                  <p className="text-sm text-neutral-600">{plant.careInstructions.wateringFrequency}</p>
                  {plant.lastWatered && (
                    <p className="text-xs text-neutral-500 mt-1">Last watered {plant.lastWatered}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Sun className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Light Needs</p>
                  <p className="text-sm text-neutral-600">{plant.careInstructions.sunlightNeeds}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Placement</p>
                  <p className="text-sm text-neutral-600">{plant.careInstructions.placement}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Environment */}
          {environment && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3>Environment</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewEnvironment(environment.id)}
                >
                  View Details
                </Button>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <p className="mb-2">{environment.name}</p>
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span>{environment.direction}</span>
                  <span>•</span>
                  <span>{environment.lightIntensity}% light</span>
                  <span>•</span>
                  <span>{environment.weather.temperature}°F</span>
                </div>
              </div>
            </div>
          )}

          {/* Weekly tasks */}
          <div className="mb-6">
            <h3 className="mb-3">Weekly Care Tasks</h3>
            <div className="space-y-2">
              {plant.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                  )}
                  <div className="flex-1 text-left">
                    <p className={`text-sm ${task.completed ? 'line-through text-neutral-400' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-neutral-500">{task.frequency}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
