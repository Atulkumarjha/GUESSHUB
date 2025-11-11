"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}
