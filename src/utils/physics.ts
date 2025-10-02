import { type MousePosition } from "../hooks/useMouseTracking";

export interface Velocity {
  vx: number;  // velocity in x direction (px/s)
  vy: number;  // velocity in y direction (px/s)
  speed: number; // total speed (px/s)
  angle: number; // direction angle in degrees
}

export interface CollisionData {
  velocity: Velocity;
  hitPoint: {
    x: number;  // x position relative to button
    y: number;  // y position relative to button
  };
}

/**
 * Calculate velocity from mouse position history
 * @param history Array of mouse positions with timestamps
 * @param sampleSize Number of recent points to use for calculation
 * @returns Velocity object with speed and direction
 */
export function calculateVelocity(history: MousePosition[], sampleSize: number = 5): Velocity {
  if (history.length < 2) {
    return { vx: 0, vy: 0, speed: 0, angle: 0 };
  }

  // Use last N points for smoothing
  const recent = history.slice(-sampleSize);
  if (recent.length < 2) {
    return { vx: 0, vy: 0, speed: 0, angle: 0 };
  }

  const first = recent[0];
  const last = recent[recent.length - 1];
  const timeDiff = (last.time - first.time) / 1000; // Convert to seconds

  if (timeDiff === 0) {
    return { vx: 0, vy: 0, speed: 0, angle: 0 };
  }

  const vx = (last.x - first.x) / timeDiff;
  const vy = (last.y - first.y) / timeDiff;
  const speed = Math.sqrt(vx * vx + vy * vy);
  const angle = Math.atan2(vy, vx) * (180 / Math.PI);

  return { vx, vy, speed, angle };
}

/**
 * Calculate collision data when mouse enters an element
 * @param mouseHistory History of mouse positions
 * @param mouseEvent The mouse enter event
 * @param element The element that was entered
 * @returns Collision data including velocity and hit point
 */
export function calculateCollision(
  mouseHistory: MousePosition[],
  mouseEvent: React.MouseEvent<HTMLElement>,
  element: HTMLElement
): CollisionData {
  const velocity = calculateVelocity(mouseHistory);
  const rect = element.getBoundingClientRect();

  const hitPoint = {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };

  return {
    velocity,
    hitPoint
  };
}