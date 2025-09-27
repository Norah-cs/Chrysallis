import { motion } from "framer-motion";

export default function OrigamiButterfly() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-pink-50 to-purple-100">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <defs>
          <linearGradient id="butterflyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9a8d4" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Left Top Wing */}
        <motion.polygon
          points="150,150 80,80 140,60"
          fill="url(#butterflyGradient)"
          style={{ transformOrigin: "150px 150px" }}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        {/* Right Top Wing */}
        <motion.polygon
          points="150,150 220,80 160,60"
          fill="url(#butterflyGradient)"
          style={{ transformOrigin: "150px 150px" }}
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Left Bottom Wing */}
        <motion.polygon
          points="150,150 100,200 140,220"
          fill="url(#butterflyGradient)"
          style={{ transformOrigin: "150px 150px" }}
          initial={{ rotate: -120, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.6 }}
        />

        {/* Right Bottom Wing */}
        <motion.polygon
          points="150,150 200,200 160,220"
          fill="url(#butterflyGradient)"
          style={{ transformOrigin: "150px 150px" }}
          initial={{ rotate: 120, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.9 }}
        />

        {/* Body */}
        <motion.rect
          x="145"
          y="140"
          width="10"
          height="50"
          rx="5"
          fill="#4b5563"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />
      </svg>
    </div>
  );
}
export const ButterflyUnfolding = OrigamiButterfly;