"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Meteors = ({ number = 20, className }: { number?: number; className?: string }) => {
  // Generate static positions for each meteor index
  const getMeteorStyle = (idx: number) => {
    const seed = idx * 12345; // Use index as seed for consistent positioning
    const pseudoRandom1 = (seed * 9301 + 49297) % 233280;
    const pseudoRandom2 = ((seed + 1) * 9301 + 49297) % 233280;
    
    return {
      top: (pseudoRandom1 / 233280) * 100 + "%",
      left: (pseudoRandom2 / 233280) * 100 + "%",
      duration: ((idx % 3) + 2),
      delay: (idx % 5),
    };
  };

  return (
    <>
      {Array.from({ length: number }).map((_, idx) => {
        const style = getMeteorStyle(idx);
        return (
          <motion.span
            key={idx}
            className={cn(
              "absolute h-0.5 w-0.5 rounded-full bg-neon-blue shadow-[0_0_8px_hsl(var(--neon-blue))]",
              className
            )}
            style={{
              top: style.top,
              left: style.left,
            }}
            animate={{
              x: [0, -100],
              y: [0, 100],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: style.duration,
              repeat: Infinity,
              delay: style.delay,
              ease: "linear",
            }}
          />
        );
      })}
    </>
  );
};
