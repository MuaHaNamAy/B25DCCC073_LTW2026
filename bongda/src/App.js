import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { MAX_GOALS, RESULT_LABELS, ROUNDS, TEAMS, formatDiff } from './data';
import { useFetch } from './hooks/useFetch';
import { matchesReducer } from './matchesReducer';
import { calcMatchStats, calcStandings, getResult, getTeamName, toNumber, validateMatchForm } from './utils';
import GoalInput from './components/GoalInput';

const BUILD_TAG = "bd-5918";

const EMPTY_FORM = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

const App = () => {
  // [BÀI 1 - mục 1] Tải dữ liệu mẫu
  const { data, loading, error } = useFetch('/data/matches.json');

  // [BÀI 1 - mục 3] State trận đấu bằng useReducer
  const [matches, dispatch] = useReducer(matchesReducer, []);

  useEffect(() => {
    if (data) dispatch({ type: 'LOAD', payload: data });
  }, [data]);

  // [BÀI 1 - mục 7] Lọc vòng
  const [round, setRound] = useState('all');
  const visibleMatches = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );

  // [BÀI 1 - mục 5] Bảng xếp hạng: luôn tính trên TẤT CẢ các trận
  const standings = useMemo(() => calcStandings(matches), [matches]);

  // [BÀI 1 - mục 6] Thống kê: 3 dòng đầu theo vòng đang xem
  const stats = useMemo(() => calcMatchStats(visibleMatches), [visibleMatches]);
  const leaderText = useMemo(() => {
    if (matches.length === 0) return '—';
    const leader = standings[0];
    return `${leader.name} (${leader.points} điểm)`;
  }, [matches, standings]);

  // [BÀI 1 - mục 8] Form thêm trận (controlled) + useRef để focus ô Đội nhà
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateMatchForm(form, matches);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(form.round),
        home: Number(form.home),
        away: Number(form.away),
        homeGoals: toNumber(form.homeGoals),
        awayGoals: toNumber(form.awayGoals),
      },
    });
    setForm(EMPTY_FORM);
    homeRef.current.focus();
  };

  return (
    <div className="app" data-build={BUILD_TAG}>
      <header className="header">
        <h1>Giải bóng đá khoa</h1>
      </header>

      <main className="layout">
        {/* [BÀI 1 - mục 5] Bảng xếp hạng */}
        <section className="card">
          <h2>Bảng xếp hạng</h2>
          <table className="standings">
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Đội</th>
                <th>Trận</th>
                <th>Thắng</th>
                <th>Hòa</th>
                <th>Thua</th>
                <th>BT</th>
                <th>BB</th>
                <th>HS</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, index) => (
                <tr key={row.id} className={index === standings.length - 1 ? 'last' : undefined}>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.played}</td>
                  <td>{row.won}</td>
                  <td>{row.drawn}</td>
                  <td>{row.lost}</td>
                  <td>{row.gf}</td>
                  <td>{row.ga}</td>
                  <td>{formatDiff(row.diff)}</td>
                  <td>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* [BÀI 1 - mục 6] Thống kê */}
        <section className="card">
          <h2>Thống kê</h2>
          <p>Số trận: {stats.count}</p>
          <p>Tổng số bàn thắng: {stats.goals}</p>
          <p>Bàn thắng mỗi trận: {stats.average.toFixed(2)}</p>
          <p>Đội dẫn đầu: {leaderText}</p>
        </section>

        {/* [BÀI 1 - mục 4, 7, 9] Lịch thi đấu */}
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
                            dispatch({
                              type: 'SET_GOALS',
                              payload: { id: m.id, homeGoals: n, awayGoals: m.awayGoals },
                            })
                          }
                        />
                      </td>
                      <td>
                        <GoalInput
                          value={m.awayGoals}
                          label={`Bàn thắng khách ${homeName} - ${awayName}`}
                          onValid={(n) =>
                            dispatch({
                              type: 'SET_GOALS',
                              payload: { id: m.id, homeGoals: m.homeGoals, awayGoals: n },
                            })
                          }
                        />
                      </td>
                      <td>{awayName}</td>
                      <td>{RESULT_LABELS[result]}</td>
                      <td>
                        {/* [BÀI 1 - mục 9] Xóa trận */}
                        <button type="button" onClick={() => dispatch({ type: 'REMOVE', payload: m.id })}>
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

        {/* [BÀI 1 - mục 8] Thêm trận đấu */}
        <section className="card">
          <h2>Thêm trận đấu</h2>
          <form className="match-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="add-round">Vòng</label>
              <select id="add-round" name="round" value={form.round} onChange={handleFormChange}>
                {ROUNDS.map((r) => (
                  <option key={r} value={String(r)}>{r}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="add-home">Đội nhà</label>
              <select id="add-home" name="home" ref={homeRef} value={form.home} onChange={handleFormChange}>
                <option value="">-- Chọn đội --</option>
                {TEAMS.map((t) => (
                  <option key={t.id} value={String(t.id)}>{t.name}</option>
                ))}
              </select>
              {errors.home && <p role="alert" className="error">{errors.home}</p>}
            </div>

            <div className="field">
              <label htmlFor="add-away">Đội khách</label>
              <select id="add-away" name="away" value={form.away} onChange={handleFormChange}>
                <option value="">-- Chọn đội --</option>
                {TEAMS.map((t) => (
                  <option key={t.id} value={String(t.id)}>{t.name}</option>
                ))}
              </select>
              {errors.away && <p role="alert" className="error">{errors.away}</p>}
            </div>

            <div className="field">
              <label htmlFor="add-home-goals">Bàn thắng đội nhà</label>
              <input
                id="add-home-goals"
                name="homeGoals"
                type="number"
                min="0"
                max={MAX_GOALS}
                value={form.homeGoals}
                onChange={handleFormChange}
              />
              {errors.homeGoals && <p role="alert" className="error">{errors.homeGoals}</p>}
            </div>

            <div className="field">
              <label htmlFor="add-away-goals">Bàn thắng đội khách</label>
              <input
                id="add-away-goals"
                name="awayGoals"
                type="number"
                min="0"
                max={MAX_GOALS}
                value={form.awayGoals}
                onChange={handleFormChange}
              />
              {errors.awayGoals && <p role="alert" className="error">{errors.awayGoals}</p>}
            </div>

            <button type="submit">Thêm trận</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default App;
