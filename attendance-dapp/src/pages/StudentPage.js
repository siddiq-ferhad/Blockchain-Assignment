import React, { useState } from "react";

const StudentPage = ({ contract, accounts }) => {
  const [classId, setClassId] = useState("");
  const [password, setPassword] = useState("");
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

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

  const viewEnrolledSubjects = async () => {
    try {
      const subjectIds = await contract.methods.getSubjectsForStudent().call({ from: accounts[0] });

      const subjects = [];
      for (const subjectId of subjectIds) {
        const subject = await contract.methods.subjectDetails(subjectId).call();
        subjects.push(subject);
      }

      setEnrolledSubjects(subjects);
    } catch (error) {
      console.error("Error viewing enrolled subjects:", error);
    }
  };

  const viewClassesForSubject = async (subjectId) => {
    try {
      const classIds = await contract.methods.getClassesForStudent(subjectId).call({ from: accounts[0] });
      const classDetailsList = [];

      for (const id of classIds) {
        const classDetails = await contract.methods.classDetails(id).call();
        const subjectDetails = await contract.methods.subjectDetails(subjectId).call();

        classDetailsList.push({
          classId: id,
          subjectName: subjectDetails.subjectName,
          classDate: new Date(parseInt(classDetails.classDate) * 1000).toLocaleDateString(),
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
      <h2>Welcome Student!</h2>
      <div className="lists-container">
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

      <div className="lists-container">
        <div className="enrolled-subjects">
          <h3>Your Enrolled Subjects</h3>
          <button onClick={viewEnrolledSubjects}>View Subjects</button>
          <ul>
            {enrolledSubjects.map((subject, index) => (
              <li key={index} className="list-item">
                <span>
                  ID: {subject.subjectId} - {subject.subjectName}
                </span>
                <button className="view-classes-btn" onClick={() => viewClassesForSubject(subject.subjectId)}>View Classes</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="class-list">
          <h3>Classes</h3>
          <ul>
            {classes.map((classInfo, index) => (
              <li key={index} className="list-item">
                <span><strong>Class ID:</strong> {classInfo.classId}</span><br />
                <span><strong>Subject Name:</strong> {classInfo.subjectName}</span><br />
                <span><strong>Class Date:</strong> {classInfo.classDate}</span><br />
                <button className="inviso"></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;