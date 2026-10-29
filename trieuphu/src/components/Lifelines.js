const Lifelines = ({ used, disabled, onFiftyFifty, onAudience, onStop }) => (
  <div className="lifelines">
    <button disabled={disabled || used.fifty} onClick={onFiftyFifty}>50:50</button>
    <button disabled={disabled || used.audience} onClick={onAudience}>Hỏi khán giả</button>
    <button disabled={disabled} onClick={onStop}>Dừng cuộc chơi</button>
  </div>
);

export default Lifelines;
