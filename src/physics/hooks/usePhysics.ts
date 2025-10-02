import { useRef, useEffect } from 'react';
import { physicsEngine } from '../PhysicsEngine';

export function usePhysicsLoop(updateFunction: (deltaTime: number) => void) {
  const objectId = useRef<string>(Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    physicsEngine.register(objectId.current, updateFunction);

    return () => {
      physicsEngine.unregister(objectId.current);
    };
  }, [updateFunction]);
}