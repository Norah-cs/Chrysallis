import React from 'react';
import { Sparkles, Users, Target, Award, ChevronRight, Store } from 'lucide-react';
// Update the import path to match the actual location and filename of LogoLoop
import LogoLoop from "../LogoLoop/LogoLoop";
import TiltedCard from "../Logo/Logo";
import { StoreImages } from "../LogoLoop/StoreImages";
import { useNavigate } from 'react-router-dom';
import CountUp from "../UIComponents/CountUp";
import CircularGallery from "../CircularGallery/CircularGallery";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Peer Practice Sessions",
      description: "Connect with fellow students for mock interviews and coding challenges"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Goals",
      description: "Set and track your progress towards specific career objectives"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expert Feedback",
      description: "Get constructive feedback from experienced mentors and peers"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Skill Development",
      description: "Build confidence and improve your technical communication skills"
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-visible">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-250 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

    <div className="relative z-10 w-full px-6 py-12">
      {/* Header */}
      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-32 h-32 mb-8">
            <TiltedCard
                imageSrc="/assets/chrysallis-logo.png"
                altText="Butterfly"
                containerHeight="128px"
                containerWidth="128px"
                imageHeight="135px"
                imageWidth="135px"
                scaleOnHover={1.55} 
                rotateAmplitude={35}
                showMobileWarning={false}
                showTooltip={false}
            />
        </div>

        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary via-support1 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
          Welcome to Chrysallis
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Every butterfly starts as a chrysalis — start your journey here.  
        </p>
        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-support1 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
        >
          Begin Your Transformation
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </header>

      {/* Logo Loop Section */}
        <div className="my-16">
            <LogoLoop logos={StoreImages} ariaLabel="Origami designs" />
        </div>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How Chrysallis Helps You Grow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-support1 rounded-full mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-support1 bg-clip-text text-transparent mb-2">
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
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-support1 bg-clip-text text-transparent mb-2">
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
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-support1 bg-clip-text text-transparent mb-1">
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
      
      {/* Circular Gallery Section 
      <div style={{ height: '650px', position: 'relative', paddingTop: '1rem'}}>
        <CircularGallery bend={0} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
        <canvas width="1376" height="700" ></canvas>
      </div>*/}
      <div style={{ position: 'relative', height: '600px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <CircularGallery
            bend={0}
            textColor="#fdffe7ff"
            borderRadius={0.05}
            scrollEase={0.02}
          />
        </div>
      </div>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-support1 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Spread Your Wings?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with Chrysalis. 
              Your journey from student to professional starts here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;