import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION, formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();
  const record = history.reduce((best, h) => (!best || h.prize > best.prize ? h : best), null);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/play');
  };

  return (
    <div className="home">
      <h1>Ai là triệu phú</h1>
      <ul className="rules">
        <li>Trả lời lần lượt 15 câu hỏi trắc nghiệm về HTML, CSS, ES6, React.</li>
        <li>Mỗi câu có {TIME_PER_QUESTION} giây, hết giờ được tính là trả lời sai.</li>
        <li>Câu 5, 10, 15 là các mốc an toàn. Trả lời sai chỉ nhận tiền của mốc cao nhất đã vượt qua.</li>
        <li>Trả lời đúng cả 15 câu để nhận 250.000.000 đ.</li>
      </ul>
      {record && (
        <p className="record">Kỷ lục: {formatMoney(record.prize)} – {record.name}</p>
      )}
      <form onSubmit={handleSubmit} className="start-form">
        <label>
          Tên người chơi:{' '}
          <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </label>
        <button type="submit" disabled={playerName.trim() === ''}>Bắt đầu</button>
      </form>
    </div>
  );
};

export default Home;
