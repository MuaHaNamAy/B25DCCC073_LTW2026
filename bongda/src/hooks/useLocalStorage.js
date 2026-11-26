// ============================================================
// [BÀI 3 - mục 1] useLocalStorage(key, initialValue): dùng như useState
// ============================================================
import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Lazy initializer: chỉ đọc localStorage một lần khi mount
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch (err) {
      return initialValue; // JSON hỏng hoặc không truy cập được localStorage
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Bỏ qua khi không ghi được (hết dung lượng, chế độ riêng tư...)
    }
  }, [key, value]);

  return [value, setValue];
};
