import { motion } from 'motion/react';
import { Droplets, Sun, Thermometer } from 'lucide-react';
import type { Plant, Environment } from '../App';

type EnvironmentStageProps = {
  environment: Environment | null;
  plants: Plant[];
  onViewPlant: (plantId: string) => void;
  isAllEnvironments?: boolean;
};

// Generate a stable position for each plant based on its ID
const getPlantPosition = (index: number, total: number) => {
  const positions = [
    { x: 20, y: 30 },
    { x: 70, y: 25 },
    { x: 45, y: 55 },
    { x: 25, y: 75 },
    { x: 75, y: 70 },
    { x: 50, y: 40 },
    { x: 15, y: 50 },
    { x: 80, y: 45 },
  ];
  
  if (total <= positions.length) {
    return positions[index];
  }
  
  // For more plants, calculate positions in a spiral pattern
  const angle = (index / total) * Math.PI * 2;
  const radius = 25 + (index % 3) * 15;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 45 + Math.sin(angle) * radius,
  };
};

const getHealthColor = (health: number) => {
  if (health >= 80) return 'bg-green-500 shadow-green-500/50';
  if (health >= 60) return 'bg-yellow-500 shadow-yellow-500/50';
  return 'bg-red-500 shadow-red-500/50';
};

const getLightingGradient = (lightIntensity: number) => {
  if (lightIntensity >= 70) {
    // Bright/High light - warm, sunny
    return 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100';
  } else if (lightIntensity >= 40) {
    // Medium light - balanced, green
    return 'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100';
  } else {
    // Low light - cool, shadowy
    return 'bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-100';
  }
};

const getLightingAccent = (lightIntensity: number) => {
  if (lightIntensity >= 70) {
    return 'from-amber-200/40 to-transparent';
  } else if (lightIntensity >= 40) {
    return 'from-emerald-200/40 to-transparent';
  } else {
    return 'from-slate-300/40 to-transparent';
  }
};

export function EnvironmentStage({
  environment,
  plants,
  onViewPlant,
  isAllEnvironments = false,
}: EnvironmentStageProps) {
  const lightIntensity = environment?.lightIntensity ?? 50;
  const gradientClass = isAllEnvironments 
    ? 'bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100'
    : getLightingGradient(lightIntensity);
  const accentGradient = isAllEnvironments
    ? 'from-neutral-200/30 to-transparent'
    : getLightingAccent(lightIntensity);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* Background with lighting theme */}
      <div className={`absolute inset-0 ${gradientClass}`}>
        {/* Lighting effect overlay */}
        <div className={`absolute inset-0 bg-gradient-radial ${accentGradient}`} />
        
        {/* Ambient light spots */}
        {!isAllEnvironments && (
          <>
            <motion.div
              className="absolute w-64 h-64 rounded-full opacity-30 blur-3xl"
              style={{
                background: lightIntensity >= 70 
                  ? 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)'
                  : lightIntensity >= 40
                  ? 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(148,163,184,0.3) 0%, transparent 70%)',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.4, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute w-48 h-48 rounded-full opacity-20 blur-2xl"
              style={{
                background: lightIntensity >= 70 
                  ? 'radial-gradient(circle, rgba(251,146,60,0.3) 0%, transparent 70%)'
                  : lightIntensity >= 40
                  ? 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(100,116,139,0.25) 0%, transparent 70%)',
                bottom: '15%',
                right: '10%',
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </>
        )}
      </div>

      {/* Environment info overlay */}
      {environment && !isAllEnvironments && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/60 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 mb-0.5">Environment</p>
                <h3 className="text-sm">{environment.name}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <div className="flex items-center gap-1">
                  <Sun className="w-3 h-3" />
                  <span>{environment.lightIntensity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3" />
                  <span>{environment.weather.temperature}°F</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  <span>{environment.weather.humidity}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Environments label */}
      {isAllEnvironments && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/60 shadow-sm">
            <p className="text-sm">All Environments</p>
          </div>
        </div>
      )}

      {/* Floating plant orbs */}
      <div className="absolute inset-0 flex items-center justify-center">
        {plants.length === 0 ? (
          <div className="text-center px-6">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/80">
              <Sun className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm text-neutral-600">No plants in this environment</p>
          </div>
        ) : (
          plants.map((plant, index) => {
            const position = getPlantPosition(index, plants.length);
            const healthColor = getHealthColor(plant.health.overall);
            
            return (
              <motion.button
                key={plant.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  scale: { duration: 0.5, delay: index * 0.1 },
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  y: {
                    duration: 3 + (index % 3) * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.2,
                  },
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewPlant(plant.id)}
              >
                {/* Health glow ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full ${healthColor}`}
                  style={{
                    filter: 'blur(12px)',
                  }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Plant orb */}
                <div className="relative w-20 h-20 bg-white rounded-full shadow-lg overflow-hidden border-2 border-white/80">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Health indicator ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent"
                    style={{
                      borderTopColor: plant.health.overall >= 80 ? '#22c55e' 
                        : plant.health.overall >= 60 ? '#eab308' : '#ef4444',
                      transform: `rotate(${(plant.health.overall / 100) * 360}deg)`,
                    }}
                  />
                </div>

                {/* Plant name tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {plant.name}
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
