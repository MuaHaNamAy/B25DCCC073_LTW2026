import { LETTERS } from '../data';

const AnswerButton = ({ index, text, state, disabled, onClick }) => (
  <button
    className={`answer-btn ${state}`}
    disabled={disabled}
    onClick={() => onClick(index)}
  >
    {LETTERS[index]}. {text}
  </button>
);

export default AnswerButton;
