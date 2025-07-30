export interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string | null;
  html_url?: string;
}

export interface GitHubLabel {
  name: string;
  color: string;
}

export interface GitHubIssue {
  number: number;
  state: 'open' | 'closed';
  title: string;
  body: string | null;
  user: GitHubUser;
  labels: GitHubLabel[];
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GitHubApiResponse {
  data: GitHubIssue[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}
