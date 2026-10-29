import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const MESSAGES = {
  win: 'Chúc mừng! Bạn đã trở thành triệu phú',
  wrong: 'Rất tiếc, bạn đã trả lời sai',
  timeout: 'Hết giờ!',
  stop: 'Bạn đã dừng cuộc chơi',
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to="/" replace />;

  const { name, prize, correctCount, reason } = state;

  return (
    <div className="result">
      <h2>{MESSAGES[reason]}</h2>
      <p>Người chơi: <strong>{name}</strong></p>
      <p>Số câu trả lời đúng: <strong>{correctCount}</strong></p>
      <p>Tiền thưởng: <strong>{formatMoney(prize)}</strong></p>
      <div className="actions">
        <button onClick={() => navigate('/play')}>Chơi lại</button>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;
