import React, { useState } from 'react';

export const GenerateAudio: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const playWav = () => {
      const audio = new Audio(`../../backend/question.wav?ts=${Date.now()}`);
      audio.play();
    };
    const handleAudio = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/genq', {
        method: 'POST'
        });

        const data = await res.json();
        console.log('Server response:', data);
        playWav();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    return (
        <button
          onClick={handleAudio}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
        >
          {loading ? "Loading..." : "Generate Question"}
        </button>
    );
}

export default GenerateAudio;
