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