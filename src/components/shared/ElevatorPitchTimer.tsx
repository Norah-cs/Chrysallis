import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, X } from 'lucide-react';

interface ElevatorPitchTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ElevatorPitchTimer: React.FC<ElevatorPitchTimerProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds default
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Optional: Play a sound or show notification when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const handleTimeChange = (newTime: number) => {
    setInitialTime(newTime);
    setTimeLeft(newTime);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-gray-900">Pitch Timer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Time Presets */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose your pitch duration:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[30, 60, 90].map(duration => (
              <button
                key={duration}
                onClick={() => handleTimeChange(duration)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  initialTime === duration
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                }`}
              >
                {duration}s
              </button>
            ))}
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold ${getTimerColor()} mb-4`}>
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ${
                  timeLeft / initialTime > 0.5 ? 'text-green-500' : 
                  timeLeft / initialTime > 0.2 ? 'text-yellow-500' : 'text-red-500'
                }`}
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${100 - getProgressPercentage()}, 100`}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full ${
                isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
            </div>
          </div>

          {timeLeft === 0 && (
            <div className="text-red-600 font-semibold animate-bounce">
              Time's up! 🎉
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={isRunning ? handlePause : handleStart}
            disabled={timeLeft === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              timeLeft === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isRunning
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-purple-50 rounded-xl">
          <h4 className="font-semibold text-purple-900 mb-2">💡 Elevator Pitch Tips:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Keep it concise and engaging</li>
            <li>• Mention your name, role, and key achievement</li>
            <li>• End with a clear call to action</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ElevatorPitchTimer;