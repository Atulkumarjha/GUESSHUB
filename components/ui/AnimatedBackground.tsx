"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--neon-blue)) 0%, transparent 70%)",
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(var(--neon-pink)) 0%, transparent 70%)",
          right: "10%",
          top: "20%",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(var(--neon-purple)) 0%, transparent 70%)",
          left: "15%",
          bottom: "15%",
        }}
        animate={{
          x: [0, 35, 0],
          y: [0, -35, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--neon-blue)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--neon-blue)) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
