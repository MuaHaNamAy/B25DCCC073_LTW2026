// ============================================================
// [BÀI 2 - mục 4] Store Redux
// [BÀI 3 - mục 2] preloadedState từ localStorage + store.subscribe để lưu
// ============================================================
import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './features/matchesSlice';
import goalReducer from './features/goalSlice';
import { loadSaved, saveMatches } from './storage';

const saved = loadSaved();

// Lần này đã có dữ liệu lưu chưa? (chưa có thì App mới nạp dữ liệu mẫu)
export const hasSaved = saved !== null;

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    goal: goalReducer,
  },
  preloadedState: {
    matches: saved ?? [],
  },
});

// Chỉ lưu khi mảng trận đấu đổi tham chiếu (đổi goal thì không lưu)
let lastMatches = store.getState().matches;
store.subscribe(() => {
  const current = store.getState().matches;
  if (current !== lastMatches) {
    lastMatches = current;
    saveMatches(current);
  }
});
