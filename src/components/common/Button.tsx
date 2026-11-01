import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50';

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 gap-1.5 min-h-[32px]',
    md: 'text-sm py-2 px-4 gap-2 min-h-[40px]',
    lg: 'text-base py-2.5 px-6 gap-2.5 min-h-[48px]',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-blue-600 active:scale-[0.98]',
    secondary:
      'bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-800 active:scale-[0.98]',
    outline:
      'bg-transparent text-blue-300 border border-blue-500/30 hover:bg-blue-950/30 hover:border-blue-400/50 active:scale-[0.98]',
    ghost:
      'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 active:scale-[0.98]',
    danger:
      'bg-red-950/50 text-red-300 border border-red-700/40 hover:bg-red-900/60 hover:border-red-600 active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
