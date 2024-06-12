import React from 'react';
import './JournalCell.css';

interface JournalCellProps {
  student: string;
  day: string;
  grade: string;
  onGradeChange: (student: string, day: string, grade: string) => void;
}

const getBackgroundColor = (grade: string) => {
  const numGrade = Number(grade);
  if (numGrade >= 8) return 'bg-green';
  if (numGrade >= 5) return 'bg-orange';
  if (numGrade >= 1) return 'bg-red';
  return '';
};

const JournalCell: React.FC<JournalCellProps> = ({
  student,
  day,
  grade,
  onGradeChange,
}) => (
  <td>
    <input
      type="number"
      min="1"
      max="10"
      value={grade}
      onChange={e => onGradeChange(student, day, e.target.value)}
      className={`grade-cell ${getBackgroundColor(grade)}`}
    />
  </td>
);

export default JournalCell;
