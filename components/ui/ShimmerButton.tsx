"use client";

import { motion } from "framer-motion";

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function ShimmerButton({
  children,
  className = "",
  onClick,
  disabled,
  type = "button",
}: ShimmerButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={`relative inline-flex h-12 overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--neon-blue))_0%,hsl(var(--neon-purple))_50%,hsl(var(--neon-blue))_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-background px-7 py-1 text-sm font-bold text-white backdrop-blur-3xl">
        {children}
      </span>
    </motion.button>
  );
}
