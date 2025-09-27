import React, { useState } from 'react';
import { Router as Butterfly, Users, BookOpen, Briefcase, Coffee, ArrowRight, CheckCircle } from 'lucide-react';
import ChrysalisRegistrationForm from './components/ChrysalisRegistrationForm';

interface QuizAnswer {
  question: string;
  answer: string;
}

interface User {
  name: string;
  university: string;
  major: string;
  year: string;
  interests: string[];
  quizAnswers: QuizAnswer[];
}

type Screen = 'welcome' | 'onboarding' | 'rooms' | 'chat';
type Room = 'study' | 'career' | 'social';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);

  // Show registration form if requested
  if (showRegistration) {
    return <ChrysalisRegistrationForm />;
  }

  const quizQuestions = [
    {
      question: "What's your primary goal for connecting with other women in tech?",
      options: [
        "Finding study partners and academic support",
        "Career advice and professional networking", 
        "Making friends and socializing"
      ]
    },
    {
      question: "What year are you in your program?",
      options: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"]
    },
    {
      question: "Which tech area interests you most?",
      options: [
        "Software Engineering & Development",
        "Data Science & AI/ML",
        "Cybersecurity",
        "Product Management",
        "UX/UI Design",
        "Other/Exploring"
      ]
    },
    {
      question: "How do you prefer to communicate?",
      options: [
        "Video calls for face-to-face connection",
        "Voice calls for focused discussion",
        "Text chat for flexible conversation"
      ]
    }
  ];

  const handleQuizAnswer = (answer: string) => {
    const newAnswer = {
      question: quizQuestions[quizStep].question,
      answer
    };
    
    const updatedAnswers = [...quizAnswers, newAnswer];
    setQuizAnswers(updatedAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Complete onboarding
      setCurrentScreen('rooms');
    }
  };

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <div className="mb-8 relative">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-200 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-pink-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
          <Butterfly className="w-24 h-24 mx-auto text-purple-600 mb-6" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Chrysalis
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Connect, grow, and transform with fellow women in tech.
          <br />
          <span className="text-lg text-gray-500">Your safe space for authentic conversations and meaningful connections.</span>
        </p>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto text-purple-500 mb-3" strokeWidth={1.5} />
              <h3 className="font-semibold text-gray-800 mb-2">Study Together</h3>
              <p className="text-sm text-gray-600">Find study partners and academic support</p>
            </div>
            <div className="text-center">
              <Briefcase className="w-12 h-12 mx-auto text-pink-500 mb-3" strokeWidth={1.5} />
              <h3 className="font-semibold text-gray-800 mb-2">Career Connect</h3>
              <p className="text-sm text-gray-600">Get mentorship and professional guidance</p>
            </div>
            <div className="text-center">
              <Coffee className="w-12 h-12 mx-auto text-cyan-500 mb-3" strokeWidth={1.5} />
              <h3 className="font-semibold text-gray-800 mb-2">Social Space</h3>
              <p className="text-sm text-gray-600">Make friends and enjoy casual conversations</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentScreen('onboarding')}
          className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto"
        >
          Start Your Journey
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => setShowRegistration(true)}
            className="text-purple-600 hover:text-purple-800 font-medium underline transition-colors"
          >
            Or try our enhanced registration form
          </button>
        </div>
      </div>
    </div>
  );

  const OnboardingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Butterfly className="w-8 h-8 text-purple-600" strokeWidth={1.5} />
              <span className="text-sm text-gray-500">
                Step {quizStep + 1} of {quizQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {quizQuestions[quizStep].question}
          </h2>

          <div className="space-y-4">
            {quizQuestions[quizStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuizAnswer(option)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
              >
                <span className="text-gray-700 group-hover:text-purple-700 font-medium">
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const RoomsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Butterfly className="w-12 h-12 text-purple-600 mr-3" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold text-gray-800">Choose Your Space</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Select a room that matches your current needs and interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Study Sessions Room */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
               onClick={() => {setCurrentRoom('study'); setCurrentScreen('chat');}}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <BookOpen className="w-8 h-8 text-purple-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Study Sessions</h3>
              <p className="text-gray-600">Connect with study partners and get academic support</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-purple-500" />
                <span>12 active members</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Video & Voice Chat</span>
              </div>
            </div>
          </div>

          {/* Career Connect Room */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
               onClick={() => {setCurrentRoom('career'); setCurrentScreen('chat');}}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                <Briefcase className="w-8 h-8 text-pink-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Career Connect</h3>
              <p className="text-gray-600">Get mentorship and professional networking opportunities</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-pink-500" />
                <span>8 active members</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Video & Voice Chat</span>
              </div>
            </div>
          </div>

          {/* Social Space Room */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
               onClick={() => {setCurrentRoom('social'); setCurrentScreen('chat');}}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-200 transition-colors">
                <Coffee className="w-8 h-8 text-cyan-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Social Space</h3>
              <p className="text-gray-600">Make friends and enjoy casual conversations</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-cyan-500" />
                <span>15 active members</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Video & Voice Chat</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => setCurrentScreen('welcome')}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            ← Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );

  const ChatScreen = () => {
    const getRoomInfo = () => {
      switch (currentRoom) {
        case 'study':
          return { 
            name: 'Study Sessions', 
            icon: BookOpen, 
            color: 'purple',
            description: 'Connect with study partners'
          };
        case 'career':
          return { 
            name: 'Career Connect', 
            icon: Briefcase, 
            color: 'pink',
            description: 'Professional networking & mentorship'
          };
        case 'social':
          return { 
            name: 'Social Space', 
            icon: Coffee, 
            color: 'cyan',
            description: 'Casual conversations & friendships'
          };
        default:
          return { name: 'Room', icon: Users, color: 'gray', description: '' };
      }
    };

    const roomInfo = getRoomInfo();
    const IconComponent = roomInfo.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Butterfly className="w-8 h-8 text-purple-600 mr-3" strokeWidth={1.5} />
              <div>
                <h1 className="text-xl font-bold text-gray-800 flex items-center">
                  <IconComponent className={`w-5 h-5 text-${roomInfo.color}-600 mr-2`} strokeWidth={1.5} />
                  {roomInfo.name}
                </h1>
                <p className="text-sm text-gray-600">{roomInfo.description}</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentScreen('rooms')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Back to Rooms
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-100px)]">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 h-full flex flex-col">
            {/* Chat Messages Area */}
            <div className="flex-1 p-6">
              <div className="text-center py-12">
                <IconComponent className={`w-16 h-16 text-${roomInfo.color}-400 mx-auto mb-4`} strokeWidth={1} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Welcome to {roomInfo.name}</h3>
                <p className="text-gray-500">Start a conversation or wait to be matched with someone new</p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-white/20 p-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <button className={`px-6 py-3 bg-gradient-to-r from-${roomInfo.color}-600 to-${roomInfo.color === 'purple' ? 'pink' : roomInfo.color}-600 text-white rounded-xl font-medium hover:shadow-lg transition-all`}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render current screen
  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'rooms':
      return <RoomsScreen />;
    case 'chat':
      return <ChatScreen />;
    default:
      return <WelcomeScreen />;
  }
}

export default App;