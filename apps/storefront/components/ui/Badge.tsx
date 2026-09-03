import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'wood' | 'sand' | 'olive' | 'terracotta' | 'dark';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sand',
  className,
  ...props
}) => {
  const variants = {
    sand: 'bg-neruma-sand-200 text-neruma-charcoal border border-neruma-border',
    wood: 'bg-neruma-wood-light/20 text-neruma-wood-dark border border-neruma-wood/30',
    olive: 'bg-neruma-olive-light/20 text-neruma-olive-dark border border-neruma-olive/30',
    terracotta: 'bg-neruma-terracotta-light/20 text-neruma-terracotta-dark border border-neruma-terracotta/30',
    dark: 'bg-neruma-dark text-neruma-bg',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
