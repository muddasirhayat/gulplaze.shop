import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-cta text-white hover:brightness-95",
        variant === "secondary" && "border-2 border-primary text-text bg-transparent hover:bg-primary/15",
        variant === "ghost" && "hover:bg-black/5",
        variant === "outline" && "border border-black/10 bg-surface hover:bg-background",
        size === "sm" && "h-9 px-4 text-sm rounded-full",
        size === "md" && "h-11 px-6 text-sm rounded-full",
        size === "lg" && "h-12 px-8 rounded-full",
        className,
      )}
      {...props}
    />
  );
}
