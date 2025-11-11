import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white border border-white/30",
        success: "bg-white/10 text-white border border-white/30",
        warning: "bg-white/10 text-white border border-white/30",
        danger: "bg-white/10 text-white border border-white/30",
        purple: "bg-white/10 text-white border border-white/30",
        pink: "bg-white/10 text-white border border-white/30",
        secondary: "bg-white/5 text-gray-300 border border-white/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
