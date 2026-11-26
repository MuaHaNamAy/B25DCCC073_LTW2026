// ============================================================
// [BÀI 3 - mục 3] useDebounce(value, delay): trả về giá trị "trễ" delay ms
// ============================================================
import { useEffect, useState } from 'react';

export const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
