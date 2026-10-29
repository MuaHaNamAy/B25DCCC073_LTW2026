import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ current }) => (
  <ol className="ladder">
    {PRIZES.map((prize, i) => {
      const step = i + 1;
      const classes = [
        step === current ? 'current' : '',
        MILESTONES.includes(step) ? 'milestone' : '',
      ].join(' ');
      return (
        <li key={step} className={classes}>
          <span>{step}</span>
          <span>{formatMoney(prize)}</span>
        </li>
      );
    }).reverse()}
  </ol>
);

export default MoneyLadder;
