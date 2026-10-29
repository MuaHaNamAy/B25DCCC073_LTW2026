import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];

  const finish = (correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status, index]);

  // Hết giờ = trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) finish(index, 'timeout');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Các bước chờ: locked --1s--> revealed --2s--> câu tiếp / kết thúc
  useEffect(() => {
    let id;
    if (status === 'locked') {
      id = setTimeout(() => setStatus('revealed'), 1000);
    } else if (status === 'revealed') {
      id = setTimeout(() => {
        if (selected !== question.answer) {
          finish(index, 'wrong');
        } else if (index === questions.length - 1) {
          finish(questions.length, 'win');
        } else {
          setIndex(index + 1);
          setSelected(null);
          setTimeLeft(TIME_PER_QUESTION);
          setStatus('answering');
        }
      }, 2000);
    }
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="play">
      <div className="play-main">
        <p>Người chơi: <strong>{playerName}</strong></p>
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          number={index + 1}
          total={questions.length}
          question={question}
          status={status}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder current={index + 1} />
    </div>
  );
};

export default Play;
