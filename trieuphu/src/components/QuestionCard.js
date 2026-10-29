import AnswerButton from './AnswerButton';

const QuestionCard = ({ number, total, question, status, selected, hidden, onSelect }) => {
  const getState = (i) => {
    if (status === 'locked' && i === selected) return 'selected';
    if (status === 'revealed') {
      if (i === question.answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return '';
  };

  return (
    <div className="question-card">
      <p className="question-number">Câu {number}/{total}</p>
      <p className="question-text">{question.question}</p>
      <div className="answers">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            index={i}
            text={option}
            state={getState(i)}
            hidden={hidden.includes(i)}
            disabled={status !== 'answering'}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
