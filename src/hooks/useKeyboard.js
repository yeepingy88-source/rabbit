import { useEffect, useRef } from 'react';

const CODE_MAP = {
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
};

const KEY_MAP = {
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
  arrowup: [0, -1],
  arrowdown: [0, 1],
  arrowleft: [-1, 0],
  arrowright: [1, 0],
};

export default function useKeyboard(inputRef, onDig) {
  const digRef = useRef(onDig);
  digRef.current = onDig;

  useEffect(() => {
    const keys = new Set();

    const apply = () => {
      let x = 0, y = 0;
      keys.forEach((dir) => {
        x += dir[0];
        y += dir[1];
      });
      x = Math.sign(x);
      y = Math.sign(y);
      const l = Math.hypot(x, y) || 1;
      inputRef.current = { x: x / l, y: y / l };
    };

    const getDir = (e) => CODE_MAP[e.code] || KEY_MAP[e.key?.toLowerCase()];

    const isSpace = (e) => e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';

    const down = (e) => {
      if (isSpace(e)) {
        e.preventDefault();
        if (!e.repeat) {
          digRef.current?.();
        }
        return;
      }
      const dir = getDir(e);
      if (dir) {
        e.preventDefault();
        keys.add(dir);
        apply();
      }
    };

    const up = (e) => {
      if (isSpace(e)) {
        e.preventDefault();
        return;
      }
      const dir = getDir(e);
      if (dir) {
        keys.delete(dir);
        apply();
      }
    };

    const blur = () => {
      keys.clear();
      inputRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [inputRef]);
}
