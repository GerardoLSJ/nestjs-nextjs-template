'use client';

import { ReactNode, useState } from 'react';

import { BottomNavigation } from './BottomNavigation/BottomNavigation';
import { Header } from './Header/Header';
import styles from './MobileLayout.module.css';

export interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
}

export function MobileLayout({
  children,
  showBottomNav = true,
  showHeader = true,
  headerTitle = 'App',
  onMenuClick,
  onProfileClick,
}: MobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
  };

  return (
    <div className={styles.layout}>
      {showHeader && (
        <Header
          title={headerTitle}
          onMenuClick={handleMenuClick}
          onProfileClick={handleProfileClick}
        />
      )}

      <main className={styles.content}>{children}</main>

      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
