import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: `
          bg-primary
          text-primary-foreground
          hover:bg-primary/90
          active:bg-primary/80
        `,

        destructive: `
          bg-destructive
          text-destructive-foreground
          hover:bg-destructive/90
          active:bg-destructive/80
        `,

        secondary: `
          bg-secondary
          text-secondary-foreground
          hover:bg-secondary/80
          active:bg-secondary/70
        `,

        outline: `
          bg-transparent
          border border-input
          text-foreground
          hover:bg-accent/30
          hover:text-accent-foreground
          active:bg-accent/40
        `,

        ghost: `
          bg-transparent
          text-foreground
          hover:bg-accent/40
          hover:text-accent-foreground
          active:bg-accent/50
        `,

        link: `
          bg-transparent
          text-primary
          hover:underline
          hover:text-primary/80
        `,

        // Islamic themed variants
        gold: `
          bg-accent
          text-accent-foreground
          hover:bg-accent/90
          active:bg-accent/80
          shadow-glow
        `,

        hero: `
          bg-primary
          text-primary-foreground
          hover:bg-primary/90
          active:bg-primary/80
          shadow-lg
          hover:shadow-xl
          hover:-translate-y-0.5
        `,

        "hero-outline": `
          bg-transparent
          border-2 border-primary-foreground/30
          text-primary-foreground
          hover:bg-primary-foreground/10
          active:bg-primary-foreground/20
          backdrop-blur-sm
        `,

        emerald: `
          bg-primary
          text-primary-foreground
          hover:bg-primary/85
          active:bg-primary/75
          shadow-soft
        `,

        "emerald-outline": `
          bg-transparent
          border-2 border-primary
          text-primary
          hover:bg-primary
          hover:text-primary-foreground
          active:bg-primary/90
        `,

        glass: `
          bg-background/80
          text-foreground
          border border-border/50
          backdrop-blur-md
          hover:bg-background/90
          active:bg-background
        `,
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
