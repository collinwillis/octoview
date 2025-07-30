import { useState, useEffect, useCallback, useRef } from 'react';
import { GitHubIssue, ApiError } from '../types/github';
import { fetchIssues } from '../services/githubApi';

interface UseGitHubIssuesState {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  filter: 'open' | 'closed' | 'all';
}

interface UseGitHubIssuesActions {
  fetchIssuesForRepo: (repo: string) => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  clearError: () => void;
  reset: () => void;
  setFilter: (filter: 'open' | 'closed' | 'all') => void;
}

export const useGitHubIssues = (
  token: string
): UseGitHubIssuesState & UseGitHubIssuesActions => {
  const [state, setState] = useState<UseGitHubIssuesState>({
    issues: [],
    loading: false,
    error: null,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    filter: 'all',
  });

  const [currentRepo, setCurrentRepo] = useState<string>('');
  const filterRef = useRef<'open' | 'closed' | 'all'>('all');

  // Keep filterRef in sync with state.filter
  useEffect(() => {
    filterRef.current = state.filter;
  }, [state.filter]);

  const fetchIssuesForRepo = useCallback(
    async (repo: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setCurrentRepo(repo);

      try {
        const response = await fetchIssues(token, repo, 1, filterRef.current);
        setState(prev => ({
          ...prev,
          issues: response.data,
          loading: false,
          currentPage: 1,
          hasNextPage: response.hasNextPage,
          hasPrevPage: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch issues',
          issues: [],
        }));
      }
    },
    [token]
  );

  const loadPage = useCallback(
    async (page: number, filter?: 'open' | 'closed' | 'all') => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        const currentFilter = filter || filterRef.current;
        const response = await fetchIssues(
          token,
          currentRepo,
          page,
          currentFilter
        );
        setState(prev => ({
          ...prev,
          issues: response.data,
          loading: false,
          currentPage: page,
          hasNextPage: response.hasNextPage,
          hasPrevPage: response.hasPrevPage,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch issues',
        }));
      }
    },
    [currentRepo, token]
  );

  const nextPage = useCallback(() => {
    if (state.hasNextPage) {
      loadPage(state.currentPage + 1);
    }
  }, [state.hasNextPage, state.currentPage, loadPage]);

  const prevPage = useCallback(() => {
    if (state.hasPrevPage) {
      loadPage(state.currentPage - 1);
    }
  }, [state.hasPrevPage, state.currentPage, loadPage]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      issues: [],
      loading: false,
      error: null,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      filter: 'all',
    });
    setCurrentRepo('');
  }, []);

  const setFilter = useCallback(
    (filter: 'open' | 'closed' | 'all') => {
      setState(prev => ({ ...prev, filter, currentPage: 1 }));
      if (currentRepo) {
        loadPage(1, filter);
      }
    },
    [currentRepo, loadPage]
  );

  return {
    ...state,
    fetchIssuesForRepo,
    nextPage,
    prevPage,
    clearError,
    reset,
    setFilter,
  };
};
