import React, { useState } from "react";

const TeacherPage = ({ contract, accounts }) => {
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState("");
  const [generatedPwd, setGeneratedPwd] = useState("");

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

  const generateClassPassword = async () => {
    try {
      if (!classId) {
        alert("Please enter Class ID.");
        return;
      }

      await contract.methods.generateClassPwd(classId).send({ from: accounts[0] });

      const classDetails = await contract.methods.classDetails(classId).call();
      const passwordHash = classDetails.classPwd;

      const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@/!#";
      const generatedPassword = Array.from({ length: 15 }, (_, i) =>
        characters[
        parseInt(passwordHash.toString().slice(i * 2, i * 2 + 2), 16) % characters.length
        ]
      ).join("");

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
          <h3>Students</h3>
          <button onClick={viewStudents}>View Students</button>
          <ul>
            {students.map((student, index) => (
              <li key={index}>{`${student.studentId}: ${student.name}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
