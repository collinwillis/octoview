import React from 'react';
import styles from '../../styles/components/ui/Input.module.css';

export type InputVariant = 'default' | 'token';
export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  error?: boolean;
  label?: string;
  errorMessage?: string;
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  size = 'md',
  error = false,
  label,
  errorMessage,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = [
    styles.input,
    styles[variant],
    styles[size],
    error && styles.error,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input id={inputId} className={inputClasses} {...props} />
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
};
