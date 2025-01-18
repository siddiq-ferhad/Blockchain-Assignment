import React, { useEffect, useState } from "react";

const StudentPage = ({ contract, accounts }) => {
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);

  // Function to fetch subjects for the student
  const fetchEnrolledSubjects = async () => {
    try {
      const student = await contract.methods
        .students(accounts[0])
        .call(); // Assuming a mapping of address to student
      const subjectIds = student.enrolledSubjects;
      const subjectsList = [];
      for (let i = 0; i < subjectIds.length; i++) {
        const subject = await contract.methods
          .subjectDetails(subjectIds[i])
          .call();
        subjectsList.push(subject);
      }
      setEnrolledSubjects(subjectsList);
    } catch (error) {
      console.error("Error fetching enrolled subjects:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchEnrolledSubjects();
    }
  }, [contract]);

  return (
    <div>
      <h1>Student Dashboard</h1>
      <h2>Enrolled Subjects</h2>
      <ul>
        {enrolledSubjects.map((subject, index) => (
          <li key={index}>{subject.subjectName}</li>
        ))}
      </ul>
    </div>
  );
};

export default StudentPage;
