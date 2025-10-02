type UpdateFunction = (deltaTime: number) => void;

class PhysicsEngine {
  private updateFunctions: Map<string, UpdateFunction> = new Map();
  private isRunning: boolean = false;
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;

  register(id: string, updateFn: UpdateFunction): void {
    this.updateFunctions.set(id, updateFn);

    if (!this.isRunning) {
      this.start();
    }
  }

  unregister(id: string): void {
    this.updateFunctions.delete(id);

    if (this.updateFunctions.size === 0) {
      this.stop();
    }
  }

  private start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.update.bind(this));
  }

  private stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private update(currentTime: number): void {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = currentTime;

    // Call all registered update functions with deltaTime
    for (const updateFn of this.updateFunctions.values()) {
      updateFn(deltaTime);
    }

    this.animationFrameId = requestAnimationFrame(this.update.bind(this));
  }
}

// Singleton instance
export const physicsEngine = new PhysicsEngine();