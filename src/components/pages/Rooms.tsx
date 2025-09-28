import { useState, useEffect } from "react";
import { Users, Clock, Code, MessageSquare, Briefcase, Search, Sparkles, Target, TrendingUp, Timer } from "lucide-react";
import VideoChatRoom from '../shared/VideoChatRoom';
import { FormData } from '../../types';
import ElevatorPitchTimer from '../shared/ElevatorPitchTimer';
import GenerateAudio from "../shared/GenerateAudio";

function Rooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isInVideoChat, setIsInVideoChat] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState("");
  const [userData, setUserData] = useState<FormData | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('chrysallisUserData');
    if (savedUserData) {
      try {
        const parsedData: FormData = JSON.parse(savedUserData);
        setUserData(parsedData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const categories = [
    { id: "all", label: "All Rooms", icon: Sparkles },
    { id: "technical", label: "Technical", icon: Code },
    { id: "behavioral", label: "Behavioral", icon: MessageSquare },
    { id: "career", label: "Career Prep", icon: Briefcase }
  ];

  useEffect(() => {
    if (isInVideoChat) {
      document.body.style.overflow = "hidden";  // disable scroll
    } else {
      document.body.style.overflow = "auto";    // restore scroll
    }
  }, [isInVideoChat]);

  const rooms = [
    {
      id: 1,
      name: "LeetCode Mock Interviews",
      category: "technical",
      description: "Practice coding problems with peers in a supportive environment. Perfect for preparing for technical interviews at top tech companies.",
      participants: 12,
      maxParticipants: 16,
      difficulty: "Intermediate",
      avgSessionTime: "45 min",
      isActive: true,
      lastActivity: "2 min ago",
      skills: ["Data Structures", "Algorithms", "Problem Solving"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      name: "Elevator Pitch Practice",
      category: "career",
      description: "Master the art of introducing yourself professionally. Practice your 30-second pitch with fellow women in tech.",
      participants: 8,
      maxParticipants: 12,
      difficulty: "Beginner",
      avgSessionTime: "20 min",
      isActive: true,
      lastActivity: "5 min ago",
      skills: ["Communication", "Personal Branding", "Networking"],
      color: "from-blue-500 to-purple-500"
    },
    {
      id: 3,
      name: "Behavioral Interview Prep",
      category: "behavioral",
      description: "Practice STAR method responses and common behavioral questions. Build confidence for your next interview.",
      participants: 15,
      maxParticipants: 20,
      difficulty: "Intermediate",
      avgSessionTime: "35 min",
      isActive: true,
      lastActivity: "1 min ago",
      skills: ["STAR Method", "Storytelling", "Leadership"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 4,
      name: "System Design Discussions",
      category: "technical",
      description: "Collaborate on system design problems and learn from each other's approaches. Great for senior-level prep.",
      participants: 6,
      maxParticipants: 10,
      difficulty: "Advanced",
      avgSessionTime: "60 min",
      isActive: false,
      lastActivity: "15 min ago",
      skills: ["System Architecture", "Scalability", "Design Patterns"],
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: 5,
      name: "Salary Negotiation Workshop",
      category: "career",
      description: "Practice negotiating your worth with confidence. Learn strategies and practice scenarios with supportive peers.",
      participants: 10,
      maxParticipants: 14,
      difficulty: "Intermediate",
      avgSessionTime: "40 min",
      isActive: true,
      lastActivity: "8 min ago",
      skills: ["Negotiation", "Market Research", "Confidence Building"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: 6,
      name: "Technical Presentation Skills",
      category: "behavioral",
      description: "Present technical concepts clearly and confidently. Perfect for demos, standups, and technical discussions.",
      participants: 7,
      maxParticipants: 12,
      difficulty: "Beginner",
      avgSessionTime: "30 min",
      isActive: true,
      lastActivity: "3 min ago",
      skills: ["Public Speaking", "Technical Communication", "Confidence"],
      color: "from-violet-500 to-purple-500"
    }
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || room.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (!userData) {
      alert('Please complete your registration first to join practice rooms.');
      return;
    }
    
    setCurrentRoomId(roomId);
    setIsInVideoChat(true);
  };

  const handleLeaveVideoChat = () => {
    setIsInVideoChat(false);
    setCurrentRoomId("");
  };

// Function to check if room is Elevator Pitch Practice
  const isElevatorPitchRoom = (roomName: string) => {
    return roomName === "Elevator Pitch Practice";
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-3">🦋</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Practice Rooms
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
          Connect with fellow women in tech to practice career skills together
        </p>
        <p className="text-sm text-purple-600 font-medium italic">
          "Because every career takes flight from transformation"
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by room name or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${room.color} opacity-10 rounded-bl-full`} />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(room.difficulty)}`}>
                      {room.difficulty}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${room.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-500">
                      {room.isActive ? 'Active now' : 'Waiting'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{room.description}</p>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {room.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{room.participants}/{room.maxParticipants} participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{room.avgSessionTime}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${room.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(room.participants / room.maxParticipants) * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  <span>Last activity: {room.lastActivity}</span>
                </div>
              </div>

              {/* Elevator Pitch Timer Button - Only shows for Elevator Pitch room */}
              {isElevatorPitchRoom(room.name) && (
                <div className="mb-4">
                  <button
                    onClick={() => setIsTimerOpen(true)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Timer className="w-4 h-4" />
                    Open Practice Timer
                  </button>
                </div>
              )}

              {/* Join Button */}
              <button 
                onClick={() => handleJoinRoom(room.id.toString())}
                className={`w-full bg-gradient-to-r ${room.color} text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <Target className="w-4 h-4" />
                {room.isActive ? 'Join Practice Session' : 'Join Waiting Room'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🦋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No practice rooms found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or create a new practice room</p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Create Your First Room
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center border border-purple-100">
        <div className="text-3xl mb-4">🌟</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Transform Your Career?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of women in tech who are building confidence and skills through peer practice. 
          Every session is a step closer to your dream career.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Start Practicing Today
          </button>
          <button className="border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200">
            Learn How It Works
          </button>
        </div>
      </div>

      {/* Timer Modal - Only renders when open */}
      <ElevatorPitchTimer 
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      {/* Video Chat Room */}
      {isInVideoChat && userData && (
        <div className="relative">
          <VideoChatRoom
            roomId={currentRoomId}
            userData={userData}
            onLeave={handleLeaveVideoChat}
          />

          {currentRoomId === "3" && (
            <div className="fixed bottom-[1rem] left-6 z-50">
              <GenerateAudio />
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}

export default Rooms;