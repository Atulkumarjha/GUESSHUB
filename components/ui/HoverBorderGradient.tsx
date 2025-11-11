"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXRelative = (e.clientX - rect.left) / width - 0.5;
    const mouseYRelative = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(mouseXRelative);
    mouseY.set(mouseYRelative);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative rounded-xl p-[2px]", containerClassName)}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `conic-gradient(from ${
            clockwise ? "0deg" : "360deg"
          }, hsl(var(--neon-pink)), hsl(var(--neon-purple)), hsl(var(--neon-blue)), hsl(var(--neon-pink)))`,
          animation: `spin ${duration}s linear infinite ${
            clockwise ? "normal" : "reverse"
          }`,
        }}
      />
      <Tag
        className={cn(
          "relative bg-secondary/90 backdrop-blur-sm rounded-xl px-6 py-3 text-slate-100 font-semibold hover:bg-secondary transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    </motion.div>
  );
};
