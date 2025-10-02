import React, { useRef } from 'react';
import { useMouseTracking } from '../../hooks/useMouseTracking';
import { calculateCollision } from '../../utils/physics';
import styles from './ConfirmButton.module.css';

interface ConfirmButtonProps {
  onClick: () => void;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { getMouseHistory } = useMouseTracking();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const mouseHistory = getMouseHistory();
    const collision = calculateCollision(mouseHistory, e, button);

    console.log(
      `Button hit!\n` +
      `Velocity: ${collision.velocity.speed.toFixed(0)} px/s\n` +
      `Direction: ${collision.velocity.angle.toFixed(0)}°\n` +
      `Hit position: (${collision.hitPoint.x.toFixed(0)}, ${collision.hitPoint.y.toFixed(0)})`
    );
  };

  return (
    <div className={styles.buttonContainer}>
      <button
        ref={buttonRef}
        className={styles.confirmButton}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
        aria-label="Delete account permanently"
      >
        <span className={styles.buttonIcon}>⚠️</span>
        <span className={styles.buttonText}>Delete My Account Forever</span>
      </button>

      <p className={styles.finalText}>
        Once clicked, there's no turning back
      </p>
    </div>
  );
};