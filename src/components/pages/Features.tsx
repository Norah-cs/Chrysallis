import { 
  BookOpen, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Zap,
  CheckCircle
} from "lucide-react";

function Features() {
  const mainFeatures = [
    {
      icon: BookOpen,
      title: "Interactive Study Materials",
      description: "Access comprehensive study guides, practice tests, and interactive content tailored to your learning style.",
      benefits: ["Personalized content", "Progress tracking", "Offline access"]
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with study groups, participate in discussions, and learn from peers around the world.",
      benefits: ["Global community", "Peer mentoring", "Group projects"]
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered scheduling that adapts to your routine and optimizes your study sessions for maximum efficiency.",
      benefits: ["Automatic planning", "Deadline reminders", "Time optimization"]
    },
    {
      icon: MessageSquare,
      title: "Real-time Communication",
      description: "Instant messaging, video calls, and collaborative whiteboards for seamless group study sessions.",
      benefits: ["Video conferencing", "Screen sharing", "Digital whiteboard"]
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Detailed insights into your learning progress with visual charts and personalized recommendations.",
      benefits: ["Performance metrics", "Learning insights", "Goal tracking"]
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls you can trust.",
      benefits: ["End-to-end encryption", "Privacy controls", "Secure storage"]
    }
  ];

  const additionalFeatures = [
    { icon: Smartphone, title: "Mobile App", description: "Study anywhere with our native mobile applications" },
    { icon: Zap, title: "Lightning Fast", description: "Optimized performance for smooth, responsive experience" },
    { icon: CheckCircle, title: "Easy to Use", description: "Intuitive interface designed for students by students" }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover all the tools and features that make Chrysalis the perfect platform for your educational journey
        </p>
      </div>

      {/* Main Features Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-200">
                  <IconComponent className="w-7 h-7 text-blue-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional Features */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">And Much More</h2>
          <p className="text-lg text-gray-600">
            Additional features that enhance your learning experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm mb-4 mx-auto">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of students who are already benefiting from our comprehensive platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Start Free Trial
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
            View Pricing
          </button>
        </div>
      </section>
    </div>
  );
}

export default Features;