import React from 'react';
import styles from '../../styles/components/ui/Message.module.css';

export type MessageVariant = 'error' | 'success' | 'warning' | 'info';

interface MessageProps {
  variant: MessageVariant;
  children: React.ReactNode;
  className?: string;
}

export const Message: React.FC<MessageProps> = ({
  variant,
  children,
  className = '',
}) => {
  const messageClasses = [styles.message, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return <div className={messageClasses}>{children}</div>;
};
