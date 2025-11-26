import { Camera, Upload, X, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Plant, Spot } from '../App';

type PhotoPlantIdentificationProps = {
  onAddPlant: (plant: Plant) => void;
  onBack: () => void;
  spot: Spot;
};

const commonPlants = [
  { name: 'Monstera', scientificName: 'Monstera deliciosa', lightRequirement: 'bright-indirect' as const, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800' },
  { name: 'Snake Plant', scientificName: 'Dracaena trifasciata', lightRequirement: 'low-light' as const, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?w=800' },
  { name: 'Pothos', scientificName: 'Epipremnum aureum', lightRequirement: 'medium-indirect' as const, image: 'https://images.unsplash.com/photo-1597305877032-0668b3834e50?w=800' },
  { name: 'Fiddle Leaf Fig', scientificName: 'Ficus lyrata', lightRequirement: 'bright-indirect' as const, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800' },
  { name: 'Peace Lily', scientificName: 'Spathiphyllum', lightRequirement: 'medium-indirect' as const, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb8?w=800' },
  { name: 'Spider Plant', scientificName: 'Chlorophytum comosum', lightRequirement: 'medium-indirect' as const, image: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800' },
];

export function PhotoPlantIdentification({ onAddPlant, onBack, spot }: PhotoPlantIdentificationProps) {
  const [mode, setMode] = useState<'photo' | 'search'>('photo');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlants = commonPlants.filter(plant => 
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createPlant = (plantData: typeof commonPlants[0], imageOverride?: string) => {
    const wateringDays = spot.lightLevel === 'bright-direct' ? 6 
      : spot.lightLevel === 'bright-indirect' ? 8
      : spot.lightLevel === 'medium-indirect' ? 12
      : 17;
    
    const status = plantData.lightRequirement === spot.lightLevel ? 'all-good' as const : 'check-light' as const;
    
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      name: plantData.name,
      scientificName: plantData.scientificName,
      image: imageOverride || plantData.image,
      spotId: spot.id,
      status: status,
      lightRequirement: plantData.lightRequirement,
      careInstructions: {
        wateringFrequency: `Water every ${wateringDays} days`,
        wateringDays: wateringDays,
        lightDescription: spot.lightLevel.replace('-', ' '),
      },
      addedDate: new Date().toISOString(),
    };
    
    onAddPlant(newPlant);
  };

  const handleIdentify = () => {
    setIsIdentifying(true);
    
    setTimeout(() => {
      const identified = commonPlants[Math.floor(Math.random() * commonPlants.length)];
      createPlant(identified, uploadedImage || undefined);
    }, 2000);
  };

  const handleSelectPlant = (plant: typeof commonPlants[0]) => {
    createPlant(plant);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-emerald-900/10 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-emerald-900">Add Your Plant</h1>
          <button onClick={onBack} className="text-emerald-800 hover:text-emerald-900">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setMode('photo')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm transition-all ${
              mode === 'photo' 
                ? 'bg-emerald-800 text-white' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Photo
          </button>
          <button
            onClick={() => setMode('search')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm transition-all ${
              mode === 'search' 
                ? 'bg-emerald-800 text-white' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Search
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {mode === 'photo' ? (
          !uploadedImage ? (
            <div className="space-y-4">
              {/* Camera Option */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-emerald-800/20 rounded-3xl p-8 text-center cursor-pointer hover:border-emerald-800/40 hover:bg-emerald-50/50 transition-all">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-emerald-800" />
                  </div>
                  <h3 className="text-emerald-900 mb-2">Take a Photo</h3>
                  <p className="text-sm text-neutral-600">
                    Use your camera to snap a photo of your plant
                  </p>
                </div>
              </label>

              {/* Upload Option - Smaller */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button className="w-full p-4 border-2 border-emerald-800/20 rounded-2xl hover:border-emerald-800/40 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-3">
                  <Upload className="w-5 h-5 text-emerald-800" />
                  <span className="text-sm text-emerald-900">Or upload from gallery</span>
                </button>
              </label>

              <div className="bg-emerald-50 border border-emerald-800/20 rounded-2xl p-4">
                <p className="text-sm text-emerald-900">
                  <strong>💡 Tips for best results:</strong>
                </p>
                <ul className="text-sm text-emerald-800 mt-2 space-y-1 ml-4">
                  <li>• Good lighting is key</li>
                  <li>• Include leaves and stems</li>
                  <li>• Get close to the plant</li>
                  <li>• Avoid blurry photos</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Plant preview"
                  className="w-full h-80 object-cover rounded-3xl border-2 border-emerald-800/20"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-emerald-900" />
                </button>
              </div>

              {/* Identify Button */}
              <Button
                onClick={handleIdentify}
                disabled={isIdentifying}
                className="w-full h-14 bg-emerald-800 hover:bg-emerald-900"
                size="lg"
              >
                {isIdentifying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Identifying plant...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Identify Plant
                  </>
                )}
              </Button>

              <div className="bg-emerald-50 border border-emerald-800/20 rounded-2xl p-4">
                <p className="text-xs text-emerald-800 text-center">
                  Our AI will analyze your photo and identify the plant species
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search for a plant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-3">
              {filteredPlants.map((plant) => (
                <button
                  key={plant.name}
                  onClick={() => handleSelectPlant(plant)}
                  className="border-2 border-emerald-800/20 rounded-2xl p-3 text-left hover:border-emerald-800 hover:bg-emerald-50/50 transition-all"
                >
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-24 object-cover rounded-xl mb-2"
                  />
                  <h3 className="text-sm text-emerald-900 mb-1">{plant.name}</h3>
                  <p className="text-xs text-neutral-600">
                    {plant.scientificName}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}