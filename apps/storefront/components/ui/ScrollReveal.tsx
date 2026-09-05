'use client';

import React, { useRef, useEffect, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'fade-up-stagger';
  delay?: number;
  duration?: number;
  threshold?: number;
}

const animationStyles: Record<string, { hidden: React.CSSProperties; visible: React.CSSProperties }> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, transform: 'translateX(-60px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'slide-right': {
    hidden: { opacity: 0, transform: 'translateX(60px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'scale-up': {
    hidden: { opacity: 0, transform: 'scale(0.9)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'fade-up-stagger': {
    hidden: { opacity: 0, transform: 'translateY(30px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
};

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style = animationStyles[animation] || animationStyles['fade-up'];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(isVisible ? style.visible : style.hidden),
        transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
