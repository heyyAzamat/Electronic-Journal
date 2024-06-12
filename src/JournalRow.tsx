import React from 'react';
import './JournalRow.css';
import JournalCell from './JournalCell';

interface JournalRowProps {
  student: string;
  days: string[];
  grades: { [key: string]: string };
  onGradeChange: (student: string, day: string, grade: string) => void;
  onDeleteStudent: (student: string) => void;
  onFinalGradeChange: (student: string, grade: string) => void;
  finalGrades: { [key: string]: string };
}

const calculateSumPercentage = (grades: string[]): string => {
  const validGrades = grades
    .map(Number)
    .filter(n => !isNaN(n) && n >= 1 && n <= 10);

  if (validGrades.length === 0) return '';

  const sumPercentages = validGrades
    .map(grade => ((grade - 1) / 9) * 100)
    .reduce((a, b) => a + b, 0);

  return `${Math.round(sumPercentages / validGrades.length)}%`;
};

const getRecommendedGrade = (percentage: number): string => {
  if (percentage >= 85) return '5';
  if (percentage >= 65) return '4';
  if (percentage >= 40) return '3';
  return '2';
};

const JournalRow: React.FC<JournalRowProps> = ({
  student,
  days,
  grades,
  onGradeChange,
  onDeleteStudent,
  onFinalGradeChange,
  finalGrades,
}) => {
  const studentGrades = days.map(day => grades[`${student}-${day}`] || '');
  const sumPercentage = calculateSumPercentage(studentGrades);
  const percentage = parseFloat(sumPercentage);
  const recommendedGrade = isNaN(percentage) ? '' : getRecommendedGrade(percentage);
  const finalGrade = finalGrades[student] || '';

  return (
    <tr>
      <td>{student}</td>
      {days.map(day => (
        <JournalCell
          key={`${student}-${day}`}
          student={student}
          day={day}
          grade={grades[`${student}-${day}`] || ''}
          onGradeChange={onGradeChange}
        />
      ))}
      <td>{sumPercentage}</td>
      <td className={`recommended-grade grade-${recommendedGrade}`}>{recommendedGrade}</td>
      <td>
        <input
          type="text"
          value={finalGrade}
          onChange={e => onFinalGradeChange(student, e.target.value)}
        />
      </td>
      <td className="delete-button-cell">
        <button onClick={() => onDeleteStudent(student)} className="delete-button">
          Удалить
        </button>
      </td>
    </tr>
  );
};

export default JournalRow;
