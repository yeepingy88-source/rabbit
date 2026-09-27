import { useEffect, useRef } from 'react';

const KEY_ACTIONS = {
  KeyW: 'UP',
  ArrowUp: 'UP',
  w: 'UP',
  W: 'UP',
  KeyS: 'DOWN',
  ArrowDown: 'DOWN',
  s: 'DOWN',
  S: 'DOWN',
  KeyA: 'LEFT',
  ArrowLeft: 'LEFT',
  a: 'LEFT',
  A: 'LEFT',
  KeyD: 'RIGHT',
  ArrowRight: 'RIGHT',
  d: 'RIGHT',
  D: 'RIGHT',
};

const DIRS = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

export default function useKeyboard(inputRef, onDig) {
  const digRef = useRef(onDig);
  digRef.current = onDig;

  useEffect(() => {
    const activeActions = new Set();

    const apply = () => {
      let x = 0, y = 0;
      if (activeActions.has('UP')) y -= 1;
      if (activeActions.has('DOWN')) y += 1;
      if (activeActions.has('LEFT')) x -= 1;
      if (activeActions.has('RIGHT')) x += 1;

      if (x === 0 && y === 0) {
        inputRef.current = { x: 0, y: 0 };
        return;
      }
      const l = Math.hypot(x, y) || 1;
      inputRef.current = { x: x / l, y: y / l };
    };

    const isSpace = (e) => e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';

    const down = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (isSpace(e)) {
        e.preventDefault();
        if (!e.repeat) {
          digRef.current?.();
        }
        return;
      }
      const action = KEY_ACTIONS[e.code] || KEY_ACTIONS[e.key];
      if (action) {
        e.preventDefault();
        activeActions.add(action);
        apply();
      }
    };

    const up = (e) => {
      if (isSpace(e)) {
        e.preventDefault();
        return;
      }
      const action = KEY_ACTIONS[e.code] || KEY_ACTIONS[e.key];
      if (action) {
        activeActions.delete(action);
        apply();
      }
    };

    const reset = () => {
      activeActions.clear();
      inputRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', reset);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', reset);
    };
  }, [inputRef]);
}

