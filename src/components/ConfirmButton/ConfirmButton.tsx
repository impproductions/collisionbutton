import React, { useRef, useCallback } from 'react';
import { useMouseTracking } from '../../hooks/useMouseTracking';
import { calculateCollision } from '../../utils/physics';
import { usePhysicsLoop } from '../../physics/hooks/usePhysics';
import styles from './ConfirmButton.module.css';

interface ConfirmButtonProps {
  onClick: () => void;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { getMouseHistory } = useMouseTracking();

  // Button's own physics state
  const position = useRef({ x: 0, y: 0 });
  const velocity = useRef({ vx: 0, vy: 0 });
  const mass = 0.01;

  // Button's update function - handles its own movement logic
  const updateFunction = useCallback((deltaTime: number) => {
    // Update position based on velocity
    position.current.x += velocity.current.vx * deltaTime;
    position.current.y += velocity.current.vy * deltaTime;

    // Stop very small velocities
    const minVelocity = 0.1;
    if (Math.abs(velocity.current.vx) < minVelocity) velocity.current.vx = 0;
    if (Math.abs(velocity.current.vy) < minVelocity) velocity.current.vy = 0;

    // Update DOM element
    if (buttonRef.current) {
      buttonRef.current.style.transform =
        `translate(${position.current.x}px, ${position.current.y}px)`;
    }
  }, []);

  // Register with physics loop
  usePhysicsLoop(updateFunction);

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

    // Apply collision impulse to button - transfer mouse velocity
    velocity.current.vx += collision.velocity.vx / mass;
    velocity.current.vy += collision.velocity.vy / mass;
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