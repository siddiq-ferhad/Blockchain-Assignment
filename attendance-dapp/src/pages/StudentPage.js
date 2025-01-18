import React, { useState } from "react";

const StudentPage = ({ contract, accounts }) => {
  
  const [subjects, setSubjects] = useState([]);

  const viewSubjects = async () => {
    try {
      const subjectCount = await contract.methods.subjectCounter().call();
      const viewedSubjects = [];
      for (let i = 1; i <= subjectCount; i++) {
        const subject = await contract.methods.subjectDetails(i).call();
        viewedSubjects.push(subject);
      }
      setSubjects(viewedSubjects);
    } catch (error) {
      console.error("Error viewing subjects:", error);
    }
  };

  return (
    <div className="subjects-list">
    <h3>Subjects</h3>
    <button onClick={viewSubjects}>View Subjects</button>
    <ul>
      {subjects.map((subject, index) => (
        <li key={index}>{`${subject.subjectId}: ${subject.subjectName}`}</li>
      ))}
    </ul>
  </div>
  );
};

export default StudentPage;
