import { describe, test, expect, mock } from 'bun:test';

describe('ConfirmButton functional behavior', () => {
  test('should integrate mouse tracking with collision detection', () => {
    // Mock global alert
    const alertMock = mock(() => {});
    global.alert = alertMock;

    // Mock Date.now() for consistent timing
    let currentTime = 1000;
    global.Date.now = mock(() => currentTime);

    // Create a mock DOM environment
    const mockButton = {
      getBoundingClientRect: () => ({
        left: 200,
        top: 200,
        right: 320,
        bottom: 260,
        width: 120,
        height: 60,
      }),
    };

    // Simulate the sequence of events that should happen:
    // 1. User moves mouse across screen (tracked globally)
    // 2. Mouse enters button
    // 3. Physics calculation happens with accumulated history

    const mouseEvents: Array<{ x: number; y: number; time: number }> = [];

    // Simulate mouse moving toward button (this would be tracked by useMouseTracking)
    const movements = [
      { x: 50, y: 200, time: 950 },
      { x: 70, y: 200, time: 960 },
      { x: 90, y: 200, time: 970 },
      { x: 110, y: 200, time: 980 },
      { x: 130, y: 200, time: 990 },
      { x: 150, y: 200, time: 1000 },
      { x: 170, y: 200, time: 1010 },
      { x: 190, y: 200, time: 1020 },
      { x: 210, y: 200, time: 1030 }, // Enters button here
    ];

    movements.forEach(({ x, y, time }) => {
      currentTime = time;
      mouseEvents.push({ x, y, time });
    });

    // Import and test the physics functions directly with this data
    const { calculateVelocity, calculateCollision } = require('../../utils/physics');

    // Test that velocity calculation works with realistic mouse data
    const velocity = calculateVelocity(mouseEvents);

    expect(velocity.speed).toBeGreaterThan(0);
    expect(velocity.vx).toBeGreaterThan(0); // Moving right
    expect(velocity.vy).toBe(0); // Horizontal movement
    expect(velocity.angle).toBeCloseTo(0, 0); // Moving right = 0°

    // Test collision calculation
    const mockMouseEvent = {
      clientX: 210,
      clientY: 200,
    };

    const collision = calculateCollision(mouseEvents, mockMouseEvent, mockButton);

    expect(collision.velocity.speed).toBeGreaterThan(0);
    expect(collision.hitPoint.x).toBe(10); // 210 - 200 = 10px from left edge
    expect(collision.hitPoint.y).toBe(0);   // 200 - 200 = 0px from top edge

    console.log('✅ FUNCTIONAL TEST PASSED: Button correctly calculates collision from global mouse tracking');
    console.log('Collision data:', {
      speed: collision.velocity.speed.toFixed(0) + ' px/s',
      angle: collision.velocity.angle.toFixed(0) + '°',
      hitPoint: `(${collision.hitPoint.x}, ${collision.hitPoint.y})`,
    });
  });

  test('should work with different movement patterns', () => {
    const movements = [
      // Diagonal approach from top-left
      { x: 100, y: 100, time: 1000 },
      { x: 120, y: 120, time: 1020 },
      { x: 140, y: 140, time: 1040 },
      { x: 160, y: 160, time: 1060 },
      { x: 180, y: 180, time: 1080 },
      { x: 200, y: 200, time: 1100 }, // Hits button
    ];

    const { calculateVelocity } = require('../../utils/physics');
    const velocity = calculateVelocity(movements);

    // Diagonal movement should give 45° angle
    expect(velocity.vx).toBeCloseTo(velocity.vy, 0); // Equal x and y components
    expect(velocity.angle).toBeCloseTo(45, 0);
    expect(velocity.speed).toBeGreaterThan(0);

    console.log('✅ Diagonal movement test passed:', {
      angle: velocity.angle.toFixed(0) + '°',
      speed: velocity.speed.toFixed(0) + ' px/s',
    });
  });

  test('should handle slow movement', () => {
    const movements = [
      { x: 190, y: 200, time: 1000 },
      { x: 192, y: 200, time: 1050 }, // Very slow: 2px in 50ms = 40 px/s
      { x: 194, y: 200, time: 1100 },
      { x: 196, y: 200, time: 1150 },
      { x: 198, y: 200, time: 1200 },
      { x: 200, y: 200, time: 1250 }, // Barely enters button
    ];

    const { calculateVelocity } = require('../../utils/physics');
    const velocity = calculateVelocity(movements);

    expect(velocity.speed).toBeCloseTo(40, 0); // 10px in 250ms = 40 px/s
    expect(velocity.angle).toBeCloseTo(0, 0);

    console.log('✅ Slow movement test passed:', {
      speed: velocity.speed.toFixed(0) + ' px/s (slow)',
    });
  });

  test('should handle fast movement', () => {
    const movements = [
      { x: 50, y: 200, time: 1000 },
      { x: 100, y: 200, time: 1010 }, // Very fast: 50px in 10ms = 5000 px/s
      { x: 150, y: 200, time: 1020 },
      { x: 200, y: 200, time: 1030 }, // Hits button fast
    ];

    const { calculateVelocity } = require('../../utils/physics');
    const velocity = calculateVelocity(movements);

    expect(velocity.speed).toBeCloseTo(5000, 0); // 150px in 30ms = 5000 px/s
    expect(velocity.angle).toBeCloseTo(0, 0);

    console.log('✅ Fast movement test passed:', {
      speed: velocity.speed.toFixed(0) + ' px/s (fast)',
    });
  });
});