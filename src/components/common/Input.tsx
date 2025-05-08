import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    helperText, 
    error, 
    leftIcon, 
    rightIcon, 
    fullWidth = false, 
    className = '', 
    id,
    ...rest 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseInputClasses = 'block rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    const errorInputClasses = 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500';
    const normalInputClasses = 'border-gray-300 placeholder-gray-400';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const iconClasses = 'absolute inset-y-0 flex items-center pointer-events-none text-gray-400';
    const leftIconClasses = leftIcon ? 'pl-10' : 'pl-3';
    const rightIconClasses = rightIcon ? 'pr-10' : 'pr-3';
    
    const inputClasses = [
      baseInputClasses,
      error ? errorInputClasses : normalInputClasses,
      leftIconClasses,
      rightIconClasses,
      widthClass,
      className,
    ].join(' ');

    return (
      <div className={widthClass}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className={`${iconClasses} left-0 pl-3`}>
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...rest}
          />
          
          {rightIcon && (
            <div className={`${iconClasses} right-0 pr-3`}>
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500" id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;