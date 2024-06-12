import React, { useState, useEffect } from 'react';
import './Journal.css';
import JournalRow from './JournalRow';

const subjects = ['Математика', 'Английский язык', 'Естественные науки', 'Социальные науки'];
const classes = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'];
const initialStudents = ['Ученик'];
const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

const getStorageKey = (className: string, subject: string, key: string) => `${className}-${subject}-${key}`;

const Journal: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  const [grades, setGrades] = useState<{ [key: string]: string }>(() => {
    const savedGrades = localStorage.getItem(getStorageKey(selectedClass, selectedSubject, 'grades'));
    return savedGrades ? JSON.parse(savedGrades) : {};
  });

  const [students, setStudents] = useState<string[]>(() => {
    const savedStudents = localStorage.getItem(getStorageKey(selectedClass, selectedSubject, 'students'));
    return savedStudents ? JSON.parse(savedStudents) : initialStudents;
  });

  const [finalGrades, setFinalGrades] = useState<{ [key: string]: string }>(() => {
    const savedFinalGrades = localStorage.getItem(getStorageKey(selectedClass, selectedSubject, 'final-grades'));
    return savedFinalGrades ? JSON.parse(savedFinalGrades) : {};
  });

  const [newStudent, setNewStudent] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedGrades = localStorage.getItem(getStorageKey(selectedClass, selectedSubject, 'grades'));
    setGrades(savedGrades ? JSON.parse(savedGrades) : {});

    const savedStudents = localStorage.getItem(getStorageKey(selectedClass, selectedSubject, 'students'));
    setStudents(savedStudents ? JSON.parse(savedStudents) : initialStudents);

    const savedFinalGrades = localStorage.getItem(getStorageKey(selectedClass, selectedSubject, 'final-grades'));
    setFinalGrades(savedFinalGrades ? JSON.parse(savedFinalGrades) : {});
  }, [selectedClass, selectedSubject]);

  const handleGradeChange = (student: string, day: string, grade: string) => {
    const newGrades = {
      ...grades,
      [`${student}-${day}`]: grade,
    };
    setGrades(newGrades);
    localStorage.setItem(getStorageKey(selectedClass, selectedSubject, 'grades'), JSON.stringify(newGrades));
  };

  const handleFinalGradeChange = (student: string, grade: string) => {
    const newFinalGrades = {
      ...finalGrades,
      [student]: grade,
    };
    setFinalGrades(newFinalGrades);
    localStorage.setItem(getStorageKey(selectedClass, selectedSubject, 'final-grades'), JSON.stringify(newFinalGrades));
  };

  const handleAddStudent = () => {
    if (newStudent.trim() === '') return;
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setNewStudent('');
    setShowAddModal(false);
    updateAllStudents(updatedStudents);
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;
    const updatedStudents = students.filter(student => student !== studentToDelete);
    setStudents(updatedStudents);
    setStudentToDelete(null);
    updateAllStudents(updatedStudents);
  };

  const updateAllStudents = (updatedStudents: string[]) => {
    subjects.forEach(subject => {
      localStorage.setItem(getStorageKey(selectedClass, subject, 'students'), JSON.stringify(updatedStudents));
    });
  };

  return (
    <div className="journal-container p-4 bg-gray-100 min-h-screen">
      <div className="selector mb-4 flex gap-4">
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="p-2 rounded-md border border-gray-300 bg-white"
        >
          {classes.map(className => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="p-2 rounded-md border border-gray-300 bg-white"
        >
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>
      <table className="journal-table w-full bg-white shadow-md rounded-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border-b"></th>
            {days.map(day => (
              <th key={day} className="p-2 border-b">{day}</th>
            ))}
            <th className="p-2 border-b">Сумма %</th>
            <th className="p-2 border-b">Реком. оценка</th>
            <th className="p-2 border-b">Итог</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <JournalRow
              key={student}
              student={student}
              days={days}
              grades={grades}
              onGradeChange={handleGradeChange}
              onDeleteStudent={setStudentToDelete}
              onFinalGradeChange={handleFinalGradeChange}
              finalGrades={finalGrades}
            />
          ))}
        </tbody>
      </table>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={() => setShowAddModal(true)}
      >
        +
      </button>
      {showAddModal && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-4 rounded-md">
            <h2 className="mb-4">Добавить ученика</h2>
            <input
              type="text"
              value={newStudent}
              onChange={e => setNewStudent(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            />
            <button
              className="mr-2 px-4 py-2 bg-green-600 text-white rounded-md"
              onClick={handleAddStudent}
            >
              Добавить
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md"
              onClick={() => setShowAddModal(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
      {studentToDelete && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-4 rounded-md">
            <h2 className="mb-4">Удалить ученика</h2>
            <p>Вы уверены, что хотите удалить {studentToDelete}?</p>
            <button
              className="mr-2 px-4 py-2 bg-green-600 text-white rounded-md"
              onClick={handleDeleteStudent}
            >
              Удалить
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md"
              onClick={() => setStudentToDelete(null)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
