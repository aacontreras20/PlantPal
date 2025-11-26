import { MessageCircle, Plus, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, Circle, Droplets, Sun, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { PlantCard } from './PlantCard';
import { EnvironmentStage } from './EnvironmentStage';
import type { Plant, Environment } from '../App';
import { useState } from 'react';

type DashboardProps = {
  plants: Plant[];
  environments: Environment[];
  onViewPlant: (plantId: string) => void;
  onViewEnvironment: (environmentId: string) => void;
  onOpenChat: () => void;
  onViewRecommendations: () => void;
};

export function Dashboard({
  plants,
  environments,
  onViewPlant,
  onViewEnvironment,
  onOpenChat,
  onViewRecommendations,
}: DashboardProps) {
  const [selectedView, setSelectedView] = useState<'home' | number>('home'); // 'home' or environment index
  
  const currentEnvironment = selectedView === 'home' 
    ? null 
    : environments[selectedView as number];
  
  const filteredPlants = selectedView === 'home'
    ? plants
    : plants.filter(p => p.environmentId === currentEnvironment?.id);

  const handlePrevious = () => {
    setSelectedView(prev => {
      if (prev === 'home') return environments.length - 1;
      if (prev === 0) return 'home';
      return (prev as number) - 1;
    });
  };

  const handleNext = () => {
    setSelectedView(prev => {
      if (prev === 'home') return 0;
      if ((prev as number) === environments.length - 1) return 'home';
      return (prev as number) + 1;
    });
  };

  // Calculate stats for home page
  const avgHealth = plants.length > 0 
    ? Math.round(plants.reduce((sum, p) => sum + p.health.overall, 0) / plants.length)
    : 0;
  
  const plantsNeedingWater = plants.filter(p => p.health.water < 50).length;
  const plantsNeedingSun = plants.filter(p => p.health.sunlight < 50).length;
  
  // Get all incomplete tasks from all plants
  const allTasks = plants.flatMap(plant => 
    plant.tasks
      .filter(task => !task.completed)
      .map(task => ({ ...task, plantName: plant.name, plantId: plant.id }))
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="mb-1">PlantPal</h1>
            <p className="text-neutral-600">
              {plants.length} {plants.length === 1 ? 'plant' : 'plants'} • {environments.length} {environments.length === 1 ? 'environment' : 'environments'}
            </p>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={onOpenChat}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* View toggle */}
        {(plants.length > 0 || environments.length > 0) && (
          <div className="flex items-center gap-2 mb-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 bg-neutral-100 rounded-lg px-3 py-2 text-center">
              <p className="text-sm">
                {selectedView === 'home' 
                  ? 'Home' 
                  : currentEnvironment?.name}
              </p>
              {selectedView !== 'home' && (
                <p className="text-xs text-neutral-500">
                  {filteredPlants.length} {filteredPlants.length === 1 ? 'plant' : 'plants'}
                </p>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {plants.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12 bg-neutral-50 rounded-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mb-2">No plants yet</h3>
            <p className="text-neutral-600 mb-6">
              Add your first plant or get personalized recommendations based on your environment.
            </p>
            <Button onClick={onViewRecommendations} className="w-full">
              <Plus className="w-5 h-5 mr-2" />
              Get Plant Recommendations
            </Button>
          </div>
        ) : selectedView === 'home' ? (
          /* Home View */
          <div className="space-y-4">
            {/* Health Overview */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
              <h2 className="mb-4">Health Overview</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className={`text-2xl mb-1 ${
                    avgHealth >= 80 ? 'text-green-600' : avgHealth >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {avgHealth}%
                  </div>
                  <p className="text-xs text-neutral-600">Avg Health</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl ml-1">{plantsNeedingWater}</span>
                  </div>
                  <p className="text-xs text-neutral-600">Need Water</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Sun className="w-5 h-5 text-amber-600" />
                    <span className="text-2xl ml-1">{plantsNeedingSun}</span>
                  </div>
                  <p className="text-xs text-neutral-600">Need Sun</p>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white rounded-2xl border border-neutral-200">
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-sm">Tasks & Care</h3>
                <span className="text-xs text-neutral-500">
                  {allTasks.length} pending
                </span>
              </div>
              <div className="p-4">
                {allTasks.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">All tasks complete!</p>
                    <p className="text-xs text-neutral-500 mt-1">Your plants are well cared for</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[240px] overflow-y-auto">
                    {allTasks.slice(0, 8).map((task) => (
                      <button
                        key={`${task.plantId}-${task.id}`}
                        className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                        onClick={() => onViewPlant(task.plantId)}
                      >
                        <Circle className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{task.title}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {task.plantName} • {task.frequency}
                          </p>
                        </div>
                      </button>
                    ))}
                    {allTasks.length > 8 && (
                      <p className="text-xs text-neutral-500 text-center pt-2">
                        +{allTasks.length - 8} more tasks
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Watering */}
            <div className="bg-white rounded-2xl border border-neutral-200">
              <div className="p-4 border-b border-neutral-200">
                <h3 className="text-sm">Upcoming Watering</h3>
              </div>
              <div className="p-4 space-y-3">
                {plants
                  .filter(p => p.nextWatering)
                  .sort((a, b) => new Date(a.nextWatering!).getTime() - new Date(b.nextWatering!).getTime())
                  .slice(0, 4)
                  .map(plant => (
                    <button
                      key={plant.id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                      onClick={() => onViewPlant(plant.id)}
                    >
                      <img 
                        src={plant.image} 
                        alt={plant.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{plant.name}</p>
                        <p className="text-xs text-neutral-500">{plant.species}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-600">{plant.nextWatering}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onViewRecommendations}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </Button>
            </div>
          </div>
        ) : (
          /* Environment Stage View */
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 min-h-[400px]">
              <EnvironmentStage
                environment={currentEnvironment}
                plants={filteredPlants}
                onViewPlant={onViewPlant}
                isAllEnvironments={false}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onViewRecommendations}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </Button>
              {currentEnvironment && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onViewEnvironment(currentEnvironment.id)}
                >
                  Environment Details
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}