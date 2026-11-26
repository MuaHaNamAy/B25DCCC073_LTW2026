import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RESULT_LABELS, ROUNDS } from './data';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { hasSaved } from './store';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { calcMatchStats, calcStandings, getTeamName } from './utils';
import MatchRow from './components/MatchRow';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';

// [BÀI 3 - mục 8] Giữ data-build trên thẻ div ngoài cùng
const BUILD_TAG = "bd-5918";

const App = () => {
  // [BÀI 1 - mục 1] Tải dữ liệu mẫu (vẫn tải để dùng cho nút "Đặt lại dữ liệu mẫu")
  const { data, loading, error } = useFetch('/data/matches.json');

  // [BÀI 2 - mục 5] State trận đấu từ Redux store
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();

  // [BÀI 2 - mục 1, 2] Context
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  // [BÀI 3 - mục 2] Chỉ nạp dữ liệu mẫu khi CHƯA có dữ liệu lưu
  useEffect(() => {
    if (data && !hasSaved) dispatch(setMatches(data));
  }, [data, dispatch]);

  // Đã có dữ liệu lưu thì hiện trang ngay, không hiện "đang tải" / lỗi fetch
  const showLoading = !hasSaved && loading;
  const showError = !hasSaved && Boolean(error);

  const handleReset = useCallback(() => {
    if (!data) return;
    dispatch(setMatches(data));
    showNotice('Đã đặt lại dữ liệu mẫu');
  }, [data, dispatch, showNotice]);

  // [BÀI 1 - mục 7] + [BÀI 3 - mục 1] Lọc vòng, ghi nhớ bằng localStorage
  const [round, setRound] = useLocalStorage('ltw_bongda_round', 'all');
  const visibleMatches = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );

  // [BÀI 3 - mục 3] Tìm đội (debounce 300ms), chỉ ảnh hưởng bảng lịch thi đấu
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const shownMatches = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return visibleMatches;
    return visibleMatches.filter(
      (m) =>
        getTeamName(m.home).toLowerCase().includes(query) ||
        getTeamName(m.away).toLowerCase().includes(query)
    );
  }, [visibleMatches, debouncedSearch]);

  const handleTeamShift = (e) => {
    setSearch(e.target.value);
  };

  // [BÀI 3 - mục 4] Phím tắt "/" và Esc
  const searchRef = useRef(null);
  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target.tagName;
      const isEditing =
        tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || e.target.isContentEditable;

      if (e.key === '/' && !isEditing) {
        e.preventDefault();
        searchRef.current.focus();
      } else if (e.key === 'Escape' && e.target === searchRef.current) {
        setSearch('');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // [BÀI 1 - mục 5] Bảng xếp hạng: luôn tính trên TẤT CẢ các trận
  const standings = useMemo(() => calcStandings(matches), [matches]);

  // [BÀI 1 - mục 6] Thống kê
  const stats = useMemo(() => calcMatchStats(visibleMatches), [visibleMatches]);
  const leaderText = useMemo(() => {
    if (matches.length === 0) return '—';
    const leader = standings[0];
    return `${leader.name} (${leader.points} điểm)`;
  }, [matches, standings]);

  // [BÀI 3 - mục 7] Tiêu đề tab
  useEffect(() => {
    document.title =
      matches.length > 0 ? `${standings[0].name} dẫn đầu – Giải bóng đá khoa` : 'Giải bóng đá khoa';
  }, [matches, standings]);

  // [BÀI 3 - mục 5] Hàm xử lý ổn định cho MatchRow (chỉ phụ thuộc dispatch, showNotice)
  const handleGoals = useCallback(
    (id, homeGoals, awayGoals) => {
      dispatch(setGoals({ id, homeGoals, awayGoals }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
    },
    [dispatch, showNotice]
  );

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <header className="header">
        <h1>Giải bóng đá khoa</h1>
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

          {/* [BÀI 3 - mục 6] Phân bố kết quả */}
          <h3>Phân bố kết quả</h3>
          <ul className="distribution">
            {Object.keys(RESULT_LABELS).map((key) => (
              <li key={key}>
                {`${RESULT_LABELS[key]}: ${stats.counts[key]}`}
                <span className="bar" style={{ width: `${24 * stats.counts[key]}px` }} />
              </li>
            ))}
          </ul>
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

            {/* [BÀI 3 - mục 3, 4] Ô tìm đội */}
            <label htmlFor="team-search">Tìm đội</label>
            <input
              id="team-search"
              ref={searchRef}
              type="text"
              placeholder="Nhấn / để tìm"
              value={search}
              onChange={handleTeamShift}
            />
          </div>

          {showLoading ? (
            <p>Đang tải lịch thi đấu...</p>
          ) : showError ? (
            <p className="error">Không tải được lịch thi đấu</p>
          ) : matches.length === 0 ? (
            <p>Chưa có trận đấu nào</p>
          ) : (
            <>
              <p className="found">Tìm thấy {shownMatches.length} trận</p>
              <table className="matches">
                <thead>
                  <tr>
                    <th>Vòng</th>
                    <th>Đội nhà</th>
                    <th>BT nhà</th>
                    <th>BT khách</th>
                    <th>Đội khách</th>
                    <th>Kết quả</th>
                    <th>Số lần render</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {shownMatches.map((m) => (
                    <MatchRow key={m.id} match={m} onGoals={handleGoals} onRemove={handleRemove} />
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* [BÀI 3 - mục 2] Nút đặt lại dữ liệu mẫu */}
          <button type="button" className="reset" onClick={handleReset} disabled={!data}>
            Đặt lại dữ liệu mẫu
          </button>
        </section>

        <section className="card">
          <h2>Thêm trận đấu</h2>
          <AddMatchForm />
        </section>

        <section className="card">
          <h2>Mục tiêu điểm</h2>
          <GoalPlanner standings={standings} />
        </section>
      </main>
    </div>
  );
};

export default App;
