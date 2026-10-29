import { LETTERS } from '../data';

const AnswerButton = ({ index, text, state, hidden, disabled, onClick }) => (
  <button
    className={`answer-btn ${state} ${hidden ? 'hidden' : ''}`}
    disabled={disabled || hidden}
    onClick={() => onClick(index)}
  >
    {hidden ? '' : `${LETTERS[index]}. ${text}`}
  </button>
);

export default AnswerButton;
