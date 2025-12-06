import styles from './Header.module.css';
import { MenuIcon } from '../icons/MenuIcon';
import { UserIcon } from '../icons/UserIcon';

export interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  showProfile?: boolean;
}

export function Header({
  title = 'App',
  onMenuClick,
  onProfileClick,
  showProfile = true,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.actions}>
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className={styles.iconButton}
              aria-label="Open menu"
            >
              <MenuIcon className={styles.icon} />
            </button>
          )}

          {showProfile && onProfileClick && (
            <button
              type="button"
              onClick={onProfileClick}
              className={styles.iconButton}
              aria-label="Open profile"
            >
              <UserIcon className={styles.icon} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
