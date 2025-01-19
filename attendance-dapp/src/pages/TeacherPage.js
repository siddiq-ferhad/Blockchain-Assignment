import React, { useState } from "react";

const TeacherPage = ({ contract, accounts }) => {
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [generatedPwd, setGeneratedPwd] = useState("");

  const viewEnrolledStudents = async (subjectId) => {
    try {
      if (!subjectId) {
        alert("Please enter Subject ID.");
        return;
      }

      const enrolledStudents = await contract.methods.getEnrolledStudents(subjectId).call({ from: accounts[0] });
      setStudents(enrolledStudents);
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      alert("Failed to fetch students. Please check the Subject ID.");
    }
  };

  const generateClassPassword = async () => {
    try {
      if (!classId) {
        alert("Please enter Class ID.");
        return;
      }

      await contract.methods.generateClassPwd(classId).send({ from: accounts[0] });
      const classDetails = await contract.methods.classDetails(classId).call();
      const generatedPassword = classDetails.classPwd;

      setGeneratedPwd(generatedPassword);

      // Create a hidden textarea element to copy the password to the clipboard
      const textArea = document.createElement('textarea');
      textArea.value = generatedPassword;
      document.body.appendChild(textArea);

      // Select the text and copy it to the clipboard
      textArea.select();
      document.execCommand('copy');

      // Remove the textarea from the DOM
      document.body.removeChild(textArea);
      alert("Password copied to clipboard!");

    } catch (error) {
      console.error("Error generating class password:", error);
      alert("Failed to generate class password. Please check the inputs.");
    }
  };

  return (
    <div className="App">
      <h2>Teacher Page</h2>
      <div className="lists-container">
        <div className="generate-password">
          <h3>Generate Class Password</h3>
          <input
            type="text"
            placeholder="Class ID"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          />
          <button onClick={generateClassPassword}>Generate Password</button>
          {generatedPwd && (
            <p>
              <strong>Generated Password:</strong> {generatedPwd}
            </p>
          )}
        </div>

        <div className="students-list">
          <h3>View Enrolled Students</h3>
          <input
            type="text"
            placeholder="Subject ID"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          />
          <button onClick={() => viewEnrolledStudents(subjectId)}>View Students</button>
          <ul>
            {students.map((student, index) => (
              <li key={index} className="list-item">
                <span>{`${student.studentId}: ${student.name}`}</span>
                <button className="inviso"></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
