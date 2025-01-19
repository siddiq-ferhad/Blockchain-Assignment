import React, { useState } from "react";

const StudentPage = ({ contract, accounts }) => {

  const [subjects, setSubjects] = useState([]);
  const [classId, setClassId] = useState("");
  const [password, setPassword] = useState("");

  // Function to view all subjects
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

  // Function to mark attendance
  const markAttendance = async () => {
    if (!classId || !password) {
      alert("Please provide both Class ID and Password.");
      return;
    }

    try {
      await contract.methods
        .markAttendance(classId, password)
        .send({ from: accounts[0] });

      alert(`Attendance marked successfully for Class ID: ${classId}`);
      setClassId("");
      setPassword("");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance. Please check your inputs.");
    }
  };

  return (
    <div className="App">
      <h2>Welcome!</h2>
      <div className="lists-container">
        <div className="subjects-list">
          <h3>Subjects</h3>
          <button onClick={viewSubjects}>View Subjects</button>
          <ul>
            {subjects.map((subject, index) => (
              <li key={index} className="list-item">
                <span>{`${subject.subjectId}: ${subject.subjectName}`}</span>
                <button className="inviso"></button>
              </li>
            ))}
          </ul>
        </div>

        <div className="attendance-section">
          <h3>Mark Attendance</h3>
          <input
            type="text"
            placeholder="Class ID"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Class Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={markAttendance}>Mark Attendance</button>
        </div>

        <div className="attendance-section">
          <h3>Attendance History</h3>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
