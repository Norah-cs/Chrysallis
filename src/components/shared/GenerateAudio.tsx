import React, { useState } from 'react';

export const GenerateAudio: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const playWav = () => {
        const audio = new Audio("../../backend/question.wav"); // place file in public/audio/
        audio.play();
    };
    const handleAudio = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/genq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        console.log('Server response:', data);
        playWav();
        setLoading(false);
    };

    return (
        <button
          onClick={handleAudio}
          disabled={loading}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
        >
          {loading ? "Loading..." : "Generate Audio"}
        </button>
    );
}

export default GenerateAudio;
