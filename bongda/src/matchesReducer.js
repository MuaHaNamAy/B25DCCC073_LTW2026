// ============================================================
// [BÀI 1 - mục 3] Reducer cho mảng trận đấu (luôn trả về mảng MỚI)
// (Bài 2 sẽ xóa file này và chuyển sang Redux Toolkit)
// ============================================================

export const matchesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return [...action.payload];

    case 'ADD': {
      const maxId = state.reduce((max, m) => Math.max(max, m.id), 0);
      return [...state, { ...action.payload, id: maxId + 1 }];
    }

    case 'REMOVE':
      return state.filter((m) => m.id !== action.payload);

    case 'SET_GOALS': {
      const { id, homeGoals, awayGoals } = action.payload;
      return state.map((m) => (m.id === id ? { ...m, homeGoals, awayGoals } : m));
    }

    default:
      return state;
  }
};
