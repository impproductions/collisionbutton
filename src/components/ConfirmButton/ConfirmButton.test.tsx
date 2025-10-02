import { describe, test, expect, beforeEach } from 'bun:test';

describe('ConfirmButton velocity tracking', () => {
  let mouseHistory: Array<{ x: number; y: number; time: number }> = [];
  let currentTime = 1000;

  beforeEach(() => {
    mouseHistory = [];
    currentTime = 1000;
  });

  // Simulate the calculateVelocity function logic
  const calculateVelocity = () => {
    if (mouseHistory.length < 2) return { x: 0, y: 0, speed: 0 };

    const recent = mouseHistory.slice(-5);
    if (recent.length < 2) return { x: 0, y: 0, speed: 0 };

    const first = recent[0];
    const last = recent[recent.length - 1];
    const timeDiff = (last.time - first.time) / 1000;

    if (timeDiff === 0) return { x: 0, y: 0, speed: 0 };

    const vx = (last.x - first.x) / timeDiff;
    const vy = (last.y - first.y) / timeDiff;
    const speed = Math.sqrt(vx * vx + vy * vy);

    return { x: vx, y: vy, speed };
  };

  test('should return zero velocity when mouseHistory is empty', () => {
    const velocity = calculateVelocity();
    expect(velocity.speed).toBe(0);
    expect(velocity.x).toBe(0);
    expect(velocity.y).toBe(0);
  });

  test('should return zero velocity with only one history point', () => {
    mouseHistory = [{ x: 100, y: 100, time: currentTime }];
    const velocity = calculateVelocity();
    expect(velocity.speed).toBe(0);
  });

  test('should calculate correct velocity for horizontal movement', () => {
    mouseHistory = [
      { x: 100, y: 200, time: 1000 },
      { x: 110, y: 200, time: 1010 },
      { x: 120, y: 200, time: 1020 },
      { x: 130, y: 200, time: 1030 },
      { x: 140, y: 200, time: 1040 },
    ];
    const velocity = calculateVelocity();

    // Moving 40 pixels in 40ms = 1000 px/s
    expect(velocity.x).toBeCloseTo(1000, 0);
    expect(velocity.y).toBe(0);
    expect(velocity.speed).toBeCloseTo(1000, 0);
  });

  test('should calculate correct velocity for diagonal movement', () => {
    mouseHistory = [
      { x: 100, y: 100, time: 1000 },
      { x: 110, y: 110, time: 1010 },
      { x: 120, y: 120, time: 1020 },
      { x: 130, y: 130, time: 1030 },
      { x: 140, y: 140, time: 1040 },
    ];
    const velocity = calculateVelocity();

    // Moving 40 pixels in each direction over 40ms
    expect(velocity.x).toBeCloseTo(1000, 0);
    expect(velocity.y).toBeCloseTo(1000, 0);
    // Speed = sqrt(1000^2 + 1000^2) = ~1414 px/s
    expect(velocity.speed).toBeCloseTo(1414, 0);
  });

  test('BUG: velocity is zero on mouseEnter - likely because history is cleared or not populated yet', () => {
    // Simulating what happens on mouseEnter
    // 1. Container mouseEnter triggers, clearing history
    mouseHistory = [];

    // 2. Button mouseEnter fires immediately after
    // 3. calculateVelocity is called with empty or insufficient history
    const velocity = calculateVelocity();

    // This test demonstrates the bug
    expect(velocity.speed).toBe(0); // This is what's happening
    console.log('❌ BUG CONFIRMED: Velocity is 0 because mouseHistory is empty when button mouseEnter fires');
  });

  test('EXPECTED: velocity should be non-zero when mouse is moving and enters button', () => {
    // What we want to happen:
    // Mouse is moving and we have history BEFORE the button mouseEnter fires

    // Simulate mouse moving toward button
    mouseHistory = [
      { x: 50, y: 50, time: 950 },
      { x: 60, y: 50, time: 960 },
      { x: 70, y: 50, time: 970 },
      { x: 80, y: 50, time: 980 },
      { x: 90, y: 50, time: 990 },
      { x: 100, y: 50, time: 1000 }, // Enters button boundary here
    ];

    const velocity = calculateVelocity();

    // Moving 50 pixels in 50ms = 1000 px/s
    expect(velocity.speed).toBeGreaterThan(0);
    expect(velocity.x).toBeCloseTo(1000, 0);
    console.log('✅ EXPECTED: With proper history, velocity is calculated correctly:', velocity);
  });
});