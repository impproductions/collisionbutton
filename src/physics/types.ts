export interface PhysicsState {
  position: { x: number; y: number };
  velocity: { vx: number; vy: number };
  mass: number;
  friction: number;
}

export type PhysicsUpdateFunction = (state: PhysicsState, deltaTime: number) => void;

export interface Impulse {
  vx: number;
  vy: number;
}