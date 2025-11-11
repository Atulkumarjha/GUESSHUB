"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

export interface DockProps {
  className?: string;
  children: React.ReactNode;
}

export function Dock({ className, children }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-end gap-4 rounded-2xl border border-neon-blue/30 bg-secondary/80 backdrop-blur-md px-4 pb-3",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  children: React.ReactNode;
  className?: string;
}

export function DockIcon({
  size = 40,
  magnification = 60,
  distance = 140,
  children,
  className,
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        className
      )}
      onMouseMove={(e) => {
        const parent = ref.current?.parentElement;
        if (parent) {
          const parentMouseX = parent.dataset.mouseX;
          if (parentMouseX) {
            mouseX.set(e.pageX);
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}
