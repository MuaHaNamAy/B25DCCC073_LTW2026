const Timer = ({ timeLeft }) => (
  <p className={`timer ${timeLeft <= 10 ? 'danger' : ''}`}>Còn {timeLeft} giây</p>
);

export default Timer;
