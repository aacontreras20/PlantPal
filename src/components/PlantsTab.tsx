import { useState } from 'react';
import { Plus, TrendingUp, Droplets, CheckCircle2, Circle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { AddPlantFlow } from './AddPlantFlow';
import { PlantDetailScreen } from './PlantDetailScreen';
import type { Plant, Spot, Task } from '../App';
import { getTaskIcon, getTaskColor, getTaskBgColor } from '../utils/taskHelpers';

type PlantsTabProps = {
  plants: Plant[];
  spots: Spot[];
  tasks: Task[];
  onAddPlant: (plant: Plant, tasks?: Task[]) => void;
  onUpdatePlant: (plant: Plant) => void;
  onAddSpot: (spot: Spot) => void;
  onToggleTask: (taskId: string) => void;
  onRegenerateTasks?: (plantId: string) => void;
  onNavigateToAIExpert?: (message: string) => void;
};

type View = 'list' | 'detail' | 'add-plant';

export function PlantsTab({
  plants,
  spots,
  tasks,
  onAddPlant,
  onUpdatePlant,
  onAddSpot,
  onToggleTask,
  onRegenerateTasks,
  onNavigateToAIExpert,
}: PlantsTabProps) {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  // Celebration messages
  const celebrations = [
    "🎉 Great job, plant parent!",
    "✨ You're crushing it!",
    "🌟 Your plants are lucky to have you!",
    "💚 Another task done!",
    "🏆 Plant care champion!",
    "🌿 Keep up the amazing work!",
  ];

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      // Show celebration
      setCelebrationMessage(celebrations[Math.floor(Math.random() * celebrations.length)]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
    }
    onToggleTask(taskId);
  };

  // Calculate stats
  const healthyPlants = plants.filter(p => p.status === 'all-good').length;
  const needsAttention = plants.filter(p => p.status !== 'all-good').length;
  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // Filter tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const todayTasks = tasks.filter(t => {
    const taskDate = new Date(t.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime() && !t.completed;
  });

  const upcomingTasks = tasks.filter(t => {
    const taskDate = new Date(t.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate > today && taskDate <= endOfWeek && !t.completed;
  });

  const getStatusColor = (status: Plant['status']) => {
    switch (status) {
      case 'all-good': return 'bg-[#A8BFA0]/20 text-[#6F7D61] border-[#A8BFA0]/40';
      case 'needs-water': return 'bg-[#C9A48F]/20 text-[#6F7D61] border-[#C9A48F]/40';
      case 'check-light': return 'bg-[#C9A48F]/20 text-[#6F7D61] border-[#C9A48F]/40';
      case 'needs-attention': return 'bg-[#C9A48F]/20 text-[#6F7D61] border-[#C9A48F]/40';
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

  if (currentView === 'detail' && selectedPlant) {
    const spot = spots.find(s => s.id === selectedPlant.spotId);
    
    return (
      <PlantDetailScreen
        plant={selectedPlant}
        spot={spot}
        tasks={tasks}
        onBack={() => setCurrentView('list')}
        onToggleTask={handleToggleTask}
        onUpdatePlant={onUpdatePlant}
        onNavigateToSpot={() => {
          // This would navigate to the Spots tab
          // We'll handle this in the parent App component
          setCurrentView('list');
        }}
        onRegenerateTasks={onRegenerateTasks}
        onNavigateToAIExpert={onNavigateToAIExpert}
      />
    );
  }

  if (currentView === 'add-plant') {
    return (
      <AddPlantFlow
        spots={spots}
        onComplete={(plant, tasks) => {
          onAddPlant(plant, tasks);
          setCurrentView('list');
        }}
        onAddSpot={onAddSpot}
        onCancel={() => setCurrentView('list')}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Celebration Toast */}
      {showCelebration && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-[#6F7D61] text-[#F5F2EA] px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <p className="">{celebrationMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-[#F5F2EA] to-[#f0ede3]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A8BFA0] to-[#6F7D61] rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <h1 className="text-[#2E3F34] leading-tight">PlantPal</h1>
              <p className="text-xs text-[#6F7D61]">
                {plants.length === 0 
                  ? 'Start your plant journey' 
                  : `${plants.length} ${plants.length === 1 ? 'plant' : 'plants'} growing strong`}
              </p>
            </div>
          </div>
          
          {/* Weather Widget */}
          <div className="flex items-center gap-1 px-2 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-[#6F7D61]/20 shadow-sm">
            <span className="text-xs">🌤️</span>
            <div className="text-[10px]">
              <p className="text-[#2E3F34] leading-tight">New York</p>
              <p className="text-[#6F7D61] leading-tight">49°/41°</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {plants.length > 0 && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-3 border border-[#A8BFA0]/30 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="w-5 h-5 text-[#6F7D61] mb-1" />
                <p className="text-xl text-[#6F7D61]">{healthyPlants}</p>
                <p className="text-xs text-[#6F7D61]/70">Healthy</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-[#C9A48F]/30 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <Droplets className="w-5 h-5 text-[#C9A48F] mb-1" />
                <p className="text-xl text-[#C9A48F]">{needsAttention}</p>
                <p className="text-xs text-[#6F7D61]/70">Need Care</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-[#A8BFA0]/30 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-5 h-5 text-[#6F7D61] mb-1" />
                <p className="text-xl text-[#6F7D61]">{completionRate}%</p>
                <p className="text-xs text-[#6F7D61]/70">Complete</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* To-Do Section */}
      {plants.length > 0 && (todayTasks.length > 0 || upcomingTasks.length > 0) && (
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-br from-[#6F7D61] to-[#5d6a52] rounded-3xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#F5F2EA]" />
              <h2 className="text-[#F5F2EA]">Your To-Dos</h2>
            </div>

            {/* Today */}
            {todayTasks.length > 0 && (
              <div className="mb-4">
                <p className="text-[#F5F2EA]/70 text-sm mb-2">Today</p>
                <div className="space-y-2">
                  {todayTasks.map(task => {
                    const plant = plants.find(p => p.id === task.plantId);
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className="w-full flex items-start gap-3 p-3 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all text-left border border-white/10"
                      >
                        <Circle className="w-5 h-5 text-[#F5F2EA]/70 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-[#F5F2EA]">{task.title}</p>
                          {plant && (
                            <p className="text-xs text-[#F5F2EA]/60 mt-0.5">{plant.name}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* This Week */}
            {upcomingTasks.length > 0 && (
              <div>
                <p className="text-[#F5F2EA]/70 text-sm mb-2">This Week</p>
                <div className="space-y-2">
                  {upcomingTasks.slice(0, 3).map(task => {
                    const plant = plants.find(p => p.id === task.plantId);
                    const dueDate = new Date(task.dueDate);
                    const TaskIcon = getTaskIcon(task.title);
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className="w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/25 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-[#F5F2EA] flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#F5F2EA]/50 flex-shrink-0" />
                          )}
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
                            <TaskIcon className="w-5 h-5 text-[#F5F2EA]" />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm text-[#F5F2EA] mb-1 ${task.completed ? 'line-through text-[#F5F2EA]/50' : ''}`}>
                              {task.title.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()}
                            </p>
                            <div className="flex items-center gap-2">
                              {plant && (
                                <p className="text-xs text-[#F5F2EA]/60">{plant.name}</p>
                              )}
                              <span className="text-xs text-[#F5F2EA]/40">•</span>
                              <p className="text-xs text-[#F5F2EA]/60">
                                {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {upcomingTasks.length > 3 && (
                    <p className="text-xs text-[#F5F2EA]/60 text-center py-1">
                      +{upcomingTasks.length - 3} more tasks
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* All Complete */}
            {todayTasks.length === 0 && upcomingTasks.length === 0 && tasks.length > 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <CheckCircle2 className="w-8 h-8 text-[#F5F2EA]" />
                </div>
                <p className="text-[#F5F2EA] text-lg mb-1">All caught up!</p>
                <p className="text-[#F5F2EA]/60 text-sm">No tasks due this week</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plant list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {plants.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#A8BFA0] to-[#6F7D61] rounded-full flex items-center justify-center mb-4 shadow-md">
              <span className="text-4xl">🌿</span>
            </div>
            <h3 className="mb-2 text-[#2E3F34]">Start Your Plant Journey</h3>
            <p className="text-[#6F7D61] mb-6 px-4">
              Add your first plant and we'll help you keep it healthy and thriving
            </p>
            <Button onClick={() => setCurrentView('add-plant')} size="lg" className="shadow-md">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Plant
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[#2E3F34]">My Plants</h2>
            </div>
            {plants.map((plant) => {
              const spot = spots.find(s => s.id === plant.spotId);
              return (
                <button
                  key={plant.id}
                  onClick={() => {
                    setSelectedPlantId(plant.id);
                    setCurrentView('detail');
                  }}
                  className="w-full bg-white rounded-3xl p-4 hover:shadow-md transition-all text-left border border-[#A8BFA0]/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={plant.image}
                        alt={plant.name}
                        className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                      />
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#A8BFA0]/30">
                        <span className="text-base">{getStatusEmoji(plant.status)}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-[#2E3F34]">{plant.name}</h3>
                      {spot && (
                        <p className="text-sm text-[#6F7D61] mb-2">{spot.name}</p>
                      )}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusColor(plant.status)}`}>
                        {getStatusText(plant.status)}
                      </span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-[#6F7D61]" />
                  </div>
                </button>
              );
            })}

            <Button
              onClick={() => setCurrentView('add-plant')}
              variant="outline"
              className="w-full border-2 border-dashed border-[#A8BFA0]/50 hover:border-[#6F7D61] hover:bg-[#A8BFA0]/10 text-[#6F7D61]"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Plant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}