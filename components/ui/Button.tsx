import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500',
  secondary: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus-visible:ring-amber-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 focus-visible:ring-amber-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, isLoading, as: Component = 'button', ...props }, ref) => {
    const isDisabled = isLoading || props.disabled;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { disabled, ...restProps } = props;

    const allProps: any = {
      ...restProps,
      ref,
      className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`,
    };

    // Apply disabled attribute only if it's a real button
    if (Component === 'button') {
      allProps.disabled = isDisabled;
    } 
    // For other elements, use aria-disabled for accessibility and prevent interaction
    else if (isDisabled) {
      allProps['aria-disabled'] = true;
      allProps.style = { ...allProps.style, pointerEvents: 'none' };
    }
    
    return (
      <Component {...allProps}>
        {children}
      </Component>
    );
  }
);
Button.displayName = 'Button';