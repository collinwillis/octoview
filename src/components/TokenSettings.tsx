import React, { useState } from 'react';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from '../utils/tokenStorage';
import { Button, Input, Message } from './ui';
import styles from '../styles/components/TokenSettings.module.css';

interface TokenSettingsProps {
  onTokenUpdate: (token: string) => void;
  onLogout: () => void;
}

export const TokenSettings: React.FC<TokenSettingsProps> = ({
  onTokenUpdate,
  onLogout,
}) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentToken = getStoredToken();
  const maskedToken = currentToken
    ? `${currentToken.substring(0, 8)}...${currentToken.substring(currentToken.length - 4)}`
    : 'No token set';

  const handleSave = () => {
    setError(null);

    if (!token.trim()) {
      setError('Token cannot be empty');
      return;
    }

    try {
      setStoredToken(token.trim());
      onTokenUpdate(token.trim());
      setToken('');
    } catch (err) {
      setError('Failed to save token');
    }
  };

  const handleLogout = () => {
    removeStoredToken();
    onLogout();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Token Settings</h2>
        <h3 className={styles.cardTitle}>GitHub Personal Access Token</h3>

        <div className={styles.currentTokenSection}>
          <label className={styles.label}>Current Token:</label>
          <div className={styles.tokenDisplay}>{maskedToken}</div>
        </div>

        <Input
          type="password"
          value={token}
          onChange={e => {
            setToken(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter your GitHub Personal Access Token"
          label="New Token:"
          variant="token"
          size="md"
          error={!!error}
        />

        <div className={styles.buttonGroup}>
          <Button onClick={handleSave} variant="primary" size="md">
            Update Token
          </Button>

          <Button onClick={handleLogout} variant="danger" size="sm">
            Logout
          </Button>
        </div>

        {error && <Message variant="error">{error}</Message>}
      </div>
    </div>
  );
};
