'use client';

import React from 'react';

type CardVariant = 'default' | 'glass' | 'solid' | 'elevated' | 'gradient' | 'outline';
type CardSize = 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noBorder?: boolean;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noBorder?: boolean;
}

/**
 * Card Component - Professional Fintech Design System
 *
 * Premium card component with variants, sizes, and consistent spacing.
 * Follows 8px grid system and uses design tokens.
 *
 * Variants:
 * - default: Clean white surface (fintech-grade)
 * - glass: Refined glassmorphism
 * - solid: Opaque white (maximum contrast)
 * - elevated: Prominent depth
 * - gradient: Kral İndigo gradient (strategic use only!)
 * - outline: Minimal border-only
 *
 * Sizes:
 * - sm: Compact (padding: 16px)
 * - md: Standard (padding: 24px) - Default
 * - lg: Spacious (padding: 32px)
 *
 * @example
 * ```tsx
 * <Card variant="default" size="md" hover>
 *   <CardHeader>
 *     <CardTitle>Financial Summary</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Content here
 *   </CardContent>
 *   <CardFooter>
 *     Actions
 *   </CardFooter>
 * </Card>
 * ```
 */

const variantStyles: Record<CardVariant, string> = {
  default: 'card-solid', // Solid card for important content
  glass: 'glass-card', // Glassmorphism level 2 for main containers
  solid: 'card-white', // White card for maximum contrast
  elevated: 'glass-elevated', // Glassmorphism level 3 for modals/dropdowns
  gradient: 'card-gradient', // Premium gradient card
  outline: 'glass-subtle border-2 border-white/10', // Minimal border-only
};

const sizeStyles: Record<CardSize, { padding: string; radius: string }> = {
  sm: { padding: 'p-4', radius: 'rounded-xl' },
  md: { padding: 'p-6', radius: 'rounded-2xl' },
  lg: { padding: 'p-8', radius: 'rounded-2xl' },
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', variant = 'default', size = 'md', hover = false, ...props }, ref) => {
    const variantClass = variantStyles[variant];
    const { radius } = sizeStyles[size];
    const hoverClass = hover ? 'hover:scale-[1.01] hover:shadow-lg' : '';

    return (
      <div
        ref={ref}
        className={`${radius} ${variantClass} ${hoverClass} transition-all duration-200 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', noBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-5 ${!noBorder ? 'border-b border-white/10' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = '', as: Component = 'h2', ...props }, ref) => (
    <Component
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={`text-xl font-semibold text-white tracking-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', noBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-5 ${!noBorder ? 'border-t border-white/10' : ''} flex items-center gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;