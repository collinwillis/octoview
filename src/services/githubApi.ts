import {
  GitHubIssue,
  GitHubApiResponse,
  GitHubUser,
  ApiError,
} from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';
const ISSUES_PER_PAGE = 30;

export const fetchIssues = async (
  token: string,
  repo: string,
  page: number = 1,
  state: 'open' | 'closed' | 'all' = 'all'
): Promise<GitHubApiResponse> => {
  const url = `${GITHUB_API_BASE}/repos/${repo}/issues?page=${page}&per_page=${ISSUES_PER_PAGE}&state=${state}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch issues: ${response.status}`);
  }

  const issues: GitHubIssue[] = await response.json();

  const linkHeader = response.headers.get('Link');
  const hasNextPage = linkHeader ? linkHeader.includes('rel="next"') : false;
  const hasPrevPage = page > 1;

  return {
    data: issues,
    hasNextPage,
    hasPrevPage,
  };
};

export const fetchUserProfile = async (token: string): Promise<GitHubUser> => {
  const url = `${GITHUB_API_BASE}/user`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.status}`);
  }

  const userProfile: GitHubUser = await response.json();
  return userProfile;
};
