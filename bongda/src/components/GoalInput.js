// ============================================================
// [BÀI 1 - mục 4] Ô sửa số bàn thắng trong lịch thi đấu
// Chỉ báo giá trị lên khi là số nguyên 0–20 (trống / sai thì bỏ qua).
// Dùng input không controlled + đồng bộ bằng useRef để người dùng có thể
// xóa trắng rồi gõ lại mà ô không bị "bật" về giá trị cũ.
// ============================================================
import { useEffect, useRef } from 'react';
import { isValidGoals } from '../utils';

const GoalInput = ({ value, label, onValid }) => {
  const inputRef = useRef(null);

  // Khi giá trị trong state đổi (vd: đặt lại dữ liệu mẫu) thì cập nhật ô
  useEffect(() => {
    const input = inputRef.current;
    if (input && input.valueAsNumber !== value) input.value = String(value);
  }, [value]);

  const handleChange = (e) => {
    const n = e.target.valueAsNumber;
    if (isValidGoals(n)) onValid(n);
  };

  // Rời ô khi đang để trống / sai -> hiện lại giá trị đúng
  const handleBlur = (e) => {
    if (!isValidGoals(e.target.valueAsNumber)) e.target.value = String(value);
  };

  return (
    <input
      ref={inputRef}
      className="goal-input"
      type="number"
      min="0"
      max="20"
      aria-label={label}
      defaultValue={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default GoalInput;
