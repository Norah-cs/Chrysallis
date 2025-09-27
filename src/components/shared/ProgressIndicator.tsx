import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  foldScore: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps, foldScore }) => {
  const steps = [
    { label: 'Basic Info', icon: '👤' },
    { label: 'Profile', icon: '🎓' },
    { label: 'Goals', icon: '🎯' },
    { label: 'About You', icon: '✍️' },
    { label: 'Connect', icon: '🔗' },
    { label: 'Complete', icon: '🦋' }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              index < foldScore 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : index === foldScore - 1
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white animate-pulse'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.icon}
            </div>
            <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
              index < foldScore ? 'text-purple-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(foldScore / 6) * 100}%` }}
        />
      </div>
    </div>
  );
};