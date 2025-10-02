import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test';
import { physicsEngine } from './PhysicsEngine';
import type { PhysicsState } from './types';

describe('PhysicsEngine', () => {
  beforeEach(() => {
    // Mock browser APIs for testing
    global.performance = { now: () => Date.now() } as any;
    global.requestAnimationFrame = mock((callback: FrameRequestCallback) => {
      setTimeout(() => callback(performance.now()), 16); // ~60fps
      return 1;
    });
    global.cancelAnimationFrame = mock(() => {});
  });

  afterEach(() => {
    // Clean up any registered objects
    ['test1', 'test2', 'test3'].forEach(id => {
      try {
        physicsEngine.unregister(id);
      } catch (e) {
        // Ignore if already unregistered
      }
    });
  });
  test('should register and manage physics objects', () => {
    const updateFn = mock(() => {});
    const initialState: PhysicsState = {
      position: { x: 0, y: 0 },
      velocity: { vx: 0, vy: 0 },
      mass: 1.0,
      friction: 0.95
    };

    physicsEngine.register('test1', initialState, updateFn);

    const state = physicsEngine.getState('test1');
    expect(state).toBeTruthy();
    expect(state!.position.x).toBe(0);
    expect(state!.position.y).toBe(0);

    physicsEngine.unregister('test1');
    expect(physicsEngine.getState('test1')).toBeUndefined();
  });

  test('should apply impulse to objects', () => {
    const updateFn = mock(() => {});
    const initialState: PhysicsState = {
      position: { x: 0, y: 0 },
      velocity: { vx: 0, vy: 0 },
      mass: 2.0, // Higher mass = less velocity change
      friction: 0.95
    };

    physicsEngine.register('test2', initialState, updateFn);

    // Apply impulse
    physicsEngine.applyImpulse('test2', { vx: 1000, vy: 500 });

    const state = physicsEngine.getState('test2');
    expect(state!.velocity.vx).toBe(500); // 1000 / 2.0 mass
    expect(state!.velocity.vy).toBe(250); // 500 / 2.0 mass

    physicsEngine.unregister('test2');
  });

  test('should handle physics calculations correctly', () => {
    // Synchronous test - check state directly without timing
    const updateFn = mock(() => {});
    const initialState: PhysicsState = {
      position: { x: 0, y: 0 },
      velocity: { vx: 0, vy: 0 },
      mass: 1.0,
      friction: 0.95
    };

    physicsEngine.register('test3', initialState, updateFn);

    // Apply impulse to start movement
    physicsEngine.applyImpulse('test3', { vx: 100, vy: 50 });

    // Check that velocity was applied correctly
    const state = physicsEngine.getState('test3');
    expect(state!.velocity.vx).toBe(100); // 100 / 1.0 mass
    expect(state!.velocity.vy).toBe(50);  // 50 / 1.0 mass

    physicsEngine.unregister('test3');
  });
});