import React, { useEffect, useState } from "react";

const TeacherPage = ({ contract, accounts }) => {
  const [subjects, setSubjects] = useState([]);

  // Function to fetch subjects
  const fetchSubjects = async () => {
    try {
      const subjectCount = await contract.methods.subjectCounter().call();
      const subjectsList = [];
      for (let i = 1; i <= subjectCount; i++) {
        const subject = await contract.methods.subjectDetails(i).call();
        subjectsList.push(subject);
      }
      setSubjects(subjectsList);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchSubjects();
    }
  }, [contract]);

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <h2>Assigned Subjects</h2>
      <ul>
        {subjects.map((subject, index) => (
          <li key={index}>{subject.subjectName}</li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherPage;
