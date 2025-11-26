import { ArrowLeft, Sun, Droplets, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Environment, Plant } from '../App';

type PlantRecommendationsProps = {
  environments: Environment[];
  onBack: () => void;
  onAddPlant: (plant: Plant) => void;
};

const recommendedPlants = [
  {
    species: 'Monstera Deliciosa',
    commonName: 'Swiss Cheese Plant',
    image: 'https://images.unsplash.com/photo-1655188565217-014d76f9b670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25zdGVyYSUyMHBsYW50JTIwaW5kb29yfGVufDF8fHx8MTc2MzYyMzU5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    lightLevel: 'Medium to Bright',
    waterFrequency: 'Every 7-10 days',
    difficulty: 'Beginner-friendly',
    minLight: 60,
    description: 'Popular indoor plant with distinctive split leaves. Very forgiving and easy to care for.',
  },
  {
    species: 'Pothos',
    commonName: 'Devil\'s Ivy',
    image: 'https://images.unsplash.com/photo-1596724878582-76f1a8fdc24f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Rob3MlMjBwbGFudHxlbnwxfHx8fDE3NjM3MDkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lightLevel: 'Low to Medium',
    waterFrequency: 'Every 7-10 days',
    difficulty: 'Very easy',
    minLight: 30,
    description: 'Nearly impossible to kill. Perfect for beginners and low-light spaces.',
  },
  {
    species: 'Snake Plant',
    commonName: 'Sansevieria',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFrZSUyMHBsYW50fGVufDF8fHx8MTc2MzY0MjE4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    lightLevel: 'Low to Bright',
    waterFrequency: 'Every 2-3 weeks',
    difficulty: 'Very easy',
    minLight: 20,
    description: 'Extremely low maintenance. Can tolerate neglect and low light conditions.',
  },
  {
    species: 'Succulent Mix',
    commonName: 'Various Succulents',
    image: 'https://images.unsplash.com/photo-1621512367176-03782e847fa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjdWxlbnQlMjBwbGFudHN8ZW58MXx8fHwxNzYzNzM2NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    lightLevel: 'Bright',
    waterFrequency: 'Every 2-4 weeks',
    difficulty: 'Easy',
    minLight: 70,
    description: 'Water-storing plants that prefer bright light and infrequent watering.',
  },
];

export function PlantRecommendations({
  environments,
  onBack,
  onAddPlant,
}: PlantRecommendationsProps) {
  const environment = environments[0];

  const handleAddPlant = (recommendedPlant: typeof recommendedPlants[0]) => {
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      name: `My ${recommendedPlant.commonName}`,
      species: recommendedPlant.species,
      image: recommendedPlant.image,
      environmentId: environment?.id || 'env-1',
      health: {
        water: 100,
        sunlight: 95,
        soil: 90,
        overall: 95,
      },
      careInstructions: {
        wateringFrequency: recommendedPlant.waterFrequency,
        sunlightNeeds: recommendedPlant.lightLevel,
        placement: 'Place near window for optimal growth',
      },
      tasks: [
        { id: `t-${Date.now()}-1`, title: 'Check soil moisture', completed: false, frequency: 'Every 3 days' },
        { id: `t-${Date.now()}-2`, title: 'Rotate plant', completed: false, frequency: 'Weekly' },
        { id: `t-${Date.now()}-3`, title: 'Check for pests', completed: false, frequency: 'Bi-weekly' },
      ],
      lastWatered: 'Just now',
      nextWatering: recommendedPlant.waterFrequency.includes('7-10') ? 'In 7 days' : 'In 2 weeks',
    };
    onAddPlant(newPlant);
    onBack();
  };

  // Filter plants based on environment light levels
  const suitablePlants = environment
    ? recommendedPlants.filter(plant => plant.minLight <= environment.lightIntensity)
    : recommendedPlants;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3 mb-4">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2>Plant Recommendations</h2>
            <p className="text-sm text-neutral-600">Based on your environment</p>
          </div>
        </div>

        {/* Environment summary */}
        {environment && (
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
            <p className="text-sm text-neutral-600 mb-1">For your {environment.name}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Sun className="w-4 h-4 text-amber-600" />
                {environment.lightIntensity}% light
              </span>
              <span>•</span>
              <span>{environment.direction}</span>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {suitablePlants.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="mb-2">Limited light available</h3>
            <p className="text-neutral-600">
              Consider adding supplemental lighting or scanning a different location with more natural light.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suitablePlants.map((plant) => (
              <div
                key={plant.species}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
              >
                <div className="h-48 bg-neutral-100 overflow-hidden">
                  <ImageWithFallback
                    src={plant.image}
                    alt={plant.species}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1">{plant.commonName}</h3>
                      <p className="text-sm text-neutral-600">{plant.species}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {plant.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-4">
                    {plant.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="text-xs text-neutral-600">Light</p>
                        <p className="text-sm">{plant.lightLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-neutral-600">Water</p>
                        <p className="text-sm">{plant.waterFrequency}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddPlant(plant)}
                    className="w-full"
                  >
                    Add to My Plants
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
