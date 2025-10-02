import React, { useState } from 'react';
import { ConfirmButton } from '../ConfirmButton/ConfirmButton';
import styles from './DeletionForm.module.css';

export const DeletionForm: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);

  const handleConfirm = () => {
    alert("Your account has been... just kidding! This is a parody. Your account is safe! 😄");
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.disclaimerSection}>
        <h2 className={styles.sectionTitle}>Before you go...</h2>

        <div className={styles.disclaimerCard}>
          <h3 className={styles.cardTitle}>⚠️ What happens when you delete your account?</h3>
          <ul className={styles.consequencesList}>
            <li>
              <span className={styles.bulletPoint}>•</span>
              <span>Your profile, photos, posts, videos, and everything else you've added will be permanently deleted. You won't be able to retrieve anything you've added.</span>
            </li>
            <li>
              <span className={styles.bulletPoint}>•</span>
              <span>You'll no longer be able to use services that require this account.</span>
            </li>
            <li>
              <span className={styles.bulletPoint}>•</span>
              <span>Your username will be released and could be claimed by anyone.</span>
            </li>
            <li>
              <span className={styles.bulletPoint}>•</span>
              <span>All your achievements, progress, and history will vanish into the digital void.</span>
            </li>
            <li>
              <span className={styles.bulletPoint}>•</span>
              <span>Any active subscriptions or purchases will be forfeited without refund.</span>
            </li>
          </ul>
        </div>

        <div className={styles.finalWarning}>
          <p className={styles.warningText}>
            <strong>This is your final warning.</strong> Once you click the button below,
            there's no going back. Your digital existence here will be erased forever.
          </p>
          <p className={styles.emphasisText}>
            Are you absolutely, positively, 100% certain you want to proceed?
          </p>
        </div>
      </div>

      <div
        className={styles.buttonWrapper}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isHovering && (
          <div className={styles.hoverWarning}>
            Think twice! 🤔
          </div>
        )}
        <ConfirmButton onClick={handleConfirm} />
      </div>
    </div>
  );
};