import { useState, useEffect } from 'react';
import { GitHubUser } from '../types/github';
import { fetchUserProfile } from '../services/githubApi';
import { getStoredToken } from '../utils/tokenStorage';

export const useGitHubUserProfile = (token?: string) => {
  const [userProfile, setUserProfile] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = async (authToken?: string) => {
    const tokenToUse = authToken || token || getStoredToken();
    if (!tokenToUse) {
      setUserProfile(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await fetchUserProfile(tokenToUse);
      setUserProfile(profile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch user profile'
      );
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [token]);

  return {
    userProfile,
    loading,
    error,
    refetch: loadUserProfile,
  };
};
