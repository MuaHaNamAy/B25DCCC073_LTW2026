// ============================================================
// [BÀI 2 - mục 5] Form thêm trận tách thành component riêng
// (logic giống [BÀI 1 - mục 8], nhưng tự useSelector / dispatch / useNotice)
// ============================================================
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MAX_GOALS, ROUNDS, TEAMS } from '../data';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { getTeamName, toNumber, validateMatchForm } from '../utils';

const EMPTY_FORM = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

const AddMatchForm = () => {
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const showNotice = useNotice();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateMatchForm(form, matches);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    dispatch(
      addMatch({
        round: Number(form.round),
        home: Number(form.home),
        away: Number(form.away),
        homeGoals: toNumber(form.homeGoals),
        awayGoals: toNumber(form.awayGoals),
      })
    );
    showNotice(`Đã thêm trận ${getTeamName(form.home)} - ${getTeamName(form.away)}`);
    setForm(EMPTY_FORM);
    homeRef.current.focus();
  };

  return (
    <form className="match-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="add-round">Vòng</label>
        <select id="add-round" name="round" value={form.round} onChange={handleChange}>
          {ROUNDS.map((r) => (
            <option key={r} value={String(r)}>{r}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="add-home">Đội nhà</label>
        <select id="add-home" name="home" ref={homeRef} value={form.home} onChange={handleChange}>
          <option value="">-- Chọn đội --</option>
          {TEAMS.map((t) => (
            <option key={t.id} value={String(t.id)}>{t.name}</option>
          ))}
        </select>
        {errors.home && <p role="alert" className="error">{errors.home}</p>}
      </div>

      <div className="field">
        <label htmlFor="add-away">Đội khách</label>
        <select id="add-away" name="away" value={form.away} onChange={handleChange}>
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
          onChange={handleChange}
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
          onChange={handleChange}
        />
        {errors.awayGoals && <p role="alert" className="error">{errors.awayGoals}</p>}
      </div>

      <button type="submit">Thêm trận</button>
    </form>
  );
};

export default AddMatchForm;
