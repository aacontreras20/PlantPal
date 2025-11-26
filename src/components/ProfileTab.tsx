import { Bell, Info, Settings, ChevronRight, Leaf, MapPin, Edit2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Plant, Spot } from '../App';

type ProfileTabProps = {
  plants: Plant[];
  spots: Spot[];
};

export function ProfileTab({ plants, spots }: ProfileTabProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState('Plant Parent');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState('planty@example.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState(true);

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="mb-1">Profile</h1>
        <p className="text-neutral-600">Settings and information</p>
      </div>

      {/* Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <p className="text-sm text-neutral-600">My Plants</p>
            </div>
            <p className="text-2xl text-green-900">{plants.length}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-neutral-600">My Spots</p>
            </div>
            <p className="text-2xl text-amber-900">{spots.length}</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="px-6 pb-6 space-y-6">
        {/* User Info */}
        <div>
          <h2 className="mb-3">User Info</h2>
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-green-600" />
              </div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>

            {/* Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">Name</p>
                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>
              {isEditingName ? (
                <div className="space-y-2">
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditingName(false)}
                      size="sm"
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditingName(false)}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm bg-neutral-50 rounded-lg px-3 py-2 border border-neutral-200">
                  {userName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600">Email</p>
                {!isEditingEmail && (
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>
              {isEditingEmail ? (
                <div className="space-y-2">
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditingEmail(false)}
                      size="sm"
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditingEmail(false)}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm bg-neutral-50 rounded-lg px-3 py-2 border border-neutral-200">
                  {userEmail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="mb-3">Notifications</h2>
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-neutral-600" />
                <div className="text-left">
                  <p className="text-sm">Water reminders</p>
                  <p className="text-xs text-neutral-500">Get notified when plants need water</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </button>
            <div className="border-t border-neutral-200">
              <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-neutral-600" />
                  <div className="text-left">
                    <p className="text-sm">Weekly check-ins</p>
                    <p className="text-xs text-neutral-500">Review plant health weekly</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div>
          <h2 className="mb-3">App Settings</h2>
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-neutral-600" />
                <p className="text-sm">General settings</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* About */}
        <div>
          <h2 className="mb-3">About</h2>
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-neutral-600" />
                <p className="text-sm">About the app</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </button>
            <div className="border-t border-neutral-200">
              <div className="p-4">
                <p className="text-xs text-neutral-500">Version 1.0.0 (v0)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Collection */}
        <div>
          <h2 className="mb-3">Your Collection</h2>
          <div className="bg-white border border-neutral-200 rounded-2xl p-5">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-600 mb-2">Plants</p>
                {plants.length === 0 ? (
                  <p className="text-sm text-neutral-500">No plants yet</p>
                ) : (
                  <div className="space-y-2">
                    {plants.slice(0, 3).map((plant) => (
                      <div key={plant.id} className="flex items-center gap-2">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <p className="text-sm">{plant.name}</p>
                      </div>
                    ))}
                    {plants.length > 3 && (
                      <p className="text-xs text-neutral-500">+{plants.length - 3} more</p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-2">Spots</p>
                {spots.length === 0 ? (
                  <p className="text-sm text-neutral-500">No spots yet</p>
                ) : (
                  <div className="space-y-2">
                    {spots.slice(0, 3).map((spot) => (
                      <div key={spot.id} className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        <p className="text-sm">{spot.name}</p>
                      </div>
                    ))}
                    {spots.length > 3 && (
                      <p className="text-xs text-neutral-500">+{spots.length - 3} more</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}