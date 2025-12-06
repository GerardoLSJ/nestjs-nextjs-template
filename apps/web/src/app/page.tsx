'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './page.module.css';

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
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

        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}
