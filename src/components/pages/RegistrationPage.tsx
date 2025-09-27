import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ChevronLeft } from 'lucide-react';
import { FormData } from '../../types';
import { TECH_OPTIONS, PRACTICE_GOALS, YEAR_OPTIONS, BUTTERFLY_THEMES } from '../../constants';
import { ButterflySVG } from '../shared/ButterflySVG';
import { ProgressIndicator } from '../shared/ProgressIndicator';

interface RegistrationPageProps {
  onBack: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    university: '',
    year: '',
    techInterest: '',
    introBlurb: '',
    practiceGoals: [],
    butterflyTheme: 'Sunset',
    socials: {
      linkedin: '',
      instagram: '',
      discord: '',
      twitter: '',
    },
    shareSocialsAfterSession: false,
  });

  const [showButterflyAnimation, setShowButterflyAnimation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((name: keyof FormData, value: any) => {
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const updateSocial = useCallback((key: keyof FormData['socials'], value: string) =>
    setFormData((s) => ({ ...s, socials: { ...s.socials, [key]: value } })), []
  );

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(formData.practiceGoals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData((s) => ({ ...s, practiceGoals: items }));
  }, [formData.practiceGoals]);

  const addPracticeGoal = useCallback((goalId: string) => {
    if (!formData.practiceGoals.includes(goalId)) {
      setFormData((s) => ({ ...s, practiceGoals: [...s.practiceGoals, goalId] }));
    }
  }, [formData.practiceGoals]);

  const removePracticeGoal = useCallback((goalId: string) => {
    setFormData((s) => ({
      ...s,
      practiceGoals: s.practiceGoals.filter(id => id !== goalId)
    }));
  }, []);

  const foldScore = useMemo(() => {
    let score = 1;
    if (formData.name && formData.email) score += 1;
    if (formData.techInterest && formData.year) score += 1;
    if (formData.practiceGoals.length >= 2) score += 1;
    if (formData.introBlurb.trim().length > 30) score += 1;
    const socialsProvided = Object.values(formData.socials).filter(Boolean).length;
    if (socialsProvided > 0) score += 1;
    return Math.min(6, score);
  }, [formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.trim().length < 8) {
      newErrors.password = 'Password must have at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must include a captial letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must include a number';
    }
    if (formData.introBlurb.trim().length < 30) {
      newErrors.introBlurb = 'Please write at least 30 characters about yourself';
    }
    if (formData.practiceGoals.length < 1) {
      newErrors.practiceGoals = 'Please select at least one practice goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setShowButterflyAnimation(true);
    console.log('Chrysallis Registration:', formData);
    

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // send your formData as JSON
      });

      const data = await res.json();
      console.log('Server response:', data);

        if (res.ok) {
          alert('Registration successful! Welcome to Chrysallis 🦋');
          setSubmitted(true);
          // Navigate to profile page after successful registration
          setTimeout(() => {
            navigate('/profile');
          }, 1500); // Small delay to show the success message
        } else {
          alert('Error: ' + data.message);
        }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Network error');
    }
  };

  useEffect(() => {
    if (showButterflyAnimation) {
      const timer = setTimeout(() => {
        setShowButterflyAnimation(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [showButterflyAnimation]);

  const currentThemeColors = useMemo(() => {
    return BUTTERFLY_THEMES.find(theme => theme.name === formData.butterflyTheme)?.colors || BUTTERFLY_THEMES[0].colors;
  }, [formData.butterflyTheme]);

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      linkedin: '💼',
      instagram: '📸',
      discord: '🎮',
      twitter: '🐦'
    };
    return icons[platform] || '🔗';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 p-6 overflow-hidden">
      <style>{`
        @keyframes flutter {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          30% { transform: translateY(-12px) rotate(8deg) scale(1.02); opacity: 0.95; }
          60% { transform: translateY(-28px) rotate(-8deg) scale(0.98); opacity: 0.8; }
          100% { transform: translateY(-60px) rotate(-4deg) scale(0.9); opacity: 0; }
        }
        .animate-flutter { animation: flutter 1.6s cubic-bezier(.22,.9,.32,1) forwards; }
        .goal-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 8px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }
        .goal-item:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }
        .error-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      {/* Butterfly SVG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
        <ButterflySVG fold={foldScore} themeColors={currentThemeColors} showAnimation={showButterflyAnimation} />
      </div>

      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-2xl transform transition-all duration-500 ease-in-out hover:shadow-3xl border border-white/20">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Home
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Chrysallis Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Transform your tech journey with us
          </p>
        </div>

        <ProgressIndicator currentStep={foldScore} totalSteps={6} foldScore={foldScore} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              className={`w-full rounded-xl border-2 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 p-3 ${
                errors.name ? 'border-red-500 error-shake' : 'border-gray-300'
              }`}
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                className={`w-full rounded-xl border-2 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 p-3 ${
                  errors.email ? 'border-red-500 error-shake' : 'border-gray-300'
                }`}
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="your.email@university.edu"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="text"
                id="password"
                className={`w-full rounded-xl border-2 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 p-3 ${
                  errors.password ? 'border-red-500 error-shake' : 'border-gray-300'
                }`}
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* University and Year */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="university" className="block text-sm font-semibold text-gray-700 mb-2">
                University
              </label>
              <input
                type="text"
                id="university"
                className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 p-3"
                value={formData.university}
                onChange={(e) => updateField('university', e.target.value)}
                placeholder="Your university name"
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                Year of Study
              </label>
              <select
                id="year"
                className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 p-3"
                value={formData.year}
                onChange={(e) => updateField('year', Number(e.target.value))}
              >
                <option value="">Select your year</option>
                {YEAR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech Interest */}
          <div>
            <label htmlFor="techInterest" className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Tech Interest
            </label>
            <select
              id="techInterest"
              className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 p-3"
              value={formData.techInterest}
              onChange={(e) => updateField('techInterest', e.target.value)}
            >
              <option value="">Select a field</option>
              {TECH_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Practice Goals */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What do you want to practice? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {PRACTICE_GOALS.map(goal => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => addPracticeGoal(goal.id)}
                  className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ease-in-out font-medium
                    ${formData.practiceGoals.includes(goal.id)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg transform scale-105'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md'
                    }`}
                >
                  <span className="text-xl mr-3">{goal.emoji}</span> 
                  {goal.label}
                </button>
              ))}
            </div>
            {errors.practiceGoals && <p className="text-red-500 text-sm mb-2">{errors.practiceGoals}</p>}

            {formData.practiceGoals.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Your selected goals (drag to reorder by priority):
                </h4>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="practiceGoals">
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {formData.practiceGoals.map((goalId, index) => {
                          const goal = PRACTICE_GOALS.find(g => g.id === goalId);
                          if (!goal) return null;
                          
                          return (
                            <Draggable key={goalId} draggableId={goalId} index={index}>
                              {(provided, snapshot) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`goal-item ${snapshot.isDragging ? 'shadow-2xl scale-105' : ''}`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    background: snapshot.isDragging ? 'linear-gradient(45deg, #f3e8ff, #fce7f3)' : 'white'
                                  }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                      <span className="text-gray-400 text-sm mr-3">#{index + 1}</span>
                                      <span className="text-lg mr-3">{goal.emoji}</span>
                                      <span className="font-medium">{goal.label}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removePracticeGoal(goal.id)}
                                      className="text-red-400 hover:text-red-600 ml-4 p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                                      aria-label={`Remove ${goal.label}`}
                                    >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                </li>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>

          {/* Intro Blurb */}
          <div>
            <label htmlFor="introBlurb" className="block text-sm font-semibold text-gray-700 mb-2">
              Tell us about yourself and your goals *
            </label>
            <textarea
              id="introBlurb"
              rows={4}
              className={`w-full rounded-xl border-2 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 p-3 resize-none ${
                errors.introBlurb ? 'border-red-500 error-shake' : 'border-gray-300'
              }`}
              value={formData.introBlurb}
              onChange={(e) => updateField('introBlurb', e.target.value)}
              placeholder="Share your background, interests, and what you hope to achieve through Chrysallis. This helps us match you with the right peers and mentors."
            />
            <div className="flex justify-between items-center mt-2">
              <p className={`text-sm ${formData.introBlurb.length >= 30 ? 'text-green-600' : 'text-gray-500'}`}>
                {formData.introBlurb.length}/30 characters minimum
              </p>
              {errors.introBlurb && <p className="text-red-500 text-sm">{errors.introBlurb}</p>}
            </div>
          </div>

          {/* Butterfly Theme Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose your Butterfly Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BUTTERFLY_THEMES.map(theme => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => updateField('butterflyTheme', theme.name)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden group
                    ${formData.butterflyTheme === theme.name 
                      ? 'border-purple-500 shadow-lg transform scale-105' 
                      : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                    }`}
                  style={{ backgroundColor: theme.colors[0] }}
                >
                  <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors[1]}, ${theme.colors[3]})`
                    }}
                  />
                  <span className="relative text-sm font-semibold text-gray-800 drop-shadow-sm">
                    {theme.name}
                  </span>
                  {formData.butterflyTheme === theme.name && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Socials */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-gray-700 mb-3">
              Social Connections (Optional)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(formData.socials).map(key => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                    {getSocialIcon(key)} {key}
                  </label>
                  <input
                    type="text"
                    id={key}
                    className="w-full rounded-xl border-2 border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 p-3"
                    placeholder={`Your ${key} handle`}
                    value={formData.socials[key as keyof FormData['socials']]}
                    onChange={(e) => updateSocial(key as keyof FormData['socials'], e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <input
                id="shareSocialsAfterSession"
                name="shareSocialsAfterSession"
                type="checkbox"
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={formData.shareSocialsAfterSession}
                onChange={(e) => updateField('shareSocialsAfterSession', e.target.checked)}
              />
              <div className="text-sm">
                <label htmlFor="shareSocialsAfterSession" className="font-medium text-gray-700 cursor-pointer">
                  Share my social profiles with matched peers after successful sessions
                </label>
                <p className="text-gray-600 mt-1">
                  Only shared when both participants agree to connect post-session
                </p>
              </div>
            </div>
          </fieldset>

          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.values(errors).map((err, idx) => (
                <p key={idx} className="text-red-600 text-sm font-medium">
                  {err}
                </p>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitted}
              className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 transform
                ${submitted 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                }
              `}
            >
              {submitted ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Begin Your Chrysallis Journey 🦋'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};