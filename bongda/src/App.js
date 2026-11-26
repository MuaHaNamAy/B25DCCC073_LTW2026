import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RESULT_LABELS, ROUNDS } from './data';
import { useFetch } from './hooks/useFetch';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { calcMatchStats, calcStandings, getResult, getTeamName } from './utils';
import GoalInput from './components/GoalInput';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = "bd-5918";

const App = () => {
  // [1.1] Tải dữ liệu mẫu
  const { data, loading, error } = useFetch('/data/matches.json');

  // [2.5] State trận đấu lấy từ Redux store (thay useReducer của Bài 1)
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();

  // [2.1, 2.2] Dùng Context
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  useEffect(() => {
    if (data) dispatch(setMatches(data));
  }, [data, dispatch]);

  // [1.7] Lọc vòng
  const [round, setRound] = useState('all');
  const visibleMatches = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );

  // [1.5] Bảng xếp hạng: luôn tính trên TẤT CẢ các trận
  const standings = useMemo(() => calcStandings(matches), [matches]);

  // [1.6] Thống kê
  const stats = useMemo(() => calcMatchStats(visibleMatches), [visibleMatches]);
  const leaderText = useMemo(() => {
    if (matches.length === 0) return '—';
    const leader = standings[0];
    return `${leader.name} (${leader.points} điểm)`;
  }, [matches, standings]);

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <header className="header">
        <h1>Giải bóng đá khoa</h1>
        {/* [2.1] Nút đổi chủ đề */}
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </header>

      <main className="layout">
        <section className="card">
          <h2>Bảng xếp hạng</h2>
          <StandingsTable standings={standings} />
        </section>

        <section className="card">
          <h2>Thống kê</h2>
          <p>Số trận: {stats.count}</p>
          <p>Tổng số bàn thắng: {stats.goals}</p>
          <p>Bàn thắng mỗi trận: {stats.average.toFixed(2)}</p>
          <p>Đội dẫn đầu: {leaderText}</p>
        </section>

        <section className="card wide">
          <h2>Lịch thi đấu</h2>
          <div className="toolbar">
            <label htmlFor="round-filter">Xem vòng</label>
            <select id="round-filter" value={round} onChange={(e) => setRound(e.target.value)}>
              <option value="all">Tất cả</option>
              {ROUNDS.map((r) => (
                <option key={r} value={String(r)}>{`Vòng ${r}`}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p>Đang tải lịch thi đấu...</p>
          ) : error ? (
            <p className="error">Không tải được lịch thi đấu</p>
          ) : matches.length === 0 ? (
            <p>Chưa có trận đấu nào</p>
          ) : (
            <table className="matches">
              <thead>
                <tr>
                  <th>Vòng</th>
                  <th>Đội nhà</th>
                  <th>BT nhà</th>
                  <th>BT khách</th>
                  <th>Đội khách</th>
                  <th>Kết quả</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {visibleMatches.map((m) => {
                  const homeName = getTeamName(m.home);
                  const awayName = getTeamName(m.away);
                  const result = getResult(m);
                  return (
                    <tr key={m.id} className={result === 'draw' ? 'draw' : undefined}>
                      <td>{m.round}</td>
                      <td>{homeName}</td>
                      <td>
                        <GoalInput
                          value={m.homeGoals}
                          label={`Bàn thắng nhà ${homeName} - ${awayName}`}
                          onValid={(n) =>
                            dispatch(setGoals({ id: m.id, homeGoals: n, awayGoals: m.awayGoals }))
                          }
                        />
                      </td>
                      <td>
                        <GoalInput
                          value={m.awayGoals}
                          label={`Bàn thắng khách ${homeName} - ${awayName}`}
                          onValid={(n) =>
                            dispatch(setGoals({ id: m.id, homeGoals: m.homeGoals, awayGoals: n }))
                          }
                        />
                      </td>
                      <td>{awayName}</td>
                      <td>{RESULT_LABELS[result]}</td>
                      <td>
                        <button type="button" onClick={() => handleRemove(m)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        {/* [2.5] Form tách thành AddMatchForm */}
        <section className="card">
          <h2>Thêm trận đấu</h2>
          <AddMatchForm />
        </section>

        {/* [2.6] Mục tiêu điểm */}
        <section className="card">
          <h2>Mục tiêu điểm</h2>
          <GoalPlanner standings={standings} />
        </section>
      </main>
    </div>
  );
};

export default App;
