// ============================================================
// [BÀI 3 - mục 5] Mỗi dòng lịch thi đấu là một MatchRow bọc React.memo
// Chỉ render lại khi props (match / onGoals / onRemove) đổi tham chiếu.
// ============================================================
import { memo, useRef } from 'react';
import { RESULT_LABELS } from '../data';
import { getResult, getTeamName } from '../utils';
import GoalInput from './GoalInput';

const MatchRow = ({ match, onGoals, onRemove }) => {
  // Bộ đếm số lần hàm component chạy (useRef không gây render)
  const renderCount = useRef(0);
  renderCount.current += 1;

  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);
  const result = getResult(match);

  return (
    <tr className={result === 'draw' ? 'draw' : undefined}>
      <td>{match.round}</td>
      <td>{homeName}</td>
      <td>
        <GoalInput
          value={match.homeGoals}
          label={`Bàn thắng nhà ${homeName} - ${awayName}`}
          onValid={(n) => onGoals(match.id, n, match.awayGoals)}
        />
      </td>
      <td>
        <GoalInput
          value={match.awayGoals}
          label={`Bàn thắng khách ${homeName} - ${awayName}`}
          onValid={(n) => onGoals(match.id, match.homeGoals, n)}
        />
      </td>
      <td>{awayName}</td>
      <td>{RESULT_LABELS[result]}</td>
      <td className="render-count">{renderCount.current}</td>
      <td>
        <button type="button" onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default memo(MatchRow);
