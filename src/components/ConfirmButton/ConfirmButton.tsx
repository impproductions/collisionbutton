import React, { useState } from 'react';
import styles from './ConfirmButton.module.css';

interface ConfirmButtonProps {
  onClick: () => void;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);
    setIsPressed(true);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
      setIsPressed(false);
    }, 600);

    setTimeout(() => {
      onClick();
    }, 300);
  };

  return (
    <div className={styles.buttonContainer}>
      <button
        className={`${styles.confirmButton} ${isPressed ? styles.pressed : ''}`}
        onClick={handleClick}
        aria-label="Delete account permanently"
      >
        <span className={styles.buttonIcon}>⚠️</span>
        <span className={styles.buttonText}>Delete My Account Forever</span>

        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}
      </button>

      <p className={styles.finalText}>
        Once clicked, there's no turning back
      </p>
    </div>
  );
};