"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-neon-blue/30 to-transparent"
          style={{
            left: `${20 + i * 20}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scaleY: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};
