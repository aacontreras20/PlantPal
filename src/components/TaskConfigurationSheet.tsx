import { useState } from 'react';
import { X, Droplets, RotateCw, Sprout, Wind, Scissors, Bug, Check } from 'lucide-react';
import { Button } from './ui/button';
import type { Plant } from '../App';

type TaskType = 'watering' | 'rotating' | 'fertilizing' | 'misting' | 'pruning' | 'pestCheck';

type TaskConfigurationSheetProps = {
  plant: Plant;
  onClose: () => void;
  onSave: (updatedConfig: Plant['taskConfig']) => void;
};

const taskTypes: { key: TaskType; label: string; icon: any; description: string; defaultDays: number }[] = [
  { key: 'watering', label: 'Watering', icon: Droplets, description: 'Regular watering schedule', defaultDays: 7 },
  { key: 'rotating', label: 'Rotating', icon: RotateCw, description: 'Turn for even growth', defaultDays: 14 },
  { key: 'fertilizing', label: 'Fertilizing', icon: Sprout, description: 'Feed with nutrients', defaultDays: 30 },
  { key: 'misting', label: 'Misting', icon: Wind, description: 'Humidity boost', defaultDays: 3 },
  { key: 'pruning', label: 'Pruning', icon: Scissors, description: 'Trim dead leaves', defaultDays: 60 },
  { key: 'pestCheck', label: 'Pest Check', icon: Bug, description: 'Inspect for pests', defaultDays: 21 },
];

export function TaskConfigurationSheet({ plant, onClose, onSave }: TaskConfigurationSheetProps) {
  const [config, setConfig] = useState<Plant['taskConfig']>(
    plant.taskConfig || {
      watering: { enabled: true, frequencyDays: 7 },
      rotating: { enabled: false, frequencyDays: 14 },
      fertilizing: { enabled: false, frequencyDays: 30 },
      misting: { enabled: false, frequencyDays: 3 },
      pruning: { enabled: false, frequencyDays: 60 },
      pestCheck: { enabled: false, frequencyDays: 21 },
    }
  );
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);

  const toggleTask = (taskKey: TaskType) => {
    setConfig({
      ...config,
      [taskKey]: {
        ...config[taskKey],
        enabled: !config[taskKey].enabled,
      },
    });
  };

  const updateFrequency = (taskKey: TaskType, days: number) => {
    setConfig({
      ...config,
      [taskKey]: {
        ...config[taskKey],
        frequencyDays: days,
      },
    });
    setEditingTask(null);
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-in fade-in">
      <div className="w-full max-w-[375px] bg-gradient-to-br from-green-500 to-emerald-600 rounded-t-3xl shadow-xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white">Manage Care Tasks</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors border border-white/30"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-sm text-white/90">
            Choose which tasks you want to track for {plant.name}
          </p>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {taskTypes.map((taskType) => {
              const Icon = taskType.icon;
              const isEnabled = config[taskType.key].enabled;
              const frequency = config[taskType.key].frequencyDays;

              return (
                <div key={taskType.key}>
                  <div
                    className={`bg-white/20 backdrop-blur-sm border-2 rounded-2xl p-4 transition-all ${
                      isEnabled
                        ? 'border-white/50'
                        : 'border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Toggle checkbox */}
                      <button
                        onClick={() => toggleTask(taskType.key)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                          isEnabled
                            ? 'border-white bg-white'
                            : 'border-white/40 bg-transparent'
                        }`}
                      >
                        {isEnabled && <Check className="w-4 h-4 text-green-600" />}
                      </button>

                      {/* Task info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-5 h-5 ${isEnabled ? 'text-white' : 'text-white/50'}`} />
                          <h3 className={isEnabled ? 'text-white' : 'text-white/60'}>
                            {taskType.label}
                          </h3>
                        </div>
                        <p className={`text-sm mb-2 ${isEnabled ? 'text-white/90' : 'text-white/50'}`}>
                          {taskType.description}
                        </p>
                        
                        {isEnabled && (
                          <button
                            onClick={() => setEditingTask(taskType.key)}
                            className="text-sm text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                          >
                            Every {frequency} {frequency === 1 ? 'day' : 'days'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Frequency picker */}
                  {editingTask === taskType.key && (
                    <div className="mt-2 p-4 bg-white/30 backdrop-blur-sm rounded-xl border-2 border-white/40">
                      <p className="text-sm text-white mb-3">How often?</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 3, 7, 14, 21, 30, 60, 90].map((days) => (
                          <button
                            key={days}
                            onClick={() => updateFrequency(taskType.key, days)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              frequency === days
                                ? 'border-white bg-white text-green-600'
                                : 'border-white/40 bg-white/20 text-white hover:border-white/60 backdrop-blur-sm'
                            }`}
                          >
                            <div className="text-sm">{days}d</div>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="w-full mt-3 text-sm text-white/90 hover:text-white bg-white/10 backdrop-blur-sm py-2 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/20">
          <button
            onClick={handleSave}
            className="w-full bg-white text-green-600 py-3 rounded-2xl hover:bg-white/95 transition-colors shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}