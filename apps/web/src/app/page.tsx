'use client';

import styles from './page.module.css';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome, {user?.name}!</h1>
          <p className={styles.subtitle}>You are successfully logged in.</p>

          <div className={styles.userInfo}>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>User ID:</strong> {user?.id}
            </p>
          </div>

          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
