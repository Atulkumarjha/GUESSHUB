"use client";
import React, { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function MovingBorder({
  children,
  duration = 2000,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x ?? 0);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y ?? 0);

  return (
    <div
      className={cn(
        "relative w-fit h-fit p-[1px] overflow-hidden",
        containerClassName
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          ref={pathRef}
          fill="none"
          width="100%"
          height="100%"
          rx="12"
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: y,
          left: x,
          width: 10,
          height: 10,
          background: "linear-gradient(90deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)), hsl(var(--neon-pink)))",
          borderRadius: "50%",
          filter: "blur(3px)",
        }}
      />
      <div
        className={cn(
          "relative bg-secondary/90 backdrop-blur-sm border border-neon-blue/30 rounded-xl p-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
