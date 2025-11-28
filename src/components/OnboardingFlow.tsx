import { useState } from 'react';
import { ArrowRight, Search, Camera, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CreateSpotFlow } from './CreateSpotFlow';
import { OnboardingGuide } from './OnboardingGuide';
import type { Plant, Spot, Task } from '../App';
import { generateTasksForPlant } from '../utils/taskGenerator';

type OnboardingFlowProps = {
  onComplete: (plants: Plant[], spots: Spot[], tasks: Task[]) => void;
};

type OnboardingStep =
  | 'splash'
  | 'welcome'
  | 'location'
  | 'guide'
  | 'has-plants'
  | 'search-plant'
  | 'select-plant'
  | 'create-spot'
  | 'plant-summary';

// Mock plant database
const PLANT_DATABASE = [
  {
    id: 'pothos',
    name: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
    category: 'beginner',
    lightRequirement: 'medium-indirect' as const,
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb4?w=400',
    category: 'beginner',
    lightRequirement: 'low-light' as const,
  },
  {
    id: 'zz-plant',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400',
    category: 'beginner',
    lightRequirement: 'low-light' as const,
  },
  {
    id: 'monstera',
    name: 'Monstera',
    scientificName: 'Monstera deliciosa',
    image: 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b8b?w=400',
    category: 'beginner',
    lightRequirement: 'bright-indirect' as const,
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400',
    category: 'beginner',
    lightRequirement: 'medium-indirect' as const,
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<OnboardingStep>('splash');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<typeof PLANT_DATABASE[0] | null>(null);
  const [createdSpot, setCreatedSpot] = useState<Spot | null>(null);
  const [location, setLocation] = useState('');
  const [climate, setClimate] = useState<'tropical' | 'temperate' | 'arid' | 'cold' | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Auto-hide splash screen after 2 seconds
  useState(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setStep('welcome');
      }, 2500);
      return () => clearTimeout(timer);
    }
  });

  const filteredPlants = searchQuery
    ? PLANT_DATABASE.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : PLANT_DATABASE;

  const handleHasPlants = (hasPlants: boolean) => {
    if (hasPlants) {
      setStep('search-plant');
    } else {
      setStep('create-spot');
    }
  };

  const handleSelectPlant = (plant: typeof PLANT_DATABASE[0]) => {
    setSelectedPlant(plant);
    setStep('create-spot');
  };

  const handleSpotCreated = (spot: Spot) => {
    setCreatedSpot(spot);
    if (selectedPlant) {
      setStep('plant-summary');
    } else {
      // No plant selected yet, show recommendations
      setStep('select-plant');
    }
  };

  const handleFinish = () => {
    if (!selectedPlant || !createdSpot) return;

    // Calculate care instructions based on spot
    const careInstructions = calculateCareInstructions(createdSpot);

    // Determine plant status based on light match
    const lightMatch = selectedPlant.lightRequirement === createdSpot.lightLevel;
    const status: Plant['status'] = lightMatch ? 'all-good' : 'check-light';

    // Default task configuration - only watering enabled by default
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
      spotId: createdSpot.id,
      status,
      lightRequirement: selectedPlant.lightRequirement,
      careInstructions,
      taskConfig,
      addedDate: new Date().toISOString(),
    };

    const newTasks: Task[] = generateTasksForPlant(newPlant);

    onComplete([newPlant], [createdSpot], newTasks);
  };

  if (step === 'create-spot') {
    return (
      <CreateSpotFlow
        onComplete={handleSpotCreated}
        onBack={() => setStep(selectedPlant ? 'select-plant' : 'has-plants')}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Splash Screen */}
      {step === 'splash' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#6F7D61] via-[#7A8A70] to-[#869F7E] overflow-hidden z-50">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 text-6xl animate-float">🌿</div>
            <div className="absolute top-32 right-16 text-5xl animate-float-delayed">🪴</div>
            <div className="absolute bottom-32 left-20 text-7xl animate-float">🌱</div>
            <div className="absolute bottom-20 right-12 text-6xl animate-float-delayed">🍃</div>
          </div>

          {/* Logo and brand */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-white/30 animate-scale-in">
              <span className="text-7xl">🌱</span>
            </div>
            <h1 className="text-white mb-2 text-4xl animate-fade-in" style={{ animationDelay: '0.3s' }}>PlantPal</h1>
            <p className="text-white/90 animate-fade-in" style={{ animationDelay: '0.5s' }}>Your friendly plant companion</p>
          </div>
        </div>
      )}

      {/* Location Screen */}
      {step === 'location' && (
        <div className="flex-1 flex flex-col px-6 pt-12 pb-safe bg-[#F5EFE7]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#A8BFA0] to-[#6F7D61] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-2 text-[#2E3F34]">Where are you growing?</h1>
            <p className="text-neutral-600 text-sm">
              This helps us understand your climate
            </p>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto pb-40">
            <div className="mb-4">
              <label className="text-sm text-neutral-700 mb-2 block">City or Region</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="e.g., San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-neutral-700 mb-2 block">Climate Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setClimate('tropical')}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${climate === 'tropical'
                    ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                    : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                    }`}
                >
                  <div className="text-xl mb-0.5">🌴</div>
                  <p className="text-sm font-medium">Tropical</p>
                  <p className="text-xs text-neutral-500">Hot & humid</p>
                </button>

                <button
                  onClick={() => setClimate('temperate')}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${climate === 'temperate'
                    ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                    : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                    }`}
                >
                  <div className="text-xl mb-0.5">🍂</div>
                  <p className="text-sm font-medium">Temperate</p>
                  <p className="text-xs text-neutral-500">4 seasons</p>
                </button>

                <button
                  onClick={() => setClimate('arid')}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${climate === 'arid'
                    ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                    : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                    }`}
                >
                  <div className="text-xl mb-0.5">🌵</div>
                  <p className="text-sm font-medium">Arid/Dry</p>
                  <p className="text-xs text-neutral-500">Low humidity</p>
                </button>

                <button
                  onClick={() => setClimate('cold')}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${climate === 'cold'
                    ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                    : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                    }`}
                >
                  <div className="text-xl mb-0.5">❄️</div>
                  <p className="text-sm font-medium">Cold</p>
                  <p className="text-xs text-neutral-500">Long winters</p>
                </button>
              </div>
            </div>
          </div>

          {/* Fixed bottom buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-50">
            <Button
              onClick={() => setStep('has-plants')}
              disabled={!climate}
              className="w-full shadow-lg mb-2"
              size="lg"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => setStep('has-plants')}
              variant="ghost"
              className="w-full"
            >
              Skip for now
            </Button>
          </div>
        </div>
      )}

      {/* Guide */}
      {step === 'guide' && (
        <OnboardingGuide
          onComplete={() => setStep('location')}
        />
      )}

      {/* Welcome Screen */}
      {step === 'welcome' && (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[#F5EFE7] px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-[#A8BFA0] to-[#6F7D61] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <span className="text-5xl">🌱</span>
            </div>
            <h1 className="mb-3 text-3xl">Welcome to PlantPal</h1>
            <p className="text-neutral-600 mb-8">
              Your friendly companion for keeping your plants happy and healthy
            </p>
            <Button onClick={() => setStep('location')} size="lg" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}

      {/* Has Plants Screen */}
      {step === 'has-plants' && (
        <div className="h-full flex flex-col bg-[#F5EFE7]">
          <div className="flex-1 overflow-y-auto px-6 pt-12 pb-40">
            <h1 className="mb-2 text-xl">Do you already have plants?</h1>
            <p className="text-neutral-600 mb-6 text-sm">
              We'll customize your experience based on your needs
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleHasPlants(true)}
                className="w-full p-4 bg-white border-2 border-neutral-200 rounded-2xl hover:border-[#6F7D61] hover:bg-[#A8BFA0]/10 transition-all text-left"
              >
                <h3 className="mb-0.5 text-base font-medium">Yes, I have plants</h3>
                <p className="text-sm text-neutral-600">Add them to start tracking care</p>
              </button>

              <button
                onClick={() => handleHasPlants(false)}
                className="w-full p-4 bg-white border-2 border-neutral-200 rounded-2xl hover:border-[#6F7D61] hover:bg-[#A8BFA0]/10 transition-all text-left"
              >
                <h3 className="mb-0.5 text-base font-medium">No, help me choose one</h3>
                <p className="text-sm text-neutral-600">
                  Get recommendations based on your space
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search/Add Plant */}
      {step === 'search-plant' && (
        <div className="flex-1 flex flex-col px-6 pt-12 bg-[#F5EFE7]">
          <h1 className="mb-6">Add your plant</h1>

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
            <div className="space-y-2">
              {filteredPlants.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => handleSelectPlant(plant)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-xl hover:border-[#6F7D61] hover:bg-[#A8BFA0]/10 transition-all text-left"
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
                  <ArrowRight className="w-5 h-5 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Select Plant (after creating spot for new users) */}
      {step === 'select-plant' && !selectedPlant && (
        <div className="flex-1 flex flex-col px-6 pt-12 bg-[#F5EFE7]">
          <h1 className="mb-3">Recommended for your spot</h1>
          <p className="text-neutral-600 mb-6">
            These plants will thrive in {createdSpot?.name}
          </p>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {PLANT_DATABASE.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => handleSelectPlant(plant)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-xl hover:border-[#6F7D61] hover:bg-[#A8BFA0]/10 transition-all text-left"
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
                  <ArrowRight className="w-5 h-5 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Plant Summary */}
      {step === 'plant-summary' && selectedPlant && createdSpot && (
        <div className="flex-1 flex flex-col px-6 pt-12 bg-[#F5EFE7]">
          <h1 className="mb-6">Your plant is ready!</h1>

          <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
            <img
              src={selectedPlant.image}
              alt={selectedPlant.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="mb-1">{selectedPlant.name}</h2>
            <p className="text-sm text-neutral-600 mb-3">{selectedPlant.scientificName}</p>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span>Living in:</span>
              <span className="text-neutral-900">{createdSpot.name}</span>
            </div>
          </div>

          <Button onClick={handleFinish} className="w-full" size="lg">
            Add Plant
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate care instructions based on spot
function calculateCareInstructions(spot: Spot) {
  let wateringFrequency = 'Water every 7–10 days';
  let wateringDays = 8; // Average of 7-10
  let lightDescription = 'Medium indirect light';

  if (spot.lightLevel === 'bright-direct') {
    wateringFrequency = 'Water every 5–7 days';
    wateringDays = 6; // Average of 5-7
    lightDescription = 'Bright direct light';
  } else if (spot.lightLevel === 'bright-indirect') {
    wateringFrequency = 'Water every 7–10 days';
    wateringDays = 8; // Average of 7-10
    lightDescription = 'Bright indirect light';
  } else if (spot.lightLevel === 'medium-indirect') {
    wateringFrequency = 'Water every 10–14 days';
    wateringDays = 12; // Average of 10-14
    lightDescription = 'Medium indirect light';
  } else if (spot.lightLevel === 'low-light') {
    wateringFrequency = 'Water every 14–21 days';
    wateringDays = 17; // Average of 14-21
    lightDescription = 'Low light';
  }

  return {
    wateringFrequency,
    wateringDays,
    lightDescription,
  };
}