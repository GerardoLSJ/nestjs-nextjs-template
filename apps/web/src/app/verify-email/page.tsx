'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

import styles from './verify-email.module.css';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token');
      return;
    }

    const verifyEmail = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
        const response = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Verification failed');
        }

        const data = await response.json();

        // Store token and user in localStorage (auto-login)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        setStatus('success');
        setMessage('Email verified successfully! Redirecting...');

        // Redirect to home page after a delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${styles[status]}`}>
        <h1 className={styles.title}>
          {status === 'loading' && 'Verifying...'}
          {status === 'success' && 'Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h1>
        <p className={styles.message}>{message}</p>

        {status === 'error' && (
          <div className={styles.actions}>
            <a href="/login" className={styles.button}>
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={`${styles.card} ${styles.loading}`}>
            <h1 className={styles.title}>Loading...</h1>
            <p className={styles.message}>Please wait while we verify your email...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
