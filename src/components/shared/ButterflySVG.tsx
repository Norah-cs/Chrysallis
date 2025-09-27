import React from 'react';

interface ButterflySVGProps {
  fold: number;
  themeColors: string[];
  showAnimation: boolean;
}

export const ButterflySVG: React.FC<ButterflySVGProps> = ({ fold, themeColors, showAnimation }) => {
  const wingPath1 = "M0 50 C 20 20, 40 0, 70 10 S 90 40, 70 70 S 40 100, 20 80 S 0 50, 0 50Z";
  const wingPath2 = "M100 50 C 80 20, 60 0, 30 10 S 10 40, 30 70 S 60 100, 80 80 S 100 50, 100 50Z";

  const getTransform = (currentFold: number) => {
    switch (currentFold) {
      case 1: return { scale: 0.1, rotateY: 0, opacity: 0 };
      case 2: return { scale: 0.3, rotateY: 0, opacity: 0.3 };
      case 3: return { scale: 0.5, rotateY: 0, opacity: 0.6 };
      case 4: return { scale: 0.7, rotateY: 0, opacity: 0.8 };
      case 5: return { scale: 0.9, rotateY: 0, opacity: 0.95 };
      case 6: return { scale: 1, rotateY: 0, opacity: 1 };
      default: return { scale: 0, rotateY: 0, opacity: 0 };
    }
  };

  const { scale, rotateY, opacity } = getTransform(fold);
  const animationClass = showAnimation && fold === 6 ? 'animate-flutter' : '';

  return (
    <svg
      width="150"
      height="150"
      viewBox="0 0 100 100"
      className={`absolute transition-all duration-700 ease-in-out ${animationClass}`}
      style={{
        transform: `scale(${scale}) rotateY(${rotateY}deg)`,
        opacity: opacity,
        filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.2))`
      }}
    >
      {/* Body */}
      <ellipse cx="50" cy="50" rx="8" ry="30" fill={themeColors[5]} />

      {/* Wings - layered for depth */}
      <g className="transition-all duration-700 ease-in-out transform origin-center"
         style={{ transform: `scale(${fold >= 2 ? 1 : 0})` }}>
        {/* Back wings */}
        <path d={wingPath1} fill={themeColors[0]} transform="translate(-10, 0) scale(0.9) rotate(-10 50 50)" className="opacity-70" />
        <path d={wingPath2} fill={themeColors[0]} transform="translate(10, 0) scale(0.9) rotate(10 50 50)" className="opacity-70" />

        {/* Front wings */}
        <path d={wingPath1} fill={themeColors[1]} />
        <path d={wingPath2} fill={themeColors[1]} />

        {/* Inner wing details */}
        <path d={wingPath1} fill={themeColors[2]} transform="scale(0.8) translate(10, 10)" className="origin-center" />
        <path d={wingPath2} fill={themeColors[2]} transform="scale(0.8) translate(-10, 10)" className="origin-center" />
      </g>
    </svg>
  );
};