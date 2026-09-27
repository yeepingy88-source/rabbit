import { useEffect, useRef } from 'react';

const MAP = {
  ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};

export default function useKeyboard(inputRef, onDig) {
  const digRef = useRef(onDig);
  digRef.current = onDig;

  useEffect(() => {
    const keys = new Set();
    const apply = () => {
      let x = 0, y = 0;
      keys.forEach((k) => { x += MAP[k][0]; y += MAP[k][1]; });
      x = Math.sign(x); y = Math.sign(y);
      const l = Math.hypot(x, y) || 1;
      inputRef.current = { x: x / l, y: y / l };
    };
    const down = (e) => {
      if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) digRef.current(); return; }
      if (MAP[e.code]) { e.preventDefault(); keys.add(e.code); apply(); }
    };
    const up = (e) => { if (MAP[e.code]) { keys.delete(e.code); apply(); } };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [inputRef]);
}