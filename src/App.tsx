import { useState } from 'react';
import { Home, MapPin, MessageSquare, User } from 'lucide-react';
import { OnboardingFlow } from './components/OnboardingFlow';
import { PlantsTab } from './components/PlantsTab';
import { SpotsTab } from './components/SpotsTab';
import { AIExpertTab } from './components/AIExpertTab';
import { ProfileTab } from './components/ProfileTab';
import { regenerateTaskForType, getTaskTypeFromTitle } from './utils/taskGenerator';

export type Plant = {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  spotId: string;
  status: 'all-good' | 'needs-water' | 'check-light' | 'needs-attention';
  lightRequirement: 'bright-indirect' | 'medium-indirect' | 'low-light' | 'bright-direct';
  careInstructions: {
    wateringFrequency: string; // Display text like "Every 7 days"
    wateringDays: number; // Actual number of days between waterings
    lightDescription: string;
  };
  taskConfig?: {
    watering: { enabled: boolean; frequencyDays: number };
    rotating: { enabled: boolean; frequencyDays: number };
    fertilizing: { enabled: boolean; frequencyDays: number };
    misting: { enabled: boolean; frequencyDays: number };
    pruning: { enabled: boolean; frequencyDays: number };
    pestCheck: { enabled: boolean; frequencyDays: number };
  };
  addedDate: string;
  lightWarningDismissed?: boolean; // Track if user dismissed the light mismatch warning
  lightMismatchOverride?: boolean; // Track if user confirmed light mismatch is not an issue
};

export type Spot = {
  id: string;
  name: string;
  roomType: 'bedroom' | 'living-room' | 'kitchen' | 'bathroom' | 'office' | 'dining-room' | 'hallway' | 'other';
  lightSourceType: 'window' | 'lamp' | 'no-window';
  direction?: 'north' | 'east' | 'south' | 'west' | 'unsure';
  directSunExposure?: 'lots' | 'a-bit' | 'almost-none';
  distanceFromWindow?: 'windowsill' | 'close' | 'mid' | 'far';
  lightLevel: 'bright-indirect' | 'medium-indirect' | 'low-light' | 'bright-direct';
};

export type Task = {
  id: string;
  plantId: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

type TabType = 'plants' | 'spots' | 'ai-expert' | 'profile';

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('plants');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiExpertPrefilledMessage, setAiExpertPrefilledMessage] = useState<string>('');
  const [isInFlow, setIsInFlow] = useState(false); // Track if user is in a survey flow

  const handleCompleteOnboarding = (
    newPlants: Plant[],
    newSpots: Spot[],
    newTasks: Task[]
  ) => {
    setPlants(newPlants);
    setSpots(newSpots);
    setTasks(newTasks);
    setHasCompletedOnboarding(true);
  };

  const handleAddPlant = (plant: Plant, newTasks?: Task[]) => {
    setPlants([...plants, plant]);
    if (newTasks && newTasks.length > 0) {
      setTasks([...tasks, ...newTasks]);
    }
  };

  const handleAddSpot = (spot: Spot) => {
    setSpots([...spots, spot]);
  };

  const handleUpdatePlant = (updatedPlant: Plant) => {
    setPlants(plants.map(p => p.id === updatedPlant.id ? updatedPlant : p));
  };

  const handleUpdateSpot = (updatedSpot: Spot) => {
    setSpots(spots.map(s => s.id === updatedSpot.id ? updatedSpot : s));
  };

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);

    // Toggle the task
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));

    // If completing a task, automatically generate the next occurrence
    if (task && !task.completed) {
      const plant = plants.find(p => p.id === task.plantId);
      if (plant && plant.taskConfig) {
        const taskType = getTaskTypeFromTitle(task.title);
        if (taskType && plant.taskConfig[taskType as keyof typeof plant.taskConfig]) {
          const config = plant.taskConfig[taskType as keyof typeof plant.taskConfig];
          if (config.enabled) {
            // Generate the next task for this type
            const nextTask = regenerateTaskForType(plant, taskType, config.frequencyDays);
            // Add the new task after a brief delay to prevent immediate re-render issues
            setTimeout(() => {
              setTasks(prevTasks => [...prevTasks, nextTask]);
            }, 100);
          }
        }
      }
    }
  };

  const handleRegenerateTasks = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant || !plant.taskConfig) return;

    // Remove existing non-completed tasks for this plant
    const existingTasks = tasks.filter(t => t.plantId !== plantId || t.completed);

    // Generate new tasks based on task configuration
    const newTasks: Task[] = [];
    const now = Date.now();

    Object.entries(plant.taskConfig).forEach(([taskType, config]) => {
      if (config.enabled) {
        const taskNames: Record<string, string> = {
          watering: `💧 Water ${plant.name}`,
          rotating: `🔄 Rotate ${plant.name}`,
          fertilizing: `🌱 Fertilize ${plant.name}`,
          misting: `💨 Mist ${plant.name}`,
          pruning: `✂️ Prune ${plant.name}`,
          pestCheck: `🐛 Check ${plant.name} for pests`,
        };

        const taskName = taskNames[taskType] || `Care for ${plant.name}`;
        const dueDate = new Date(now + config.frequencyDays * 24 * 60 * 60 * 1000);

        newTasks.push({
          id: `task-${plantId}-${taskType}-${Date.now()}`,
          plantId: plant.id,
          title: taskName,
          dueDate: dueDate.toISOString(),
          completed: false,
        });
      }
    });

    setTasks([...existingTasks, ...newTasks]);
  };

  const handleNavigateToAIExpert = (message: string) => {
    setAiExpertPrefilledMessage(message);
    setCurrentTab('ai-expert');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* App content */}
      <div className="flex-1 overflow-hidden relative w-full h-full pt-[env(safe-area-inset-top)]">
        {!hasCompletedOnboarding ? (
          <OnboardingFlow onComplete={handleCompleteOnboarding} />
        ) : (
          <>
            {/* Tab content - adjust height to account for bottom tab bar */}
            <div className={`h-full ${!isInFlow ? 'pb-[calc(70px+env(safe-area-inset-bottom))]' : ''} overflow-y-auto`}>
              {currentTab === 'plants' && (
                <PlantsTab
                  plants={plants}
                  spots={spots}
                  tasks={tasks}
                  onAddPlant={handleAddPlant}
                  onUpdatePlant={handleUpdatePlant}
                  onAddSpot={handleAddSpot}
                  onToggleTask={handleToggleTask}
                  onRegenerateTasks={handleRegenerateTasks}
                  onNavigateToAIExpert={handleNavigateToAIExpert}
                  onFlowStateChange={setIsInFlow}
                />
              )}
              {currentTab === 'spots' && (
                <SpotsTab
                  spots={spots}
                  plants={plants}
                  tasks={tasks}
                  onAddSpot={handleAddSpot}
                  onUpdateSpot={handleUpdateSpot}
                  onUpdatePlant={handleUpdatePlant}
                  onToggleTask={handleToggleTask}
                  onAddPlant={handleAddPlant}
                  onRegenerateTasks={handleRegenerateTasks}
                  onFlowStateChange={setIsInFlow}
                />
              )}
              {currentTab === 'ai-expert' && (
                <AIExpertTab
                  plants={plants}
                  prefilledMessage={aiExpertPrefilledMessage}
                  setPrefilledMessage={setAiExpertPrefilledMessage}
                />
              )}
              {currentTab === 'profile' && (
                <ProfileTab plants={plants} spots={spots} />
              )}
            </div>

            {/* Bottom tab bar - only show when not in a flow */}
            {!isInFlow && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 pb-[env(safe-area-inset-bottom)] z-50">
                <div className="flex items-center justify-around h-[70px] px-4 py-2">
                  <button
                    onClick={() => setCurrentTab('plants')}
                    className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'plants' ? 'text-[#6F7D61]' : 'text-neutral-400'
                      }`}
                  >
                    <Home className="w-6 h-6" />
                    <span className="text-xs">Plants</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('spots')}
                    className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'spots' ? 'text-[#6F7D61]' : 'text-neutral-400'
                      }`}
                  >
                    <MapPin className="w-6 h-6" />
                    <span className="text-xs">Environments</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('ai-expert')}
                    className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'ai-expert' ? 'text-[#6F7D61]' : 'text-neutral-400'
                      }`}
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-xs">AI Expert</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('profile')}
                    className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'profile' ? 'text-[#6F7D61]' : 'text-neutral-400'
                      }`}
                  >
                    <User className="w-6 h-6" />
                    <span className="text-xs">Profile</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}