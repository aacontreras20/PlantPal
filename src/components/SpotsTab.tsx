import { useState, useEffect } from 'react';
import { Plus, Sun, Moon, Lamp, ArrowLeft, ArrowRight, Edit2, Home, UtensilsCrossed, Bath, Bed, Briefcase, DoorOpen } from 'lucide-react';
import { Button } from './ui/button';
import { CreateSpotFlow } from './CreateSpotFlow';
import { SpotDetailScreen } from './SpotDetailScreen';
import { PlantDetailScreen } from './PlantDetailScreen';
import { PhotoPlantIdentification } from './PhotoPlantIdentification';
import type { Spot, Plant, Task } from '../App';

type SpotsTabProps = {
  spots: Spot[];
  plants: Plant[];
  tasks: Task[];
  onAddSpot: (spot: Spot) => void;
  onUpdateSpot: (spot: Spot) => void;
  onUpdatePlant: (plant: Plant) => void;
  onToggleTask: (taskId: string) => void;
  onAddPlant: (plant: Plant) => void;
  onRegenerateTasks?: (plantId: string) => void;
  onFlowStateChange?: (isInFlow: boolean) => void;
};

type View = 'list' | 'detail' | 'plant-detail' | 'create' | 'add-plant-to-spot';

export function SpotsTab({ spots, plants, tasks, onAddSpot, onUpdateSpot, onUpdatePlant, onToggleTask, onAddPlant, onRegenerateTasks, onFlowStateChange }: SpotsTabProps) {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const selectedSpot = spots.find(s => s.id === selectedSpotId);
  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  // Notify parent when entering/exiting flows
  useEffect(() => {
    if (onFlowStateChange) {
      onFlowStateChange(currentView === 'create' || currentView === 'add-plant-to-spot');
    }
  }, [currentView, onFlowStateChange]);

  if (currentView === 'create') {
    return (
      <CreateSpotFlow
        onComplete={(spot) => {
          onAddSpot(spot);
          setCurrentView('list');
        }}
        onBack={() => setCurrentView('list')}
      />
    );
  }

  if (currentView === 'plant-detail' && selectedPlant) {
    const spot = spots.find(s => s.id === selectedPlant.spotId);
    const plantTasks = tasks.filter(t => t.plantId === selectedPlant.id);

    return (
      <PlantDetailScreen
        plant={selectedPlant}
        spot={spot}
        tasks={plantTasks}
        onBack={() => setCurrentView('detail')}
        onToggleTask={onToggleTask}
        onUpdatePlant={onUpdatePlant}
        onRegenerateTasks={onRegenerateTasks}
      />
    );
  }

  if (currentView === 'detail' && selectedSpot) {
    const spotPlants = plants.filter(p => p.spotId === selectedSpot.id);
    return (
      <SpotDetailScreen
        spot={selectedSpot}
        plants={spotPlants}
        onBack={() => setCurrentView('list')}
        onUpdateSpot={onUpdateSpot}
        onPlantClick={(plantId) => {
          setSelectedPlantId(plantId);
          setCurrentView('plant-detail');
        }}
        onAddPlant={() => setCurrentView('add-plant-to-spot')}
      />
    );
  }

  if (currentView === 'add-plant-to-spot' && selectedSpot) {
    return (
      <PhotoPlantIdentification
        onBack={() => setCurrentView('detail')}
        onAddPlant={(plant) => {
          onAddPlant(plant);
          setCurrentView('detail');
        }}
        spot={selectedSpot}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      {/* Decorative background emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Home className="absolute top-20 right-8 w-32 h-32 text-[#A8BFA0]/20 opacity-30 transform rotate-12" />
        <UtensilsCrossed className="absolute bottom-32 left-4 w-24 h-24 text-[#A8BFA0]/20 opacity-20 transform -rotate-12" />
        <Bath className="absolute top-1/3 left-12 w-20 h-20 text-[#A8BFA0]/20 opacity-25 transform rotate-6" />
      </div>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 relative z-10">
        <h1 className="mb-1">🏡 Environments</h1>
        <p className="text-neutral-600">
          {spots.length === 0
            ? 'Create your first environment'
            : `${spots.length} ${spots.length === 1 ? 'environment' : 'environments'} set up`}
        </p>
      </div>

      {/* Environment list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 relative z-10">
        {spots.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#C9A48F] to-[#B8947E] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-4xl">☀️</span>
            </div>
            <h3 className="mb-2">Create Your First Space</h3>
            <p className="text-neutral-600 mb-6 px-4">
              Set up environments to track where your plants live and get personalized care tips
            </p>
            <Button onClick={() => setCurrentView('create')} size="lg" className="shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Environment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {spots.map((spot) => {
              const spotPlantCount = plants.filter(p => p.spotId === spot.id).length;
              const environmentStyle = getEnvironmentStyle(spot.lightLevel);
              const roomIcon = getRoomIcon(spot.roomType);

              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    setSelectedSpotId(spot.id);
                    setCurrentView('detail');
                  }}
                  className="w-full rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all text-left border-2 border-white relative"
                >
                  {/* Gradient Header */}
                  <div
                    className="p-5 pb-4 relative"
                    style={{ background: environmentStyle.gradient }}
                  >
                    {/* Background room icon */}
                    <div className="absolute top-4 right-4 opacity-20">
                      {roomIcon.large}
                    </div>

                    <div className="flex items-start gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${environmentStyle.iconBg}`}>
                        {environmentStyle.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {roomIcon.small}
                          <h3 className={environmentStyle.textColor}>{spot.name}</h3>
                        </div>
                        <p className={`text-sm ${environmentStyle.subtextColor} capitalize`}>
                          {spot.lightLevel.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="px-5 py-3 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-neutral-600">
                        {spotPlantCount} {spotPlantCount === 1 ? 'plant' : 'plants'}
                      </span>
                      {spotPlantCount > 0 && (
                        <div className="flex -space-x-2">
                          {plants
                            .filter(p => p.spotId === spot.id)
                            .slice(0, 3)
                            .map((plant) => (
                              <div
                                key={plant.id}
                                className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm"
                              >
                                <img
                                  src={plant.image}
                                  alt={plant.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          {spotPlantCount > 3 && (
                            <div className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white shadow-sm flex items-center justify-center">
                              <span className="text-[10px]">+{spotPlantCount - 3}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#6F7D61]" />
                  </div>
                </button>
              );
            })}

            <Button
              onClick={() => setCurrentView('create')}
              variant="outline"
              className="w-full border-2 border-dashed border-[#A8BFA0]/50 hover:border-[#6F7D61] hover:bg-[#A8BFA0]/10 text-[#6F7D61]"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Environment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function getRoomIcon(roomType: Spot['roomType']) {
  switch (roomType) {
    case 'living-room':
      return {
        small: <Home className="w-4 h-4 text-white/80" />,
        large: <Home className="w-24 h-24 text-white" />,
      };
    case 'kitchen':
      return {
        small: <UtensilsCrossed className="w-4 h-4 text-white/80" />,
        large: <UtensilsCrossed className="w-24 h-24 text-white" />,
      };
    case 'bathroom':
      return {
        small: <Bath className="w-4 h-4 text-white/80" />,
        large: <Bath className="w-24 h-24 text-white" />,
      };
    case 'bedroom':
      return {
        small: <Bed className="w-4 h-4 text-white/80" />,
        large: <Bed className="w-24 h-24 text-white" />,
      };
    case 'office':
      return {
        small: <Briefcase className="w-4 h-4 text-white/80" />,
        large: <Briefcase className="w-24 h-24 text-white" />,
      };
    case 'dining-room':
      return {
        small: <UtensilsCrossed className="w-4 h-4 text-white/80" />,
        large: <UtensilsCrossed className="w-24 h-24 text-white" />,
      };
    case 'hallway':
      return {
        small: <DoorOpen className="w-4 h-4 text-white/80" />,
        large: <DoorOpen className="w-24 h-24 text-white" />,
      };
    default:
      return {
        small: <DoorOpen className="w-4 h-4 text-white/80" />,
        large: <DoorOpen className="w-24 h-24 text-white" />,
      };
  }
}

function getEnvironmentStyle(lightLevel: Spot['lightLevel']) {
  switch (lightLevel) {
    case 'bright-direct':
      return {
        iconBg: 'bg-white/30 backdrop-blur-sm',
        icon: <Sun className="w-6 h-6 text-white" />,
        gradient: 'linear-gradient(135deg, #C9A48F 0%, #B8947E 50%, #A8846D 100%)', // Clay tones
        textColor: 'text-white',
        subtextColor: 'text-white/80',
      };
    case 'bright-indirect':
      return {
        iconBg: 'bg-white/30 backdrop-blur-sm',
        icon: <Sun className="w-6 h-6 text-white" />,
        gradient: 'linear-gradient(135deg, #A8BFA0 0%, #97AF8F 50%, #869F7E 100%)', // Sage tones
        textColor: 'text-white',
        subtextColor: 'text-white/80',
      };
    case 'medium-indirect':
      return {
        iconBg: 'bg-white/30 backdrop-blur-sm',
        icon: <Lamp className="w-6 h-6 text-white" />,
        gradient: 'linear-gradient(135deg, #9AAFA9 0%, #8A9F99 50%, #7A8F89 100%)', // Muted blue-sage
        textColor: 'text-white',
        subtextColor: 'text-white/80',
      };
    case 'low-light':
      return {
        iconBg: 'bg-white/30 backdrop-blur-sm',
        icon: <Moon className="w-6 h-6 text-white" />,
        gradient: 'linear-gradient(135deg, #7A8A7F 0%, #6A7A6F 50%, #5A6A5F 100%)', // Deep muted sage
        textColor: 'text-white',
        subtextColor: 'text-white/80',
      };
  }
}