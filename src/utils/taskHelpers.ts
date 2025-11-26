import { Droplets, RotateCw, Sprout, Sun, Scissors, Bug, Thermometer, Wind } from 'lucide-react';

export type TaskType = 'water' | 'rotate' | 'fertilize' | 'mist' | 'prune' | 'check-pests' | 'check-light' | 'general';

export const getTaskIcon = (title: string): any => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('water')) return Droplets;
  if (lowerTitle.includes('rotate')) return RotateCw;
  if (lowerTitle.includes('fertilize') || lowerTitle.includes('feed')) return Sprout;
  if (lowerTitle.includes('mist') || lowerTitle.includes('humidity')) return Wind;
  if (lowerTitle.includes('prune') || lowerTitle.includes('trim')) return Scissors;
  if (lowerTitle.includes('pest') || lowerTitle.includes('bug')) return Bug;
  if (lowerTitle.includes('light') || lowerTitle.includes('sun')) return Sun;
  if (lowerTitle.includes('temperature') || lowerTitle.includes('temp')) return Thermometer;
  
  return Droplets; // default icon
};

export const getTaskColor = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('water')) return 'text-blue-600';
  if (lowerTitle.includes('rotate')) return 'text-purple-600';
  if (lowerTitle.includes('fertilize')) return 'text-emerald-600';
  if (lowerTitle.includes('mist')) return 'text-cyan-600';
  if (lowerTitle.includes('prune')) return 'text-orange-600';
  if (lowerTitle.includes('pest')) return 'text-red-600';
  if (lowerTitle.includes('light')) return 'text-amber-600';
  
  return 'text-emerald-600'; // default color
};

export const getTaskBgColor = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('water')) return 'bg-blue-100';
  if (lowerTitle.includes('rotate')) return 'bg-purple-100';
  if (lowerTitle.includes('fertilize')) return 'bg-emerald-100';
  if (lowerTitle.includes('mist')) return 'bg-cyan-100';
  if (lowerTitle.includes('prune')) return 'bg-orange-100';
  if (lowerTitle.includes('pest')) return 'bg-red-100';
  if (lowerTitle.includes('light')) return 'bg-amber-100';
  
  return 'bg-emerald-100'; // default bg
};