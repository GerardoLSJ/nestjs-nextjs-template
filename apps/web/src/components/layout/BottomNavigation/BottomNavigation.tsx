'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentType } from 'react';

import styles from './BottomNavigation.module.css';
import { HomeIcon } from '../icons/HomeIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { UserIcon } from '../icons/UserIcon';

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  elevated?: boolean;
}

export interface BottomNavigationProps {
  items?: NavItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}

const defaultNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    href: '/',
    elevated: false,
  },
  {
    id: 'add',
    label: 'Add',
    icon: PlusIcon,
    href: '/add',
    elevated: true,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserIcon,
    href: '/profile',
    elevated: false,
  },
];

export function BottomNavigation({
  items = defaultNavItems,
  activeId,
  onItemClick,
}: BottomNavigationProps) {
  const pathname = usePathname();

  const getActiveId = () => {
    if (activeId) return activeId;

    const activeItem = items.find((item) => item.href === pathname);
    return activeItem?.id;
  };

  const currentActiveId = getActiveId();

  const handleClick = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
    }
  };

  return (
    <nav className={styles.nav} role="navigation" aria-label="Bottom navigation">
      <div className={styles.container}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentActiveId === item.id;
          const buttonClass = `${styles.navButton} ${item.elevated ? styles.elevated : ''} ${
            isActive ? styles.active : ''
          }`;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={buttonClass}
              onClick={() => handleClick(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
