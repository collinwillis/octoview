import React, { useState } from 'react';
import { Button, Input } from './ui';
import styles from '../styles/components/TokenModal.module.css';

interface TokenModalProps {
  isOpen: boolean;
  onTokenSubmit: (token: string) => void;
  onClose: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onTokenSubmit,
  onClose,
}) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
      setToken('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>GitHub Personal Access Token Required</h2>
        <p className={styles.description}>
          To access OctoView, you need to provide a GitHub Personal Access
          Token. You can create one at{' '}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Settings
          </a>
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            id="token"
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            label="GitHub Token:"
            variant="token"
            size="sm"
          />

          <div className={styles.buttonGroup}>
            <Button type="submit" variant="primary" size="sm">
              Save Token
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
