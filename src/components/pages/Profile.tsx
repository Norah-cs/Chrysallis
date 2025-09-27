import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Camera, CreditCard as Edit3, Save, X } from "lucide-react";
import { FormData } from "../../types";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: profileData.name,
    email: "alex.johnson@student.edu",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "September 2023",
    bio: "Computer Science student passionate about machine learning and web development. Always eager to learn new technologies and collaborate on exciting projects.",
    university: "Stanford University",
    major: "Computer Science",
    year: "Junior"
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('chrysallisUserData');
    if (savedUserData) {
      try {
        const userData: FormData = JSON.parse(savedUserData);
        // Map registration data to profile data
        setProfileData({
          name: userData.name || "Jane Doe",
          email: userData.email || "jane.doe@student.edu",
          phone: "+x (xxx) xxx-xxxx", // Not in registration form, keep default
          location: "City, Country", // Not in registration form, keep default
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          bio: userData.introBlurb || "Computer Science student passionate about machine learning and web development. Always eager to learn new technologies and collaborate on exciting projects.",
          university: userData.university || "University Name",
          major: userData.techInterest || "Tech Interest",
          year: userData.year ? `Year ${userData.year}` : "Year of Study"
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const [editData, setEditData] = useState(profileData);

  // Update editData when profileData changes
  useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const stats = [
    { label: "Study Hours", value: "247", icon: BookOpen },
    { label: "Rooms Joined", value: "12", icon: User },
    { label: "Achievements", value: "8", icon: Award },
    { label: "Study Streak", value: "15 days", icon: Calendar }
  ];

  const achievements = [
    { title: "Early Bird", description: "Completed 10 morning study sessions", color: "bg-yellow-100 text-yellow-800" },
    { title: "Team Player", description: "Participated in 5 group study sessions", color: "bg-blue-100 text-blue-800" },
    { title: "Consistent Learner", description: "Maintained a 7-day study streak", color: "bg-green-100 text-green-800" },
    { title: "Knowledge Sharer", description: "Helped 20+ students in study rooms", color: "bg-purple-100 text-purple-800" }
  ];

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
        <p className="text-lg text-gray-600">
          Manage your account information and track your learning progress
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.major} • {profileData.year}</p>
              <p className="text-sm text-gray-500">{profileData.university}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5" />
                <span className="text-sm">{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{profileData.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Joined {profileData.joinDate}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
                  <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
            <p className="text-gray-600 leading-relaxed">{profileData.bio}</p>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${achievement.color}`}>
                      Earned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;