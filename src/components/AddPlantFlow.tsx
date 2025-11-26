import { useState } from 'react';
import { ArrowLeft, Search, Camera, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CreateSpotFlow } from './CreateSpotFlow';
import type { Plant, Spot, Task } from '../App';
import { generateTasksForPlant } from '../utils/taskGenerator';

type AddPlantFlowProps = {
  spots: Spot[];
  onComplete: (plant: Plant, tasks?: Task[]) => void;
  onAddSpot: (spot: Spot) => void;
  onCancel: () => void;
};

type FlowStep = 'search' | 'select-spot' | 'create-spot';

const PLANT_DATABASE = [
  {
    id: 'pothos',
    name: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
    lightRequirement: 'medium-indirect' as const,
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb4?w=400',
    lightRequirement: 'low-light' as const,
  },
  {
    id: 'zz-plant',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400',
    lightRequirement: 'low-light' as const,
  },
  {
    id: 'monstera',
    name: 'Monstera',
    scientificName: 'Monstera deliciosa',
    image: 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b8b?w=400',
    lightRequirement: 'bright-indirect' as const,
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400',
    lightRequirement: 'medium-indirect' as const,
  },
  {
    id: 'spider-plant',
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    image: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400',
    lightRequirement: 'medium-indirect' as const,
  },
];

export function AddPlantFlow({ spots, onComplete, onAddSpot, onCancel }: AddPlantFlowProps) {
  const [step, setStep] = useState<FlowStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<typeof PLANT_DATABASE[0] | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const filteredPlants = searchQuery
    ? PLANT_DATABASE.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PLANT_DATABASE;

  const handlePlantSelect = (plant: typeof PLANT_DATABASE[0]) => {
    setSelectedPlant(plant);
    setStep('select-spot');
  };

  const handleSpotSelect = (spotId: string) => {
    if (!selectedPlant) return;

    const spot = spots.find(s => s.id === spotId);
    if (!spot) return;

    const careInstructions = calculateCareInstructions(spot);

    // Determine plant status based on light match
    const lightMatch = selectedPlant.lightRequirement === spot.lightLevel;
    const status: Plant['status'] = lightMatch ? 'all-good' : 'check-light';

    // Default task configuration for new plants - only watering enabled by default
    const taskConfig = {
      watering: { enabled: true, frequencyDays: 7 },
      rotating: { enabled: false, frequencyDays: 14 },
      fertilizing: { enabled: false, frequencyDays: 30 },
      misting: { enabled: false, frequencyDays: 3 },
      pruning: { enabled: false, frequencyDays: 90 },
      pestCheck: { enabled: false, frequencyDays: 21 },
    };

    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      name: selectedPlant.name,
      scientificName: selectedPlant.scientificName,
      image: selectedPlant.image,
      spotId: spot.id,
      status,
      lightRequirement: selectedPlant.lightRequirement,
      careInstructions,
      taskConfig,
      addedDate: new Date().toISOString(),
    };

    const tasks: Task[] = generateTasksForPlant(newPlant);
    onComplete(newPlant, tasks);
  };

  const handleSpotCreated = (spot: Spot) => {
    onAddSpot(spot);
    handleSpotSelect(spot.id);
  };

  if (step === 'create-spot') {
    return (
      <CreateSpotFlow
        onComplete={handleSpotCreated}
        onBack={() => setStep('select-spot')}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-200">
        <button onClick={onCancel} className="flex items-center gap-2 text-neutral-600 mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Cancel</span>
        </button>
        <h1 className="mb-1">
          {step === 'search' ? 'Add your plant' : 'Where does this plant live?'}
        </h1>
      </div>

      {/* Search Plant */}
      {step === 'search' && (
        <div className="flex-1 flex flex-col px-6 pt-6 overflow-hidden">
          <div className="space-y-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder="Search for your plant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" className="w-full">
              <Camera className="w-5 h-5 mr-2" />
              Identify via photo
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <p className="text-sm text-neutral-600 mb-3">Beginner-friendly plants</p>
            <div className="space-y-2 pb-6">
              {filteredPlants.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => handlePlantSelect(plant)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{plant.name}</p>
                    <p className="text-xs text-neutral-500">{plant.scientificName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Select Spot */}
      {step === 'select-spot' && (
        <div className="flex-1 flex flex-col px-6 pt-6 overflow-hidden">
          <p className="text-neutral-600 mb-6">
            Choose an existing spot or create a new one
          </p>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3 pb-6">
              {/* Create New Spot */}
              <button
                onClick={() => setStep('create-spot')}
                className="w-full flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:border-green-500 transition-all text-left"
              >
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Create a new spot</p>
                </div>
              </button>

              {/* Existing Spots */}
              {spots.length > 0 && (
                <>
                  <div className="pt-4 pb-2">
                    <p className="text-sm text-neutral-600">Existing spots</p>
                  </div>
                  {spots.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => handleSpotSelect(spot.id)}
                      className="w-full flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
                    >
                      <div className="flex-1">
                        <p className="text-sm mb-1">{spot.name}</p>
                        <p className="text-xs text-neutral-500 capitalize">
                          {spot.lightLevel.replace('-', ' ')}
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateCareInstructions(spot: Spot) {
  let wateringFrequency = 'Water every 7–10 days';
  let lightDescription = 'Medium indirect light';

  if (spot.lightLevel === 'bright-direct') {
    wateringFrequency = 'Water every 5–7 days';
    lightDescription = 'Bright direct light';
  } else if (spot.lightLevel === 'bright-indirect') {
    wateringFrequency = 'Water every 7–10 days';
    lightDescription = 'Bright indirect light';
  } else if (spot.lightLevel === 'medium-indirect') {
    wateringFrequency = 'Water every 10–14 days';
    lightDescription = 'Medium indirect light';
  } else if (spot.lightLevel === 'low-light') {
    wateringFrequency = 'Water every 14–21 days';
    lightDescription = 'Low light';
  }

  return {
    wateringFrequency,
    lightDescription,
  };
}