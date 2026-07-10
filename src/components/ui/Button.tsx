import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent',
      danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm border border-transparent',
      outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-bold rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
