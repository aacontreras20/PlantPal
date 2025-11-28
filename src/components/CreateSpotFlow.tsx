import { ArrowLeft, ArrowRight, Home, UtensilsCrossed, Bath, Bed, Briefcase, UtensilsCrossed as DiningIcon, DoorOpen, Building, Sun, Lightbulb as Lamp, DoorClosed, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Spot } from '../App';
import { getRecommendedPlantsForSpot } from '../utils/spotHelpers';

type CreateSpotFlowProps = {
  onComplete: (spot: Spot) => void;
  onBack: () => void;
};

type SpotStep =
  | 'room-type'
  | 'light-source'
  | 'direction'
  | 'direct-sun'
  | 'distance'
  | 'name'
  | 'summary';

export function CreateSpotFlow({ onComplete, onBack }: CreateSpotFlowProps) {
  const [step, setStep] = useState<SpotStep>('room-type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spotData, setSpotData] = useState({
    name: '',
    roomType: '' as Spot['roomType'] | '',
    lightSourceType: '' as 'window' | 'lamp' | 'no-window' | '',
    direction: '' as 'north' | 'east' | 'south' | 'west' | 'unsure' | '',
    directSunExposure: '' as 'lots' | 'a-bit' | 'almost-none' | '',
    distanceFromWindow: '' as 'windowsill' | 'close' | 'mid' | 'far' | '',
  });

  // Generate suggested name based on room type and light characteristics
  const generateSuggestedName = () => {
    const roomName = spotData.roomType === 'living-room' ? 'Living room' :
      spotData.roomType === 'kitchen' ? 'Kitchen' :
        spotData.roomType === 'bathroom' ? 'Bathroom' :
          spotData.roomType === 'bedroom' ? 'Bedroom' :
            spotData.roomType === 'office' ? 'Office' :
              spotData.roomType === 'dining-room' ? 'Dining room' :
                spotData.roomType === 'hallway' ? 'Hallway' :
                  'My spot';

    // Add descriptive suffix based on light source and location
    if (spotData.lightSourceType === 'window' && spotData.distanceFromWindow === 'windowsill') {
      return `${roomName} windowsill`;
    } else if (spotData.lightSourceType === 'window') {
      return `${roomName} window`;
    } else if (spotData.lightSourceType === 'lamp') {
      return `${roomName} corner`;
    } else {
      return roomName;
    }
  };

  const handleNext = () => {
    if (step === 'room-type') setStep('light-source');
    else if (step === 'light-source') {
      if (spotData.lightSourceType === 'window') {
        setStep('direction');
      } else {
        setStep('name');
      }
    } else if (step === 'direction') setStep('direct-sun');
    else if (step === 'direct-sun') setStep('distance');
    else if (step === 'distance') setStep('name');
    else if (step === 'name') setStep('summary');
  };

  // Auto-generate name when reaching the name step
  useEffect(() => {
    if (step === 'name' && !spotData.name) {
      setSpotData(prev => ({ ...prev, name: generateSuggestedName() }));
    }
  }, [step]);

  const handleBack = () => {
    if (step === 'room-type') onBack();
    else if (step === 'light-source') setStep('room-type');
    else if (step === 'direction') setStep('light-source');
    else if (step === 'direct-sun') setStep('direction');
    else if (step === 'distance') setStep('direct-sun');
    else if (step === 'name') {
      if (spotData.lightSourceType === 'window') {
        setStep('distance');
      } else {
        setStep('light-source');
      }
    }
    else if (step === 'summary') setStep('name');
  };

  const handleFinish = () => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    const lightLevel = calculateLightLevel(spotData);
    const newSpot: Spot = {
      id: `spot-${Date.now()}`,
      name: spotData.name,
      roomType: spotData.roomType as Spot['roomType'],
      lightSourceType: spotData.lightSourceType as 'window' | 'lamp' | 'no-window',
      direction: spotData.direction || undefined,
      directSunExposure: spotData.directSunExposure || undefined,
      distanceFromWindow: spotData.distanceFromWindow || undefined,
      lightLevel,
    };

    // Small delay to show feedback, then complete
    setTimeout(() => {
      onComplete(newSpot);
    }, 300);
  };

  const canProceed = () => {
    if (step === 'room-type') return spotData.roomType !== '';
    if (step === 'light-source') return spotData.lightSourceType !== '';
    if (step === 'direction') return spotData.direction !== '';
    if (step === 'direct-sun') return spotData.directSunExposure !== '';
    if (step === 'distance') return spotData.distanceFromWindow !== '';
    if (step === 'name') return spotData.name.trim().length > 0;
    return true;
  };

  return (
    <div className="h-full flex flex-col bg-[#F5EFE7]">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#A8BFA0]/30 bg-[#F5EFE7]">
        <button onClick={handleBack} className="flex items-center gap-2 text-[#6F7D61] mb-4 hover:text-[#2E3F34] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex gap-1.5">
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step !== 'room-type' ? 'bg-[#6F7D61] shadow-sm' : 'bg-[#A8BFA0]/30'}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${['light-source', 'direction', 'direct-sun', 'distance', 'name', 'summary'].includes(step) ? 'bg-[#6F7D61] shadow-sm' : 'bg-[#A8BFA0]/30'}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${['direction', 'direct-sun', 'distance', 'name', 'summary'].includes(step) ? 'bg-[#6F7D61] shadow-sm' : 'bg-[#A8BFA0]/30'}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${['direct-sun', 'distance', 'name', 'summary'].includes(step) ? 'bg-[#6F7D61] shadow-sm' : 'bg-[#A8BFA0]/30'}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${['distance', 'name', 'summary'].includes(step) ? 'bg-[#6F7D61] shadow-sm' : 'bg-[#A8BFA0]/30'}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step === 'summary' ? 'bg-[#6F7D61] shadow-sm' : 'bg-[#A8BFA0]/30'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-48">
        {/* Room Type */}
        {step === 'room-type' && (
          <div>
            <h1 className="mb-3">What type of room is this?</h1>
            <p className="text-neutral-600 mb-6">
              This helps us understand the light conditions
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setSpotData({ ...spotData, roomType: 'living-room' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.roomType === 'living-room'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <Home className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Living Room</h3>
                <p className="text-sm text-neutral-600">A common area for relaxation and entertainment</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, roomType: 'kitchen' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.roomType === 'kitchen'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <UtensilsCrossed className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Kitchen</h3>
                <p className="text-sm text-neutral-600">A space for cooking and food preparation</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, roomType: 'bathroom' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.roomType === 'bathroom'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <Bath className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Bathroom</h3>
                <p className="text-sm text-neutral-600">A private space for personal hygiene</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, roomType: 'bedroom' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.roomType === 'bedroom'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <Bed className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Bedroom</h3>
                <p className="text-sm text-neutral-600">A private space for sleeping and relaxation</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, roomType: 'office' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.roomType === 'office'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <Briefcase className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Office</h3>
                <p className="text-sm text-neutral-600">A space for work and productivity</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, roomType: 'dining-room' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.roomType === 'dining-room'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <DiningIcon className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Dining Room</h3>
                <p className="text-sm text-neutral-600">A space for dining and socializing</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, roomType: 'hallway' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.roomType === 'hallway'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <Home className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Hallway</h3>
                <p className="text-sm text-neutral-600">A passageway connecting rooms</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, roomType: 'other' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.roomType === 'other'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <DoorOpen className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Other</h3>
                <p className="text-sm text-neutral-600">A space not listed above</p>
              </button>
            </div>
          </div>
        )}

        {/* Light Source */}
        {step === 'light-source' && (
          <div>
            <h1 className="mb-3">What is the main light source here?</h1>
            <p className="text-neutral-600 mb-6">
              This helps us understand the light conditions
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setSpotData({ ...spotData, lightSourceType: 'window' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.lightSourceType === 'window'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <Sun className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Window</h3>
                <p className="text-sm text-neutral-600">Natural light from outside</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, lightSourceType: 'lamp' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.lightSourceType === 'lamp'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <Lamp className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">Lamp / Overhead Light</h3>
                <p className="text-sm text-neutral-600">Artificial lighting</p>
              </button>

              <button
                onClick={() => setSpotData({ ...spotData, lightSourceType: 'no-window' })}
                className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.lightSourceType === 'no-window'
                  ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                  : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                  }`}
              >
                <DoorClosed className="w-6 h-6 mb-2 text-[#6F7D61]" />
                <h3 className="mb-1">No window (indoor light only)</h3>
                <p className="text-sm text-neutral-600">Limited natural light</p>
              </button>
            </div>
          </div>
        )}

        {/* Direction */}
        {step === 'direction' && (
          <div>
            <h1 className="mb-3">Which direction does this window face?</h1>
            <p className="text-neutral-600 mb-6">
              This affects how much light your plant gets
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['North', 'East', 'South', 'West'].map((dir) => (
                <button
                  key={dir}
                  onClick={() => setSpotData({ ...spotData, direction: dir.toLowerCase() as any })}
                  className={`p-5 border-2 rounded-2xl transition-all ${spotData.direction === dir.toLowerCase()
                    ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                    : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                    }`}
                >
                  <h3>{dir}</h3>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSpotData({ ...spotData, direction: 'unsure' })}
              className={`w-full mt-3 p-4 border-2 rounded-2xl transition-all ${spotData.direction === 'unsure'
                ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                }`}
            >
              <p className="text-sm">I'm not sure</p>
            </button>
          </div>
        )}

        {/* Direct Sun */}
        {step === 'direct-sun' && (
          <div>
            <h1 className="mb-3">Does direct sun hit this spot?</h1>
            <p className="text-neutral-600 mb-6">
              Direct sun means unfiltered sunlight reaches this location
            </p>
            <div className="space-y-3">
              {[
                { value: 'lots', label: 'Yes, lots', desc: 'Strong direct sunlight for hours' },
                { value: 'a-bit', label: 'A bit', desc: 'Some direct sun at certain times' },
                { value: 'almost-none', label: 'Almost none', desc: 'Mostly filtered or indirect' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSpotData({ ...spotData, directSunExposure: option.value as any })}
                  className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.directSunExposure === option.value
                    ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                    : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                    }`}
                >
                  <h3 className="mb-1">{option.label}</h3>
                  <p className="text-sm text-neutral-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Distance */}
        {step === 'distance' && (
          <div>
            <h1 className="mb-3">How far is the plant from the window?</h1>
            <p className="text-neutral-600 mb-6">
              Distance affects light intensity
            </p>
            <div className="space-y-3">
              {[
                { value: 'windowsill', label: 'On the windowsill', desc: 'Right at the window' },
                { value: 'close', label: 'Close (0–2 ft)', desc: 'Very near the window' },
                { value: 'mid', label: 'Mid-distance (2–6 ft)', desc: 'A few feet away' },
                { value: 'far', label: 'Far (6+ ft)', desc: 'Across the room' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSpotData({ ...spotData, distanceFromWindow: option.value as any })}
                  className={`w-full p-5 border-2 rounded-2xl transition-all text-left ${spotData.distanceFromWindow === option.value
                    ? 'border-[#6F7D61] bg-[#A8BFA0]/10'
                    : 'border-neutral-200 bg-white hover:border-[#A8BFA0]'
                    }`}
                >
                  <h3 className="mb-1">{option.label}</h3>
                  <p className="text-sm text-neutral-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Name */}
        {step === 'name' && (
          <div>
            <h1 className="mb-3">Name your spot</h1>
            <p className="text-neutral-600 mb-6">
              Give this location a memorable name
            </p>
            <Input
              placeholder="e.g., Living room window"
              value={spotData.name}
              onChange={(e) => setSpotData({ ...spotData, name: e.target.value })}
              autoFocus
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm text-neutral-600">Examples:</p>
              {['Living room window', 'Bedroom desk', 'Kitchen shelf'].map((example) => (
                <button
                  key={example}
                  onClick={() => setSpotData({ ...spotData, name: example })}
                  className="block text-sm text-green-600 hover:underline"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {step === 'summary' && (() => {
          const lightLevel = calculateLightLevel(spotData);
          const environmentStyle = getEnvironmentStyle(lightLevel);
          const roomIcon = getRoomIcon(spotData.roomType as Spot['roomType']);
          const recommendedPlants = getRecommendedPlantsForSpot(lightLevel);

          return (
            <div>
              <h1 className="mb-3">✨ Your Spot is Ready!</h1>
              <p className="text-neutral-600 mb-6">
                Here's what we know about {spotData.name}
              </p>

              {/* Spot Card with Gradient - matching environments page */}
              <div
                className="rounded-3xl overflow-hidden shadow-lg relative mb-6 border-2 border-white"
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
                        <h3 className={environmentStyle.textColor}>{spotData.name}</h3>
                      </div>
                      <p className={`text-sm ${environmentStyle.subtextColor} capitalize`}>
                        {lightLevel.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="px-5 py-4 bg-white">
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-700">
                      <strong>Light Source:</strong> {spotData.lightSourceType === 'window' ? 'Window' : spotData.lightSourceType === 'lamp' ? 'Lamp' : 'No window'}
                    </p>
                    {spotData.direction && (
                      <p className="text-sm text-neutral-700">
                        <strong>Direction:</strong> {spotData.direction.charAt(0).toUpperCase() + spotData.direction.slice(1)}
                      </p>
                    )}
                    {spotData.distanceFromWindow && (
                      <p className="text-sm text-neutral-700">
                        <strong>Distance:</strong> {spotData.distanceFromWindow === 'windowsill' ? 'Windowsill' : spotData.distanceFromWindow === 'close' ? 'Close' : spotData.distanceFromWindow === 'mid' ? 'Mid' : 'Far'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommended Plants */}
              {recommendedPlants.length > 0 && (
                <div>
                  <h3 className="mb-3">🌿 Perfect Plants for This Spot</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {recommendedPlants.map((plant, index) => (
                      <div key={index} className="bg-white rounded-2xl overflow-hidden border-2 border-green-100 shadow-sm">
                        <div className="aspect-square bg-green-50 flex items-center justify-center">
                          <span className="text-4xl">{index === 0 ? '🌿' : index === 1 ? '🪴' : '🌱'}</span>
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-center">{plant.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 text-center mt-3">
                    These plants thrive in {lightLevel.replace('-', ' ')} conditions
                  </p>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Footer - Fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F5EFE7] border-t border-neutral-200 px-6 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] z-[60]">
        {step === 'summary' ? (
          <Button
            onClick={handleFinish}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Saving...' : 'Save Spot'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full"
            size="lg"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Calculate light level based on spot properties
function calculateLightLevel(spotData: any): 'bright-direct' | 'bright-indirect' | 'medium-indirect' | 'low-light' {
  if (spotData.lightSourceType === 'no-window') {
    return 'low-light';
  }

  if (spotData.lightSourceType === 'lamp') {
    return 'medium-indirect';
  }

  // Window-based logic
  if (spotData.directSunExposure === 'lots' &&
    (spotData.distanceFromWindow === 'windowsill' || spotData.distanceFromWindow === 'close')) {
    return 'bright-direct';
  }

  if ((spotData.direction === 'south' || spotData.direction === 'west') &&
    spotData.directSunExposure !== 'almost-none' &&
    spotData.distanceFromWindow !== 'far') {
    return 'bright-indirect';
  }

  if (spotData.distanceFromWindow === 'far' || spotData.directSunExposure === 'almost-none') {
    return 'low-light';
  }

  return 'medium-indirect';
}

// Get environment style based on light level
function getEnvironmentStyle(lightLevel: 'bright-direct' | 'bright-indirect' | 'medium-indirect' | 'low-light') {
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

// Get room icon based on room type
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