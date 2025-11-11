"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ children, className = "", animate = true }: GradientTextProps) {
  const textClass = cn(
    "text-white font-bold",
    className
  );

  if (animate) {
    return (
      <motion.span
        className={textClass}
      >
        {children}
      </motion.span>
    );
  }

  return <span className={textClass}>{children}</span>;
}
