import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-neon-blue text-background hover:bg-neon-blue/90 hover:shadow-[0_0_20px_hsl(var(--neon-blue)/0.5)] focus-visible:ring-neon-blue",
        destructive:
          "bg-neon-red text-white hover:bg-neon-red/90 hover:shadow-[0_0_20px_hsl(var(--neon-red)/0.5)] focus-visible:ring-neon-red",
        outline:
          "border-2 border-slate-700 bg-transparent hover:bg-slate-800/50 hover:border-neon-blue/50 text-slate-200 focus-visible:ring-neon-blue",
        secondary:
          "bg-secondary/50 text-slate-200 hover:bg-secondary/70 focus-visible:ring-slate-400",
        ghost: "hover:bg-slate-800/30 hover:text-neon-blue text-slate-300",
        link: "text-neon-blue underline-offset-4 hover:underline hover:text-neon-cyan",
        success: "bg-neon-green text-background hover:bg-neon-green/90 hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.5)] focus-visible:ring-neon-green",
        purple: "bg-neon-purple text-white hover:bg-neon-purple/90 hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)] focus-visible:ring-neon-purple",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
