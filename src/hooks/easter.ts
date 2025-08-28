import { useCallback, useRef } from 'react';

export function useTripleClick(callback: () => void, delay = 600) {
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      callback();
      clearTimeout(timerRef.current!);
      clickCountRef.current = 0;
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, delay);
    }
  }, [callback, delay]);

  return handleClick;
}
