import React from 'react';
import { Sparkles, Users, Target, Award, ChevronRight } from 'lucide-react';
import LogoLoop from "../LogoLoop/LogoLoop";
import TiltedCard from "../Logo/Logo";
import { StoreImages } from "../LogoLoop/StoreImages";
import { useNavigate } from 'react-router-dom';
import CountUp from "../UIComponents/CountUp";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Peer Practice Sessions",
      description: "Connect with fellow students for mock interviews and coding challenges",
      tags: ["Collaboration", "Mock Interviews", "Networking"]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Goals",
      description: "Set and track your progress towards specific career objectives",
      tags: ["Goal Setting", "Progress Tracking", "Career Growth"]
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expert Feedback",
      description: "Get constructive feedback from experienced mentors and peers",
      tags: ["Mentorship", "Feedback", "Improvement"]
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Skill Development", 
      description: "Build confidence and improve your technical communication skills",
      tags: ["Communication", "Technical Skills", "Confidence"]
    }
  ];

  const stats = [
    { number: "1000+", label: "Students Transformed" },
    { number: "500+", label: "Universities Reached" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-primary via-support2 to-support1 pt-16 pb-24 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Butterfly Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8">
            <TiltedCard
              imageSrc="/assets/chrysallis-logo.png"
              altText="Butterfly"
              containerHeight="80px"
              containerWidth="80px"
              imageHeight="85px"
              imageWidth="85px"
              scaleOnHover={1.2} 
              rotateAmplitude={25}
              showMobileWarning={false}
              showTooltip={false}
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
            Welcome to Chrysallis
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 font-light">
            Every butterfly starts as a chrysalis — start your journey here.
          </p>
          
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
          >
            Begin Your Transformation
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Logo Loop Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <LogoLoop logos={StoreImages} ariaLabel="Origami designs" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
              How Chrysallis Helps You Grow
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with fellow women in tech to practice career skills together
            </p>
            <p className="text-primary font-medium mt-2 italic">
              "Because every career takes flight from transformation"
            </p>
          </div>

      {/* Stats Section */}
      <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              <CountUp
                from={0}
                to={367}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              <span>+</span>
            </div>
            <div className="text-gray-600 font-medium">Students Transformed</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              <CountUp
                from={0}
                to={22}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              <span>+</span>
            </div>
            <div className="text-gray-600 font-medium">Universities Reached</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              <CountUp
                from={0}
                to={95}
                separator="%"
                direction="up"
                duration={1}
                className="count-up-text"
              />
              <span>%</span>
            </div>
            <div className="text-gray-600 font-medium">Success Rate</div>
          </div>
        </div>
      </section>
      
        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            The wings of your future are built in practice.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {feature.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 mb-20 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-5xl font-bold">
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inspirational Quote Section */}
        <div className="text-center mb-20">
          <div className="bg-gray-50 rounded-2xl p-12 border border-gray-100">
            <div className="max-w-3xl mx-auto">
              <div className="text-6xl text-primary/20 font-serif mb-4">"</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">
                The wings of your future are built in practice
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every successful career in tech starts with preparation, practice, and connection. 
                Join our community of ambitious women and transform your potential into achievement.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
            Ready to Spread Your Wings?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of students who have transformed their careers with Chrysalis. 
            Your journey from student to professional starts here.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
          >
            Start Your Transformation
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;