import { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';

type OnboardingGuideProps = {
  onComplete: () => void;
};

type GuideStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const guideSteps: GuideStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PlantPal! 🌿',
    description: 'Your personal plant care assistant. Let me show you around in just 3 simple steps.',
    icon: '👋',
  },
  {
    id: 'spots',
    title: 'Create Spots',
    description: 'Spots are environments where your plants live. They help us determine the perfect care schedule based on light conditions.',
    icon: '📍',
  },
  {
    id: 'plants',
    title: 'Add Your Plants',
    description: 'Take a photo or search to add plants to your spots. We\'ll auto-generate care tasks based on their environment!',
    icon: '🪴',
  },
  {
    id: 'tasks',
    title: 'Complete Care Tasks',
    description: 'Check off daily and weekly tasks to keep your plants thriving. You\'ll earn celebrations for every completed task!',
    icon: '✅',
  },
];

export function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = guideSteps[currentStep];

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 mb-6 bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Progress Bar */}
        <div className="flex gap-1.5 p-4 bg-gradient-to-r from-emerald-50 to-green-50">
          {guideSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-emerald-600 shadow-lg shadow-emerald-200' : 'bg-emerald-100'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">{step.icon}</span>
          </div>

          <h2 className="text-emerald-900 mb-4">{step.title}</h2>
          <p className="text-neutral-600 leading-relaxed">
            {step.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={handleNext}
              className="w-full bg-emerald-800 hover:bg-emerald-900"
              size="lg"
            >
              {currentStep === guideSteps.length - 1 ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {currentStep < guideSteps.length - 1 && (
              <button
                onClick={handleSkip}
                className="w-full py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Skip guide
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}