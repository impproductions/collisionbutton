import React from 'react';
import { DeletionForm } from '../../components/DeletionForm/DeletionForm';
import styles from './AccountDeletionPage.module.css';

export const AccountDeletionPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Deletion</h1>
        <p className={styles.subtitle}>
          Permanent removal of your account and all associated data
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.warningBanner}>
          <svg
            className={styles.warningIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9V13M12 17H12.01M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>This action cannot be undone</span>
        </div>

        <DeletionForm />
      </div>
    </div>
  );
};