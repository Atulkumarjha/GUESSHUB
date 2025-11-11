"use client";

import { motion } from "framer-motion";

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowingBorder({ 
  children, 
  className = "", 
  glowColor = "var(--neon-blue)" 
}: GlowingBorderProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute -inset-[2px] rounded-2xl opacity-75 blur-sm"
        style={{
          background: `linear-gradient(45deg, ${glowColor}, transparent)`,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative bg-background rounded-2xl">
        {children}
      </div>
    </div>
  );
}
