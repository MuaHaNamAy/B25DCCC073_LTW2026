import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION, LETTERS } from '../data';
import { calcPrize, pickFiftyFifty, audiencePoll } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);
  const [used, setUsed] = useState({ fifty: false, audience: false });

  const question = questions[index];

  const finish = (correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({ name: playerName, prize, correctCount });
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering' || hidden.includes(i)) return;
    setSelected(i);
    setStatus('locked');
  };

  const handleFiftyFifty = () => {
    setHidden(pickFiftyFifty(question.answer));
    setUsed({ ...used, fifty: true });
  };

  const handleAudience = () => {
    setAudience(audiencePoll(question.answer, hidden));
    setUsed({ ...used, audience: true });
  };

  const handleStop = () => finish(index, 'stop');

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
          setHidden([]);
          setAudience(null);
          setStatus('answering');
        }
      }, 2000);
    }
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Phím tắt A–D: đăng ký một lần, luôn gọi bản handleSelect mới nhất qua ref
  const selectRef = useRef(handleSelect);
  selectRef.current = handleSelect;

  useEffect(() => {
    const handleKey = (e) => {
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i !== -1) selectRef.current(i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Tiêu đề tab
  useEffect(() => {
    document.title = `Câu ${index + 1}/${questions.length} – ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [index, questions.length, playerName]);

  return (
    <div className="play">
      <div className="play-main">
        <p>Người chơi: <strong>{playerName}</strong></p>
        <Timer timeLeft={timeLeft} />
        <Lifelines
          used={used}
          disabled={status !== 'answering'}
          onFiftyFifty={handleFiftyFifty}
          onAudience={handleAudience}
          onStop={handleStop}
        />
        <QuestionCard
          number={index + 1}
          total={questions.length}
          question={question}
          status={status}
          selected={selected}
          hidden={hidden}
          onSelect={handleSelect}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <MoneyLadder current={index + 1} />
    </div>
  );
};

export default Play;
