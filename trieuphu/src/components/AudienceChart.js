import { LETTERS } from '../data';

const AudienceChart = ({ percents }) => (
  <div className="audience-chart">
    {percents.map((p, i) => (
      <div key={LETTERS[i]} className="audience-row">
        <div className="audience-bar" style={{ width: `${p}%` }} />
        <span>{LETTERS[i]}: {p}%</span>
      </div>
    ))}
  </div>
);

export default AudienceChart;
