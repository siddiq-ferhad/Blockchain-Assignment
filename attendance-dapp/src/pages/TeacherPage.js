import React, { useState } from "react";

const TeacherPage = ({ contract, accounts }) => {
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [enrollSubjectId, enrollSetSubjectId] = useState("");
  const [classSubjectId, classSetSubjectId] = useState("");
  const [generatedPwd, setGeneratedPwd] = useState("");

  const viewEnrolledStudents = async (subjectId) => {
    try {
      if (!enrollSubjectId) {
        alert("Please enter Subject ID.");
        return;
      }

      const enrolledStudents = await contract.methods.getEnrolledStudents(enrollSubjectId).call({ from: accounts[0] });
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

  const viewClasses = async () => {
    try {
      if (!classSubjectId) {
        alert("Please enter Subject ID.");
        return;
      }

      const classIds = await contract.methods.getClassesForSubject(classSubjectId).call({ from: accounts[0] });
      const classDetailsList = [];

      for (const id of classIds) {
        const classDetails = await contract.methods.classDetails(id).call();
        const subjectDetails = await contract.methods.subjectDetails(classSubjectId).call();

        classDetailsList.push({
          classId: id,
          subjectName: subjectDetails.subjectName,
          classDate: new Date(parseInt(classDetails.classDate) * 1000).toLocaleDateString(),
          classPwd: classDetails.classPwd,
        });
      }

      setClasses(classDetailsList);
    } catch (error) {
      console.error("Error fetching classes:", error);
      alert("Failed to fetch classes. Please check the inputs or your permissions.");
    }
  };

  return (
    <div className="App">
      <h2>Welcome Teacher!</h2>
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
          <h3>Enrolled Students</h3>
          <input
            type="text"
            placeholder="Subject ID"
            value={enrollSubjectId}
            onChange={(e) => enrollSetSubjectId(e.target.value)}
          />
          <button onClick={() => viewEnrolledStudents(enrollSubjectId)}>View Students</button>
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

      <div className="class-list">
        <h3>Classes</h3>
        <input
          type="text"
          placeholder="Subject ID"
          value={classSubjectId}
          onChange={(e) => classSetSubjectId(e.target.value)}
        />
        <button onClick={viewClasses}>View Classes</button>
        <ul>
          {classes.map((classInfo, index) => (
            <li key={index} className="list-item">
              <span><strong>Class ID:</strong> {classInfo.classId}</span><br />
              <span><strong>Subject Name:</strong> {classInfo.subjectName}</span><br />
              <span><strong>Class Date:</strong> {classInfo.classDate}</span><br />
              <span><strong>Class Password:</strong> {classInfo.classPwd}</span>
              <button className="inviso"></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherPage;
