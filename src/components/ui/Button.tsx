import React from 'react';
import styles from '../../styles/components/ui/Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'pagination';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  );
};
