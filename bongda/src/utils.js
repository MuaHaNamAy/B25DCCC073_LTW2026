// ============================================================
// [BÀI 1 - mục 2] Hàm tiện ích thuần (không đụng tới state)
// ============================================================
import { TEAMS, POINTS, MAX_GOALS } from './data';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === Number(id));
  return team ? team.name : '';
};

// "home" | "draw" | "away"
export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) return 'home';
  if (match.homeGoals < match.awayGoals) return 'away';
  return 'draw';
};

// Số nguyên từ 0 đến MAX_GOALS
export const isValidGoals = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

// Đổi giá trị ô nhập (chuỗi) sang số; ô trống -> NaN (Number('') = 0 nên phải xét riêng)
export const toNumber = (value) => (String(value).trim() === '' ? NaN : Number(value));

const emptyRow = (team) => ({
  id: team.id,
  name: team.name,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  gf: 0,
  ga: 0,
  diff: 0,
  points: 0,
});

// Cộng kết quả một trận vào một dòng, trả về dòng MỚI
const addResult = (row, scored, conceded) => {
  const won = scored > conceded ? 1 : 0;
  const drawn = scored === conceded ? 1 : 0;
  const lost = scored < conceded ? 1 : 0;
  return {
    ...row,
    played: row.played + 1,
    won: row.won + won,
    drawn: row.drawn + drawn,
    lost: row.lost + lost,
    gf: row.gf + scored,
    ga: row.ga + conceded,
    points: row.points + won * POINTS.win + drawn * POINTS.draw + lost * POINTS.loss,
  };
};

// Bảng xếp hạng: luôn đủ 6 đội, sắp xếp trên mảng mới
export const calcStandings = (matches) => {
  const rows = matches.reduce(
    (acc, m) =>
      acc.map((row) => {
        if (row.id === m.home) return addResult(row, m.homeGoals, m.awayGoals);
        if (row.id === m.away) return addResult(row, m.awayGoals, m.homeGoals);
        return row;
      }),
    TEAMS.map(emptyRow)
  );

  return rows
    .map((row) => ({ ...row, diff: row.gf - row.ga }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.diff - a.diff ||
        b.gf - a.gf ||
        a.name.localeCompare(b.name, 'vi')
    );
};

// Thống kê: { count, goals, average, counts: { home, draw, away } }
export const calcMatchStats = (matches) => {
  const count = matches.length;
  const goals = matches.reduce((sum, m) => sum + m.homeGoals + m.awayGoals, 0);
  const average = count > 0 ? Math.round((goals / count) * 100) / 100 : 0;
  const counts = matches.reduce(
    (acc, m) => {
      const result = getResult(m);
      return { ...acc, [result]: acc[result] + 1 };
    },
    { home: 0, draw: 0, away: 0 }
  );
  return { count, goals, average, counts };
};

// Kiểm tra form thêm trận, trả về object lỗi (rỗng nếu hợp lệ)
export const validateMatchForm = (form, matches) => {
  const errors = {};
  const home = Number(form.home);
  const away = Number(form.away);

  if (!form.home) errors.home = 'Hãy chọn đội nhà';

  if (!form.away) {
    errors.away = 'Hãy chọn đội khách';
  } else if (form.home && home === away) {
    errors.away = 'Hai đội phải khác nhau';
  } else if (
    form.home &&
    matches.some(
      (m) => (m.home === home && m.away === away) || (m.home === away && m.away === home)
    )
  ) {
    errors.away = 'Hai đội đã đá với nhau rồi';
  }

  const goalsMsg = `Số bàn thắng phải là số nguyên từ 0 đến ${MAX_GOALS}`;
  if (!isValidGoals(toNumber(form.homeGoals))) errors.homeGoals = goalsMsg;
  if (!isValidGoals(toNumber(form.awayGoals))) errors.awayGoals = goalsMsg;

  return errors;
};
