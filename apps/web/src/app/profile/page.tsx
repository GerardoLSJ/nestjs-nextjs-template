'use client';

import styles from './profile.module.css';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>Manage your account settings</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Information</h2>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <p className={styles.value}>{user?.name}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <p className={styles.value}>{user?.email}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>User ID</label>
              <p className={styles.value}>{user?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
