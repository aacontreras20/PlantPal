import type { Plant, Task } from '../App';

export function generateTasksForPlant(plant: Plant): Task[] {
  if (!plant.taskConfig) return [];

  const tasks: Task[] = [];
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

      tasks.push({
        id: `task-${plant.id}-${taskType}-${Date.now()}-${Math.random()}`,
        plantId: plant.id,
        title: taskName,
        dueDate: dueDate.toISOString(),
        completed: false,
      });
    }
  });

  return tasks;
}

export function regenerateTaskForType(
  plant: Plant,
  taskType: string,
  frequencyDays: number
): Task {
  const taskNames: Record<string, string> = {
    watering: `💧 Water ${plant.name}`,
    rotating: `🔄 Rotate ${plant.name}`,
    fertilizing: `🌱 Fertilize ${plant.name}`,
    misting: `💨 Mist ${plant.name}`,
    pruning: `✂️ Prune ${plant.name}`,
    pestCheck: `🐛 Check ${plant.name} for pests`,
  };

  const taskName = taskNames[taskType] || `Care for ${plant.name}`;
  const now = Date.now();
  const dueDate = new Date(now + frequencyDays * 24 * 60 * 60 * 1000);

  return {
    id: `task-${plant.id}-${taskType}-${Date.now()}-${Math.random()}`,
    plantId: plant.id,
    title: taskName,
    dueDate: dueDate.toISOString(),
    completed: false,
  };
}

// Extract task type from task title
export function getTaskTypeFromTitle(title: string): string | null {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('water') || lowerTitle.includes('💧')) return 'watering';
  if (lowerTitle.includes('rotate') || lowerTitle.includes('🔄')) return 'rotating';
  if (lowerTitle.includes('fertilize') || lowerTitle.includes('🌱')) return 'fertilizing';
  if (lowerTitle.includes('mist') || lowerTitle.includes('💨')) return 'misting';
  if (lowerTitle.includes('prune') || lowerTitle.includes('✂️')) return 'pruning';
  if (lowerTitle.includes('pest') || lowerTitle.includes('🐛')) return 'pestCheck';
  
  return null;
}
