// ============================================================
// [BÀI 2 - mục 2] Thông báo bằng Context
// Giá trị context CHỈ là hàm showNotice (ổn định nhờ useCallback([])),
// nội dung thông báo là state riêng của Provider -> component gọi useNotice()
// không bị render lại khi thông báo đổi.
// ============================================================
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const NoticeContext = createContext(undefined);

const NOTICE_DURATION = 3000;

export const NoticeProvider = ({ children }) => {
  // Mỗi lần gọi showNotice tạo object mới -> useEffect chạy lại -> đếm lại 3 giây
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((text) => {
    setNotice({ text });
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), NOTICE_DURATION);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      {notice && (
        <div role="status" className="notice">
          {notice.text}
        </div>
      )}
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const showNotice = useContext(NoticeContext);
  if (showNotice === undefined) {
    throw new Error('useNotice phải dùng bên trong NoticeProvider');
  }
  return showNotice;
};
