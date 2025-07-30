import React, { useState } from 'react';
import { Button, Input, Message } from './ui';
import styles from '../styles/components/RepoInput.module.css';

interface RepoInputProps {
  onRepoSubmit: (repo: string) => void;
  loading?: boolean;
  currentRepo?: string;
}

export const RepoInput: React.FC<RepoInputProps> = ({
  onRepoSubmit,
  loading = false,
  currentRepo = '',
}) => {
  const [repo, setRepo] = useState(currentRepo);
  const [error, setError] = useState<string | null>(null);

  const validateRepo = (repoString: string): boolean => {
    return repoString.trim().includes('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRepo(repo)) {
      onRepoSubmit(repo.trim());
    } else {
      setError('Format: owner/repo');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepo(e.target.value);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          id="repo"
          type="text"
          value={repo}
          onChange={handleInputChange}
          placeholder="owner/repository"
          size="lg"
          error={!!error}
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !repo.trim()}
          variant="primary"
          size="lg"
          loading={loading}
        >
          Search Repository
        </Button>
        {error && <Message variant="error">{error}</Message>}
      </form>
    </div>
  );
};
