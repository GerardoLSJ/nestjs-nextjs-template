'use client';

import styles from './add.module.css';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

export default function AddPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted! (Placeholder action)');
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Add New Item</h1>
          <p className={styles.subtitle}>Create something new</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                Title
              </label>
              <input
                type="text"
                id="title"
                className={styles.input}
                placeholder="Enter title"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                className={styles.textarea}
                placeholder="Enter description"
                rows={4}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Create Item
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
