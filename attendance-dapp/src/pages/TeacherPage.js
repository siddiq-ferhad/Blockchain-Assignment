import React, { useState } from "react";

const TeacherPage = ({ contract, accounts }) => {

  const [students, setStudents] = useState([]);

  const viewStudents = async () => {
    try {
      const studentCount = await contract.methods.studentCounter().call();
      const viewedStudents = [];
      for (let i = 1; i <= studentCount; i++) {
        const student = await contract.methods.students(i - 1).call();
        viewedStudents.push(student);
      }
      setStudents(viewedStudents);
    } catch (error) {
      console.error("Error viewing students:", error);
    }
  };

  return (
    <div className="students-list">
    <h3>Students</h3>
    <button onClick={viewStudents}>View Students</button>
    <ul>
      {students.map((student, index) => (
        <li key={index}>{`${student.studentId}: ${student.name}`}</li>
      ))}
    </ul>
  </div>
  );
};

export default TeacherPage;
