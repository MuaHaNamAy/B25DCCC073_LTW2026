// ============================================================
// [BÀI 2 - mục 6] State của khu vực Mục tiêu điểm (lưu dạng chuỗi như ô nhập)
// ============================================================
import { createSlice } from '@reduxjs/toolkit';

const goalSlice = createSlice({
  name: 'goal',
  initialState: { teamId: '1', target: '10', remaining: '2' },
  reducers: {
    setTeamId: (state, action) => {
      state.teamId = action.payload;
    },
    setTarget: (state, action) => {
      state.target = action.payload;
    },
    setRemaining: (state, action) => {
      state.remaining = action.payload;
    },
  },
});

export const { setTeamId, setTarget, setRemaining } = goalSlice.actions;

export const selectGoal = (state) => state.goal;

export default goalSlice.reducer;
