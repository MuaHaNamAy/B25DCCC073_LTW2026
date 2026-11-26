// ============================================================
// [BÀI 3 - mục 2] Lưu lịch thi đấu vào localStorage
// ============================================================
const MATCHES_KEY = 'ltw_bongda_matches';

// Trả về mảng đã lưu, hoặc null nếu chưa có / dữ liệu hỏng
export const loadSaved = () => {
  try {
    const raw = window.localStorage.getItem(MATCHES_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    window.localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch (err) {
    // Bỏ qua khi không ghi được
  }
};
