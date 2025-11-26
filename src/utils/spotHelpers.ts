import type { Spot } from '../App';

export const getSpotGradient = (lightLevel: Spot['lightLevel']): string => {
  switch (lightLevel) {
    case 'bright-direct':
      return 'from-amber-400 to-orange-500';
    case 'bright-indirect':
      return 'from-yellow-300 to-amber-400';
    case 'medium-indirect':
      return 'from-green-300 to-emerald-400';
    case 'low-light':
      return 'from-slate-400 to-slate-500';
    default:
      return 'from-green-300 to-emerald-400';
  }
};

export const getSpotIcon = (lightLevel: Spot['lightLevel']): string => {
  switch (lightLevel) {
    case 'bright-direct':
      return '☀️';
    case 'bright-indirect':
      return '🌤️';
    case 'medium-indirect':
      return '⛅';
    case 'low-light':
      return '🌙';
    default:
      return '💡';
  }
};

export const getRoomEmoji = (roomType: Spot['roomType']): string => {
  switch (roomType) {
    case 'living-room':
      return '🛋️';
    case 'bedroom':
      return '🛏️';
    case 'kitchen':
      return '🍳';
    case 'bathroom':
      return '🚿';
    case 'office':
      return '💼';
    case 'dining-room':
      return '🍽️';
    case 'hallway':
      return '🚪';
    case 'other':
      return '🏠';
    default:
      return '🏠';
  }
};

type PlantRecommendation = {
  name: string;
  image: string;
  minLight: number;
  lightLevel: string;
};

export const getRecommendedPlantsForSpot = (lightLevel: Spot['lightLevel']): PlantRecommendation[] => {
  const plantDatabase: PlantRecommendation[] = [
    {
      name: 'Snake Plant',
      image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      minLight: 30,
      lightLevel: 'Low to Bright',
    },
    {
      name: 'Pothos',
      image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      minLight: 40,
      lightLevel: 'Low to Medium',
    },
    {
      name: 'Monstera',
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      minLight: 60,
      lightLevel: 'Bright Indirect',
    },
    {
      name: 'Fiddle Leaf Fig',
      image: 'https://images.unsplash.com/photo-1594729095022-e2f6d2eece9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      minLight: 70,
      lightLevel: 'Bright Indirect',
    },
    {
      name: 'Succulents',
      image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      minLight: 80,
      lightLevel: 'Bright Direct',
    },
    {
      name: 'ZZ Plant',
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      minLight: 20,
      lightLevel: 'Low Light',
    },
  ];

  // Map light level to numeric value for filtering
  const lightValues = {
    'bright-direct': 85,
    'bright-indirect': 70,
    'medium-indirect': 50,
    'low-light': 30,
  };

  const spotLightValue = lightValues[lightLevel] || 50;

  // Filter plants that can thrive in this light level (within range)
  return plantDatabase
    .filter(plant => {
      const tolerance = 30; // Plants can tolerate +/- 30 light units
      return plant.minLight >= spotLightValue - tolerance && plant.minLight <= spotLightValue + tolerance;
    })
    .slice(0, 3); // Return top 3 recommendations
};
