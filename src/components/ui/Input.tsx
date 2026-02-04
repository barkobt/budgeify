'use client';

import React from 'react';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isRequired?: boolean;
  containerClassName?: string;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

/**
 * Input Component - Modern Design
 * 
 * A versatile input component with support for:
 * - Labels and helper text
 * - Error states
 * - Left/right icons
 * - Focus ring styling
 * - Multiple sizes
 * 
 * Usage:
 * ```tsx
 * <Input
 *   label="Amount"
 *   iconLeft="₺"
 *   placeholder="0.00"
 *   type="number"
 *   error={errors.amount}
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      iconLeft,
      iconRight,
      isRequired = false,
      type = 'text',
      className = '',
      containerClassName = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles =
      'w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none';

    const borderStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

    const disabledStyles = disabled
      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
      : 'text-slate-900 placeholder:text-slate-400';

    const combinedInputClassName = `${baseStyles} ${sizeStyles[size]} ${borderStyles} ${disabledStyles} ${className}`;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {iconLeft && (
            <span className="absolute left-4 text-slate-500 pointer-events-none flex items-center justify-center h-full">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={`${combinedInputClassName} ${
              iconLeft ? 'pl-12' : ''
            } ${iconRight ? 'pr-12' : ''}`}
            {...props}
          />

          {iconRight && (
            <span className="absolute right-4 text-slate-500 pointer-events-none flex items-center justify-center h-full">
              {iconRight}
            </span>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <span>⚠</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-slate-500 mt-2">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;