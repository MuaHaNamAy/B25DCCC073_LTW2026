// ============================================================
// [BÀI 2 - mục 4] State trận đấu bằng Redux Toolkit (thay matchesReducer của Bài 1)
// ============================================================
import { createSlice } from '@reduxjs/toolkit';

const matchesSlice = createSlice({
  name: 'matches',
  initialState: [],
  reducers: {
    // Thay cả mảng -> trả về mảng mới
    setMatches: (state, action) => [...action.payload],

    // Thêm vào cuối, id = id lớn nhất + 1 (Immer cho phép push)
    addMatch: (state, action) => {
      const maxId = state.reduce((max, m) => Math.max(max, m.id), 0);
      state.push({ ...action.payload, id: maxId + 1 });
    },

    // Xóa theo id -> trả về mảng mới
    removeMatch: (state, action) => state.filter((m) => m.id !== action.payload),

    // Đổi tỷ số; payload { id, homeGoals, awayGoals }
    setGoals: (state, action) => {
      const { id, homeGoals, awayGoals } = action.payload;
      const match = state.find((m) => m.id === id);
      if (match) {
        match.homeGoals = homeGoals;
        match.awayGoals = awayGoals;
      }
    },
  },
});

export const { setMatches, addMatch, removeMatch, setGoals } = matchesSlice.actions;

export const selectMatches = (state) => state.matches;

export default matchesSlice.reducer;
