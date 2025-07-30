import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { TokenModal } from '../components/TokenModal';
import { IssueList } from '../components/IssueList';
import { RepoInput } from '../components/RepoInput';
import { TokenSettings } from '../components/TokenSettings';
import { useGitHubIssues } from '../hooks/useGitHubIssues';
import {
  getStoredToken,
  setStoredToken,
  hasStoredToken,
  removeStoredToken,
} from '../utils/tokenStorage';
import logoIcon from '../assets/images/logo.png';
import styles from '../styles/components/Home.module.css';

export const Home: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [currentRepo, setCurrentRepo] = useState<string>('');
  const [activeNavPage, setActiveNavPage] = useState<string>('home');

  const {
    issues,
    loading,
    error,
    currentPage,
    hasNextPage,
    hasPrevPage,
    filter,
    fetchIssuesForRepo,
    nextPage,
    prevPage,
    setFilter,
  } = useGitHubIssues(token);

  // Check for stored token on component mount
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
    } else {
      setShowTokenModal(true);
    }
  }, []);

  const handleTokenSubmit = (newToken: string) => {
    setStoredToken(newToken);
    setToken(newToken);
    setShowTokenModal(false);
  };

  const handleTokenModalClose = () => {
    if (hasStoredToken()) {
      setShowTokenModal(false);
    }
  };

  const handleRepoSubmit = (repo: string) => {
    setCurrentRepo(repo);
    fetchIssuesForRepo(repo);
  };

  const handleBackToSearch = () => {
    setCurrentRepo('');
  };

  const handleLogout = () => {
    removeStoredToken();
    setToken('');
    setCurrentRepo('');
    setShowTokenModal(true);
  };

  const handleNavigate = (page: string) => {
    setActiveNavPage(page);
  };

  const renderContent = () => {
    if (activeNavPage === 'settings') {
      return <TokenSettings onTokenUpdate={setToken} onLogout={handleLogout} />;
    }

    if (!currentRepo) {
      return (
        <div className={styles.welcomeContainer}>
          <div className={styles.welcomeInputContainer}>
            <img src={logoIcon} alt="OctoView" className={styles.welcomeLogo} />
            <h1 className={styles.welcomeTitle}>Welcome to OctoView</h1>
            <p className={styles.welcomeDescription}>
              Enter a GitHub repository to view its issues
            </p>
            <RepoInput onRepoSubmit={handleRepoSubmit} loading={loading} />
          </div>
        </div>
      );
    }

    return (
      <IssueList
        issues={issues}
        loading={loading}
        error={error}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        filter={filter}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        onFilterChange={setFilter}
        onBack={handleBackToSearch}
      />
    );
  };

  return (
    <Layout
      currentPage={activeNavPage}
      onNavigate={handleNavigate}
      token={token}
    >
      {renderContent()}

      <TokenModal
        isOpen={showTokenModal}
        onTokenSubmit={handleTokenSubmit}
        onClose={handleTokenModalClose}
      />
    </Layout>
  );
};
