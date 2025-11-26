import { ArrowLeft, Sun, MapPin, ArrowRight, Edit2, Lamp, Moon, Home, UtensilsCrossed, Bath, Bed, Briefcase, DoorOpen, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Spot, Plant } from '../App';

type SpotDetailScreenProps = {
  spot: Spot;
  plants: Plant[];
  onBack: () => void;
  onUpdateSpot: (spot: Spot) => void;
  onPlantClick: (plantId: string) => void;
  onAddPlant: () => void;
};

// Recommendations based on light level
const RECOMMENDATIONS: Record<Spot['lightLevel'], string[]> = {
  'bright-direct': [
    'Succulents',
    'Cacti',
    'Jade Plant',
    'Aloe Vera',
    'Croton',
  ],
  'bright-indirect': [
    'Monstera',
    'Fiddle Leaf Fig',
    'Rubber Plant',
    'Bird of Paradise',
    'Philodendron',
  ],
  'medium-indirect': [
    'Pothos',
    'Snake Plant',
    'Spider Plant',
    'Peace Lily',
    'ZZ Plant',
  ],
  'low-light': [
    'Snake Plant',
    'ZZ Plant',
    'Cast Iron Plant',
    'Pothos',
    'Chinese Evergreen',
  ],
};

export function SpotDetailScreen({ spot, plants, onBack, onUpdateSpot, onPlantClick, onAddPlant }: SpotDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(spot.name);
  const recommendations = RECOMMENDATIONS[spot.lightLevel] || [];
  const environmentStyle = getEnvironmentStyle(spot.lightLevel);

  const handleSave = () => {
    onUpdateSpot({
      ...spot,
      name: editedName,
    });
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Environment Header with Gradient */}
        <div 
          className="px-6 pt-6 pb-6 relative overflow-hidden"
          style={{ background: environmentStyle.gradient }}
        >
          {/* Back button */}
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors relative z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>

          {/* Background room icon */}
          <div className="absolute top-0 right-0 opacity-15 pointer-events-none">
            {getRoomIcon(spot.roomType)}
          </div>

          <div className="flex items-start gap-4 mb-4 relative z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${environmentStyle.iconBg}`}>
              {environmentStyle.icon}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full bg-white/10 text-white"
                />
              ) : (
                <h1 className={`mb-1 ${environmentStyle.textColor}`}>{spot.name}</h1>
              )}
              <p className={`${environmentStyle.subtextColor} capitalize`}>
                {spot.lightLevel.replace('-', ' ')}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={handleSave}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Light Profile Inline */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
              <p className={`text-xs ${environmentStyle.subtextColor} mb-1`}>Light Source</p>
              <p className={`text-sm ${environmentStyle.textColor} capitalize`}>
                {spot.lightSourceType === 'no-window' ? 'No window' : spot.lightSourceType}
              </p>
            </div>
            {spot.direction && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className={`text-xs ${environmentStyle.subtextColor} mb-1`}>Direction</p>
                <p className={`text-sm ${environmentStyle.textColor} capitalize`}>{spot.direction}</p>
              </div>
            )}
            {spot.directSunExposure && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className={`text-xs ${environmentStyle.subtextColor} mb-1`}>Direct Sun</p>
                <p className={`text-sm ${environmentStyle.textColor}`}>
                  {spot.directSunExposure === 'lots' ? 'Yes, lots' :
                   spot.directSunExposure === 'a-bit' ? 'A bit' :
                   'Almost none'}
                </p>
              </div>
            )}
            {spot.distanceFromWindow && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className={`text-xs ${environmentStyle.subtextColor} mb-1`}>Distance</p>
                <p className={`text-sm ${environmentStyle.textColor}`}>
                  {spot.distanceFromWindow === 'windowsill' ? 'Windowsill' :
                   spot.distanceFromWindow === 'close' ? '0–2 ft' :
                   spot.distanceFromWindow === 'mid' ? '2–6 ft' :
                   '6+ ft'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Plant Shelf */}
        <div className="px-6 py-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2>Plants Here ({plants.length})</h2>
            <Button
              onClick={onAddPlant}
              size="sm"
              className="bg-emerald-800 hover:bg-emerald-900"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Plant
            </Button>
          </div>

          {plants.length === 0 ? (
            <button
              onClick={onAddPlant}
              className="w-full bg-neutral-50 rounded-2xl p-8 text-center border-2 border-dashed border-neutral-200 hover:border-emerald-800 hover:bg-emerald-50/50 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-emerald-800" />
              </div>
              <p className="text-sm text-neutral-600">No plants in this environment yet</p>
              <p className="text-xs text-emerald-700 mt-1">Tap to add your first plant!</p>
            </button>
          ) : (
            <div className="space-y-3">
              {plants.map((plant) => {
                // Determine suitability based on plant status
                const suitability = plant.status === 'check-light' 
                  ? { label: 'Needs adjustment', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '⚠️' }
                  : plant.status === 'all-good'
                  ? { label: 'Perfect match', color: 'bg-green-100 text-green-700 border-green-200', icon: '✓' }
                  : { label: 'Good fit', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '✓' };

                return (
                  <button
                    key={plant.id}
                    onClick={() => onPlantClick(plant.id)}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-md transition-all text-left"
                  >
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate">{plant.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${suitability.color}`}>
                          <span>{suitability.icon}</span>
                          <span>{suitability.label}</span>
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-600 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="px-6 pb-6 bg-white">
          <h2 className="mb-3">Best plants for this spot</h2>
          <p className="text-sm text-neutral-600 mb-4">
            These plants will thrive in {spot.lightLevel.replace('-', ' ')} conditions
          </p>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map((plantName) => (
              <div
                key={plantName}
                className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl"
              >
                <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🌿</span>
                </div>
                <p className="text-sm flex-1">{plantName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .plant-shelf-scroll::-webkit-scrollbar {
          height: 4px;
        }

        .plant-shelf-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        .plant-shelf-scroll::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 10px;
        }

        .plant-shelf-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }
      `}</style>
    </div>
  );
}

function getRoomIcon(roomType: Spot['roomType']) {
  switch (roomType) {
    case 'living-room':
      return <Home className="w-32 h-32 text-white" />;
    case 'kitchen':
      return <UtensilsCrossed className="w-32 h-32 text-white" />;
    case 'bathroom':
      return <Bath className="w-32 h-32 text-white" />;
    case 'bedroom':
      return <Bed className="w-32 h-32 text-white" />;
    case 'office':
      return <Briefcase className="w-32 h-32 text-white" />;
    case 'dining-room':
      return <UtensilsCrossed className="w-32 h-32 text-white" />;
    case 'hallway':
      return <DoorOpen className="w-32 h-32 text-white" />;
    default:
      return <DoorOpen className="w-32 h-32 text-white" />;
  }
}

function getEnvironmentStyle(lightLevel: Spot['lightLevel']) {
  switch (lightLevel) {
    case 'bright-direct':
      return {
        iconBg: 'bg-white/30 backdrop-blur-sm',
        icon: <Sun className="w-7 h-7 text-white" />,
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        textColor: 'text-white',
        subtextColor: 'text-white/80',
      };
    case 'bright-indirect':
      return {
        iconBg: 'bg-white/30 backdrop-blur-sm',
        icon: <Sun className="w-7 h-7 text-white" />,
        gradient: 'linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)',
        textColor: 'text-white',
        subtextColor: 'text-white/80',
      };
    case 'medium-indirect':
      return {
        iconBg: 'bg-white/30 backdrop-blur-sm',
        icon: <Lamp className="w-7 h-7 text-white" />,
        gradient: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)',
        textColor: 'text-white',
        subtextColor: 'text-white/80',
      };
    case 'low-light':
      return {
        iconBg: 'bg-white/30 backdrop-blur-sm',
        icon: <Moon className="w-7 h-7 text-white" />,
        gradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%)',
        textColor: 'text-white',
        subtextColor: 'text-white/80',
      };
  }
}