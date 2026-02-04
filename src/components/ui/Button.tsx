'use client';

import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  children?: React.ReactNode;
}

/**
 * Button Component - Professional Fintech Design System
 *
 * Premium button with Kral İndigo strategy:
 * - Primary variant uses Indigo (CTA, important actions)
 * - Other variants use neutral/semantic colors
 *
 * Variants:
 * - primary: Kral İndigo - Strategic use for CTAs ⚡
 * - secondary: Neutral gray - Standard actions
 * - success: Green - Income/positive actions
 * - error: Red - Expense/delete actions
 * - outline: Border-only - Secondary CTAs
 * - ghost: Transparent - Subtle actions
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" icon={<Plus />}>
 *   Add Transaction
 * </Button>
 * ```
 */

const variantStyles: Record<ButtonVariant, string> = {
  // Kral İndigo - Strategic CTA (main actions only!)
  primary:
    'bg-accent-700 hover:bg-accent-800 active:bg-accent-900 text-white shadow-accent-sm hover:shadow-accent-md font-semibold',

  // Neutral - Standard actions
  secondary:
    'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 shadow-sm font-medium',

  // Success - Income/positive
  success:
    'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-sm hover:shadow-md font-semibold',

  // Error - Expense/delete
  error:
    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm hover:shadow-md font-semibold',

  // Outline - Secondary CTA
  outline:
    'border-2 border-accent-700 text-accent-700 hover:bg-accent-50 active:bg-accent-100 font-semibold',

  // Ghost - Subtle actions
  ghost:
    'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-medium',
};

const sizeStyles: Record<ButtonSize, { padding: string; paddingIconOnly: string; text: string; radius: string }> = {
  sm: {
    padding: 'px-4 py-2',
    paddingIconOnly: 'p-2',
    text: 'text-sm',
    radius: 'rounded-lg'
  },
  md: {
    padding: 'px-6 py-2.5',
    paddingIconOnly: 'p-2.5',
    text: 'text-base',
    radius: 'rounded-xl'
  },
  lg: {
    padding: 'px-8 py-3.5',
    paddingIconOnly: 'p-3.5',
    text: 'text-lg',
    radius: 'rounded-xl'
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      icon,
      iconPosition = 'left',
      iconOnly = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const { padding, paddingIconOnly, text, radius } = sizeStyles[size];

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

    const paddingClass = iconOnly ? paddingIconOnly : padding;

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingClass} ${text} ${radius} ${
      isFullWidth ? 'w-full' : ''
    } ${className}`;

    const content = (
      <>
        {icon && iconPosition === 'left' && (
          <span className={children && !iconOnly ? 'mr-2' : ''}>{icon}</span>
        )}
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-label="Loading"
            />
            {children && !iconOnly && <span>Yükleniyor...</span>}
          </span>
        ) : (
          !iconOnly && children
        )}
        {icon && iconPosition === 'right' && (
          <span className={children && !iconOnly ? 'ml-2' : ''}>{icon}</span>
        )}
      </>
    );

    return (
      <motion.button
        ref={ref}
        type={props.type || 'button'}
        className={combinedClassName}
        disabled={isDisabled}
        onClick={props.onClick}
        aria-label={props['aria-label']}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;