import { ArrowLeft, ChevronDown, ChevronUp, MapPin, MessageSquare, Circle, CheckCircle2, Edit2, Droplets, Sun, Calendar, AlertTriangle, ChevronRight, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Plant, Spot, Task } from '../App';
import { getTaskIcon, getTaskColor, getTaskBgColor } from '../utils/taskHelpers';
import { TaskConfigurationSheet } from './TaskConfigurationSheet';

type PlantDetailScreenProps = {
  plant: Plant;
  spot?: Spot;
  tasks: Task[];
  onBack: () => void;
  onToggleTask: (taskId: string) => void;
  onUpdatePlant: (plant: Plant) => void;
  onNavigateToSpot?: () => void;
  onRegenerateTasks?: (plantId: string) => void;
  onNavigateToAIExpert?: (message: string) => void;
};

type ExpandedSection = 'care' | 'tasks' | 'spot' | 'plant-info' | 'task-config' | null;

export function PlantDetailScreen({
  plant,
  spot,
  tasks,
  onBack,
  onToggleTask,
  onUpdatePlant,
  onNavigateToSpot,
  onRegenerateTasks,
  onNavigateToAIExpert,
}: PlantDetailScreenProps) {
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>('care');
  const [isEditingWatering, setIsEditingWatering] = useState(false);
  const [customWateringDays, setCustomWateringDays] = useState(
    plant.careInstructions?.wateringDays?.toString() || '7'
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState(plant.name);
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [customAge, setCustomAge] = useState(
    Math.floor((Date.now() - new Date(plant.addedDate).getTime()) / (1000 * 60 * 60 * 24)).toString()
  );
  const [showTaskConfig, setShowTaskConfig] = useState(false);

  // Filter tasks for this plant in real-time
  const plantTasks = tasks.filter(t => t.plantId === plant.id);
  const incompleteTasks = plantTasks.filter(t => !t.completed);
  const completedTasks = plantTasks.filter(t => t.completed);

  const toggleSection = (section: ExpandedSection) => {
    if (section === 'task-config') {
      setShowTaskConfig(true);
      return;
    }
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSaveTaskConfig = (updatedConfig: Plant['taskConfig']) => {
    const updatedPlant = {
      ...plant,
      taskConfig: updatedConfig,
    };
    onUpdatePlant(updatedPlant);
    
    // Regenerate tasks based on new config
    if (onRegenerateTasks) {
      onRegenerateTasks(plant.id);
    }
  };

  const handleSaveWatering = () => {
    const days = parseInt(customWateringDays) || plant.careInstructions.wateringDays;
    const updatedPlant = {
      ...plant,
      careInstructions: {
        ...plant.careInstructions,
        wateringDays: days,
        wateringFrequency: `Water every ${days} days`,
      },
    };
    onUpdatePlant(updatedPlant);
    setIsEditingWatering(false);
  };

  const handleSaveName = () => {
    const updatedPlant = {
      ...plant,
      name: customName,
    };
    onUpdatePlant(updatedPlant);
    setIsEditingName(false);
  };

  const handleSaveAge = () => {
    const daysAgo = parseInt(customAge) || 0;
    const newDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const updatedPlant = {
      ...plant,
      addedDate: newDate.toISOString(),
    };
    onUpdatePlant(updatedPlant);
    setIsEditingAge(false);
  };

  const handleDismissLightWarning = () => {
    const updatedPlant = {
      ...plant,
      lightWarningDismissed: true,
    };
    onUpdatePlant(updatedPlant);
  };

  const handleOverrideLightMismatch = () => {
    // Check if light mismatch is the only issue
    const isLightTheOnlyIssue = plant.status === 'check-light';
    
    const updatedPlant = {
      ...plant,
      lightMismatchOverride: true,
      lightWarningDismissed: true,
      // If light was the only issue, mark plant as healthy
      status: isLightTheOnlyIssue ? ('all-good' as const) : plant.status,
    };
    onUpdatePlant(updatedPlant);
  };

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    
    // If toggling a "Check light" task to completed, re-enable the warning
    if (task && task.title.toLowerCase().includes('light') && !task.completed) {
      const updatedPlant = {
        ...plant,
        lightWarningDismissed: false,
      };
      onUpdatePlant(updatedPlant);
    }
    
    onToggleTask(taskId);
  };

  const getStatusColor = (status: Plant['status']) => {
    switch (status) {
      case 'all-good': return 'bg-green-100 text-green-700 border-green-200';
      case 'needs-water': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'check-light': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'needs-attention': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusText = (status: Plant['status']) => {
    switch (status) {
      case 'all-good': return 'Thriving';
      case 'needs-water': return 'Thirsty soon';
      case 'check-light': return 'Check light';
      case 'needs-attention': return 'Needs care';
    }
  };

  const getStatusEmoji = (status: Plant['status']) => {
    switch (status) {
      case 'all-good': return '✨';
      case 'needs-water': return '💧';
      case 'check-light': return '☀️';
      case 'needs-attention': return '🌱';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-200 bg-white">
        <button onClick={onBack} className="flex items-center gap-2 text-green-600 mb-4 hover:text-green-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Plant Image & Info */}
        <div className="px-6 py-6 bg-white">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl overflow-hidden mb-4 border-2 border-green-100">
            <img
              src={plant.image}
              alt={plant.name}
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              {isEditingName ? (
                <div className="space-y-2 mb-3">
                  <Input
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Plant name"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveName}
                      size="sm"
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingName(false);
                        setCustomName(plant.name);
                      }}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="mb-0">{plant.name}</h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-neutral-600 mb-3">{plant.scientificName}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getStatusEmoji(plant.status)}</span>
              <span className={`px-3 py-1.5 rounded-full text-xs border ${getStatusColor(plant.status)}`}>
                {getStatusText(plant.status)}
              </span>
            </div>
          </div>
          
          {spot && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-sm px-3 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
            >
              <MapPin className="w-4 h-4" />
              <span>{spot.name}</span>
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="px-6 pb-4 bg-white">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
              <Droplets className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-neutral-600">Next Water</p>
              <p className="text-sm text-blue-700">3 days</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
              <Sun className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <p className="text-xs text-neutral-600">Needs</p>
              <p className="text-sm text-amber-700 capitalize">{plant.lightRequirement.replace('-', ' ')}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
              <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-neutral-600">Age</p>
              <p className="text-sm text-green-700">
                {Math.floor((Date.now() - new Date(plant.addedDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          </div>
        </div>

        {/* Light Mismatch Warning */}
        {spot && spot.lightLevel !== plant.lightRequirement && !plant.lightWarningDismissed && !plant.lightMismatchOverride && (
          <div className="px-6 pb-4 bg-white">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-900 mb-1">
                    <strong>Light mismatch detected</strong>
                  </p>
                  <p className="text-xs text-amber-800">
                    This plant needs <strong>{plant.lightRequirement.replace('-', ' ')}</strong> but is currently getting <strong>{spot.lightLevel.replace('-', ' ')}</strong>. Consider moving it to a more suitable spot for optimal growth.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleDismissLightWarning}
                  className="text-sm text-amber-700 hover:text-amber-800 underline"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleOverrideLightMismatch}
                  className="text-sm bg-amber-600 text-white px-4 py-1.5 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Not an issue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Sections */}
        <div className="px-6 pb-6 space-y-3 bg-background pt-4">
          {/* Plant Info */}
          <div className="border-2 border-green-100 rounded-3xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => toggleSection('plant-info' as ExpandedSection)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <h3 className="text-sm">Plant Info</h3>
              </div>
              {expandedSection === 'plant-info' ? (
                <ChevronUp className="w-5 h-5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              )}
            </button>
            {expandedSection === 'plant-info' && (
              <div className="px-5 py-4 bg-green-50/50 border-t-2 border-green-100 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-neutral-600">Age (days with you)</p>
                    {!isEditingAge && (
                      <button
                        onClick={() => setIsEditingAge(true)}
                        className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditingAge ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={customAge}
                        onChange={(e) => setCustomAge(e.target.value)}
                        placeholder="Days"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveAge}
                          size="sm"
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingAge(false);
                            setCustomAge(
                              Math.floor((Date.now() - new Date(plant.addedDate).getTime()) / (1000 * 60 * 60 * 24)).toString()
                            );
                          }}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm bg-white rounded-lg px-3 py-2 border border-green-200">
                      {Math.floor((Date.now() - new Date(plant.addedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-2">Scientific Name</p>
                  <p className="text-sm bg-white rounded-lg px-3 py-2 border border-green-200 italic">
                    {plant.scientificName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Care Summary */}
          <div className="border-2 border-green-100 rounded-3xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => toggleSection('care')}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-green-600" />
                <h3 className="text-sm">Care Summary</h3>
              </div>
              {expandedSection === 'care' ? (
                <ChevronUp className="w-5 h-5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              )}
            </button>
            {expandedSection === 'care' && (
              <div className="px-5 py-4 bg-green-50/50 border-t-2 border-green-100 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-neutral-600">Watering Schedule</p>
                    {!isEditingWatering && (
                      <button
                        onClick={() => setIsEditingWatering(true)}
                        className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditingWatering ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={customWateringDays}
                          onChange={(e) => setCustomWateringDays(e.target.value)}
                          placeholder="e.g., 7"
                          className="flex-1"
                        />
                        <span className="text-sm text-neutral-600">days</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveWatering}
                          size="sm"
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingWatering(false);
                            setCustomWateringDays(plant.careInstructions.wateringDays.toString());
                          }}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm bg-white rounded-lg px-3 py-2 border border-green-200">
                      Every {plant.careInstructions.wateringDays} days
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-2">Light Requirements</p>
                  <p className="text-sm bg-white rounded-lg px-3 py-2 border border-green-200 mb-2">
                    Needs <strong>{plant.lightRequirement.replace('-', ' ')}</strong>
                  </p>
                  {spot && (
                    <p className="text-xs text-neutral-600">
                      Currently in: <span className="capitalize">{spot.lightLevel.replace('-', ' ')}</span>
                      {spot.lightLevel === plant.lightRequirement && (
                        <span className="text-green-600 ml-1">✓ Perfect match</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="bg-green-100 border border-green-200 rounded-xl p-3">
                  <p className="text-xs text-green-800">
                    💡 <strong>Pro tip:</strong> Check the soil before watering. Stick your finger 2 inches deep - if it's dry, water thoroughly!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tasks */}
          <div className="border-2 border-green-100 rounded-3xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => toggleSection('tasks')}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="text-sm">Tasks</h3>
                {incompleteTasks.length > 0 && (
                  <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs">
                    {incompleteTasks.length}
                  </span>
                )}
              </div>
              {expandedSection === 'tasks' ? (
                <ChevronUp className="w-5 h-5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              )}
            </button>
            {expandedSection === 'tasks' && (
              <div className="px-5 py-4 bg-green-50/50 border-t-2 border-green-100 space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-sm text-neutral-600 text-center py-4">
                    No tasks yet - you're all caught up! 🎉
                  </p>
                ) : (
                  <>
                    {incompleteTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => handleTaskToggle(task.id)}
                        className="w-full flex items-start gap-3 p-3 bg-white rounded-xl hover:bg-green-100 transition-colors text-left border border-green-200 shadow-sm"
                      >
                        <Circle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm">{task.title.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </button>
                    ))}
                    {completedTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => handleTaskToggle(task.id)}
                        className="w-full flex items-start gap-3 p-3 bg-white rounded-xl hover:bg-neutral-100 transition-colors text-left opacity-60 border border-neutral-200"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm line-through">{task.title.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Completed</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Spot Info */}
          {spot && (
            <div className="border-2 border-green-100 rounded-3xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleSection('spot')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm">Location Details</h3>
                </div>
                {expandedSection === 'spot' ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              {expandedSection === 'spot' && (
                <div className="px-5 py-4 bg-green-50/50 border-t-2 border-green-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-green-200">
                      <p className="text-xs text-neutral-600 mb-1">Name</p>
                      <p className="text-sm">{spot.name}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-green-200">
                      <p className="text-xs text-neutral-600 mb-1">Light Level</p>
                      <p className="text-sm capitalize">{spot.lightLevel.replace('-', ' ')}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-green-200">
                      <p className="text-xs text-neutral-600 mb-1">Light Source</p>
                      <p className="text-sm capitalize">
                        {spot.lightSourceType === 'no-window' ? 'No window' : spot.lightSourceType}
                      </p>
                    </div>
                    {spot.direction && (
                      <div className="bg-white rounded-xl p-3 border border-green-200">
                        <p className="text-xs text-neutral-600 mb-1">Direction</p>
                        <p className="text-sm capitalize">{spot.direction}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Task Configuration */}
          <button
            onClick={() => setShowTaskConfig(true)}
            className="w-full border-2 border-green-100 rounded-3xl overflow-hidden bg-white shadow-sm px-5 py-4 flex items-center justify-between hover:bg-green-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-green-600" />
              <h3 className="text-sm">Manage Care Tasks</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>

          {/* Ask the Expert */}
          <Button 
            variant="outline" 
            className="w-full border-2 border-green-300 hover:border-green-500 hover:bg-green-50 shadow-sm"
            size="lg"
            onClick={() => onNavigateToAIExpert && onNavigateToAIExpert(`Ask AI Expert about ${plant.name}`)}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Ask AI Expert about {plant.name}
          </Button>
        </div>
      </div>

      {/* Task Configuration Sheet Overlay */}
      {showTaskConfig && (
        <TaskConfigurationSheet
          plant={plant}
          onClose={() => setShowTaskConfig(false)}
          onSave={handleSaveTaskConfig}
        />
      )}
    </div>
  );
}