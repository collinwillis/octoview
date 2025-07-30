import React from 'react';
import { GitHubIssue } from '../types/github';
import { ArrowLeft } from 'lucide-react';
import styles from '../styles/components/IssueList.module.css';

interface IssueListProps {
  issues: GitHubIssue[];
  loading: boolean;
  error?: string | null;
  currentPage?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  filter?: 'open' | 'closed' | 'all';
  onNextPage: () => void;
  onPrevPage: () => void;
  onFilterChange?: (filter: 'open' | 'closed' | 'all') => void;
  onBack?: () => void;
}

export const IssueList: React.FC<IssueListProps> = ({ 
  issues,
  loading,
  error,
  currentPage = 1,
  hasNextPage = false,
  hasPrevPage = false,
  filter = 'all',
  onNextPage,
  onPrevPage,
  onFilterChange,
  onBack
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          Loading issues...
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          Error: {error}
        </div>
      );
    }

    if (issues.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          No issues found for this repository.
        </div>
      );
    }

    return (
      <div className={styles.gridContainer}>
        {issues.map((issue) => (
          <div key={issue.number} className={styles.gridItem}>
            <div className={styles.issueHeader}>
              <h3 className={styles.issueTitle}>
                <a 
                  href={issue.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.issueLink}
                >
                  {issue.title}
                </a>
              </h3>
              <span className={`${styles.issueState} ${styles[issue.state]}`}>
                {issue.state}
              </span>
            </div>
            
            <div className={styles.issueBody}>
              {issue.body ? (
                <p className={styles.issueDescription}>
                  {issue.body.length > 150 
                    ? `${issue.body.substring(0, 150)}...` 
                    : issue.body
                  }
                </p>
              ) : (
                <p className={styles.noDescription}>No description provided</p>
              )}
            </div>
            
            <div className={styles.issueMeta}>
              <span className={styles.issueNumber}>#{issue.number}</span>
              <span className={styles.issueDate}>
                {formatDate(issue.created_at)}
              </span>
              {issue.user && (
                <span className={styles.issueAuthor}>
                  by {issue.user.login}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Filter and Pagination Controls */}
      <div className={styles.controlsContainer}>
        {/* Back Button and Filter Controls Row */}
        <div className={styles.topControlsRow}>
          {onBack && (
            <button 
              className={styles.backButton}
              onClick={onBack}
              disabled={loading}
              aria-label="Back to repository search"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          {/* Filter Controls */}
          {onFilterChange && (
            <div className={styles.filterControlsCenter}>
              <div className={styles.filterControls}>
                <button
                  className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                  onClick={() => onFilterChange('all')}
                  disabled={loading}
                >
                  All
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'open' ? styles.active : ''}`}
                  onClick={() => onFilterChange('open')}
                  disabled={loading}
                >
                  Open
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'closed' ? styles.active : ''}`}
                  onClick={() => onFilterChange('closed')}
                  disabled={loading}
                >
                  Closed
                </button>
              </div>
            </div>
          )}
          <div className={styles.spacer}></div>
        </div>
        
        {/* Pagination Controls */}
        <div className={styles.paginationControls}>
          <button
            onClick={onPrevPage}
            disabled={!hasPrevPage || loading}
            className={styles.paginationButton}
          >
            Prev
          </button>
          
          <span className={styles.pageIndicator}>Page {currentPage}</span>
          
          <button
            onClick={onNextPage}
            disabled={!hasNextPage || loading}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </div>
  );
};