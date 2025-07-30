import React from 'react';
import { Home, Settings, Circle } from 'lucide-react';
import logoImage from '../assets/images/logo.png';
import { useGitHubUserProfile } from '../hooks/useGitHubUserProfile';
import styles from '../styles/components/UserProfile.module.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  token?: string;
}

const UserProfile: React.FC<{ token?: string }> = ({ token }) => {
  const { userProfile, loading, error } = useGitHubUserProfile(token);

  if (loading || error || !userProfile) {
    return null;
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        <span className={styles.username}>{userProfile.login}</span>
        {userProfile.name && (
          <span className={styles.displayName}>{userProfile.name}</span>
        )}
      </div>
      <img
        src={userProfile.avatar_url}
        alt={`${userProfile.login}'s avatar`}
        className={styles.userAvatar}
      />
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage = 'home',
  onNavigate,
  token,
}) => {
  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <header className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-text">OctoView</span>
          </div>
        </div>
        <div className="nav-center"></div>
        <div className="nav-right">
          <UserProfile token={token} />
        </div>
      </header>

      {/* Left Sidebar */}
      <aside className="left-sidebar">
        <div className="sidebar-logo">
          <img
            src={logoImage}
            alt="OctoViewer Logo"
            className="sidebar-logo-icon"
          />
        </div>
        <nav className="sidebar-nav">
          <div
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate?.('home')}
            style={{ cursor: 'pointer' }}
          >
            <Home className="nav-icon" size={20} />
          </div>
          <div
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate?.('settings')}
            style={{ cursor: 'pointer' }}
          >
            <Settings className="nav-icon" size={20} />
          </div>

          <div className="nav-item disabled">
            <Circle className="nav-icon" size={20} fill="currentColor" />
          </div>
          <div className="nav-item disabled">
            <Circle className="nav-icon" size={20} fill="currentColor" />
          </div>
          <div className="nav-item disabled">
            <Circle className="nav-icon" size={20} fill="currentColor" />
          </div>
        </nav>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
};
