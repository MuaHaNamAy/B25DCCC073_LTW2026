import { PRIZES, MILESTONES } from './data';

// reason: 'win' | 'wrong' | 'timeout' | 'stop'
export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') return PRIZES[PRIZES.length - 1];
  if (reason === 'stop') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[passed[passed.length - 1] - 1] : 0;
};

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Chọn ngẫu nhiên 2 đáp án sai để ẩn (50:50)
export const pickFiftyFifty = (answer) => {
  const wrong = [0, 1, 2, 3].filter((i) => i !== answer);
  const keep = wrong[randomInt(0, wrong.length - 1)];
  return wrong.filter((i) => i !== keep);
};

// Tỉ lệ % khán giả cho A, B, C, D (tổng = 100), đáp án đúng 40–70% và cao nhất
export const audiencePoll = (answer, hidden) => {
  const others = [0, 1, 2, 3].filter((i) => i !== answer && !hidden.includes(i));

  // Chia ngẫu nhiên phần còn lại cho các đáp án sai
  const split = (rest) => {
    const weights = others.map(() => Math.random());
    const sum = weights.reduce((acc, w) => acc + w, 0);
    const parts = weights.map((w) => Math.floor((w / sum) * rest));
    const used = parts.reduce((acc, p) => acc + p, 0);
    parts[parts.length - 1] += rest - used;
    return parts;
  };

  // Thử lại đến khi đáp án đúng có tỉ lệ cao nhất
  const generate = () => {
    const correct = randomInt(40, 70);
    const shares = split(100 - correct);
    return shares.every((s) => s < correct) ? { correct, shares } : generate();
  };

  const { correct, shares } = generate();

  return [0, 1, 2, 3].map((i) => {
    if (i === answer) return correct;
    const pos = others.indexOf(i);
    return pos === -1 ? 0 : shares[pos];
  });
};
