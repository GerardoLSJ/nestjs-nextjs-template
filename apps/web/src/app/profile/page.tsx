'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
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
  );
}
