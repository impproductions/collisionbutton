import { describe, test, expect } from 'bun:test';
import { calculateVelocity, calculateCollision } from './physics';
import type { MousePosition } from '../hooks/useMouseTracking';

describe('Physics calculations', () => {
  describe('calculateVelocity', () => {
    test('should return zero velocity for empty history', () => {
      const velocity = calculateVelocity([]);
      expect(velocity.vx).toBe(0);
      expect(velocity.vy).toBe(0);
      expect(velocity.speed).toBe(0);
      expect(velocity.angle).toBe(0);
    });

    test('should return zero velocity for single point', () => {
      const history: MousePosition[] = [{ x: 100, y: 100, time: 1000 }];
      const velocity = calculateVelocity(history);
      expect(velocity.vx).toBe(0);
      expect(velocity.vy).toBe(0);
      expect(velocity.speed).toBe(0);
      expect(velocity.angle).toBe(0);
    });

    test('should calculate horizontal velocity correctly', () => {
      const history: MousePosition[] = [
        { x: 100, y: 200, time: 1000 },
        { x: 110, y: 200, time: 1010 },
        { x: 120, y: 200, time: 1020 },
        { x: 130, y: 200, time: 1030 },
        { x: 140, y: 200, time: 1040 },
      ];

      const velocity = calculateVelocity(history);

      // Moving 40 pixels right in 40ms = 1000 px/s
      expect(velocity.vx).toBeCloseTo(1000, 0);
      expect(velocity.vy).toBe(0);
      expect(velocity.speed).toBeCloseTo(1000, 0);
      expect(velocity.angle).toBe(0); // Moving right = 0°
    });

    test('should calculate vertical velocity correctly', () => {
      const history: MousePosition[] = [
        { x: 200, y: 100, time: 1000 },
        { x: 200, y: 110, time: 1010 },
        { x: 200, y: 120, time: 1020 },
        { x: 200, y: 130, time: 1030 },
        { x: 200, y: 140, time: 1040 },
      ];

      const velocity = calculateVelocity(history);

      // Moving 40 pixels down in 40ms = 1000 px/s
      expect(velocity.vx).toBe(0);
      expect(velocity.vy).toBeCloseTo(1000, 0);
      expect(velocity.speed).toBeCloseTo(1000, 0);
      expect(velocity.angle).toBeCloseTo(90, 0); // Moving down = 90°
    });

    test('should calculate diagonal velocity correctly', () => {
      const history: MousePosition[] = [
        { x: 100, y: 100, time: 1000 },
        { x: 110, y: 110, time: 1010 },
        { x: 120, y: 120, time: 1020 },
        { x: 130, y: 130, time: 1030 },
        { x: 140, y: 140, time: 1040 },
      ];

      const velocity = calculateVelocity(history);

      // Moving 40 pixels in each direction over 40ms = 1000 px/s per axis
      expect(velocity.vx).toBeCloseTo(1000, 0);
      expect(velocity.vy).toBeCloseTo(1000, 0);
      // Speed = sqrt(1000² + 1000²) ≈ 1414 px/s
      expect(velocity.speed).toBeCloseTo(1414, 0);
      expect(velocity.angle).toBeCloseTo(45, 0); // 45° diagonal
    });

    test('should handle negative velocity (moving left/up)', () => {
      const history: MousePosition[] = [
        { x: 140, y: 140, time: 1000 },
        { x: 130, y: 130, time: 1010 },
        { x: 120, y: 120, time: 1020 },
        { x: 110, y: 110, time: 1030 },
        { x: 100, y: 100, time: 1040 },
      ];

      const velocity = calculateVelocity(history);

      // Moving 40 pixels left and up over 40ms = -1000 px/s per axis
      expect(velocity.vx).toBeCloseTo(-1000, 0);
      expect(velocity.vy).toBeCloseTo(-1000, 0);
      expect(velocity.speed).toBeCloseTo(1414, 0);
      expect(velocity.angle).toBeCloseTo(-135, 0); // Left-up diagonal
    });

    test('should use custom sample size', () => {
      const history: MousePosition[] = [
        { x: 100, y: 100, time: 1000 },
        { x: 105, y: 100, time: 1005 }, // Slow movement
        { x: 110, y: 100, time: 1010 },
        { x: 140, y: 100, time: 1020 }, // Fast movement
        { x: 170, y: 100, time: 1030 },
      ];

      // Using last 2 points (fast movement): 30px in 10ms = 3000 px/s
      const velocitySmallSample = calculateVelocity(history, 2);
      expect(velocitySmallSample.vx).toBeCloseTo(3000, 0);

      // Using all 5 points: 70px in 30ms ≈ 2333 px/s
      const velocityLargeSample = calculateVelocity(history, 5);
      expect(velocityLargeSample.vx).toBeCloseTo(2333, 0);
    });

    test('should return zero velocity when time difference is zero', () => {
      const history: MousePosition[] = [
        { x: 100, y: 100, time: 1000 },
        { x: 110, y: 110, time: 1000 }, // Same timestamp
      ];

      const velocity = calculateVelocity(history);
      expect(velocity.vx).toBe(0);
      expect(velocity.vy).toBe(0);
      expect(velocity.speed).toBe(0);
      expect(velocity.angle).toBe(0);
    });
  });

  describe('calculateCollision', () => {
    test('should calculate collision data correctly', () => {
      const history: MousePosition[] = [
        { x: 100, y: 100, time: 1000 },
        { x: 110, y: 110, time: 1010 },
        { x: 120, y: 120, time: 1020 },
        { x: 130, y: 130, time: 1030 },
        { x: 140, y: 140, time: 1040 },
      ];

      // Mock mouse event
      const mockEvent = {
        clientX: 250,
        clientY: 250,
      } as React.MouseEvent<HTMLElement>;

      // Mock element with getBoundingClientRect
      const mockElement = {
        getBoundingClientRect: () => ({
          left: 200,
          top: 200,
          right: 300,
          bottom: 260,
          width: 100,
          height: 60,
        }),
      } as HTMLElement;

      const collision = calculateCollision(history, mockEvent, mockElement);

      // Velocity should be calculated correctly
      expect(collision.velocity.vx).toBeCloseTo(1000, 0);
      expect(collision.velocity.vy).toBeCloseTo(1000, 0);
      expect(collision.velocity.speed).toBeCloseTo(1414, 0);
      expect(collision.velocity.angle).toBeCloseTo(45, 0);

      // Hit point should be relative to element
      expect(collision.hitPoint.x).toBe(50); // 250 - 200
      expect(collision.hitPoint.y).toBe(50); // 250 - 200
    });
  });
});