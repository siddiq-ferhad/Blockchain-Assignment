import React, { useState } from "react";

const StudentPage = ({ contract, accounts }) => {
  
  const [subjects] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [password, setPassword] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  // Function to list enrolled classes
  const viewEnrolledClasses = async () => {
    try {
      const enrolledClassesList = [];
      for (let subject of subjects) {
        const subjectDetails = await contract.methods.subjectDetails(subject.subjectId).call();
        const classIds = await contract.methods.getClassIds(subject.subjectId).call(); // Fetch the array of class IDs from the contract
  
        // Iterate through class IDs and add them to the enrolledClassesList
        for (let classId of classIds) {
          enrolledClassesList.push({
            classId,
            subjectName: subject.subjectName,
          });
        }
      }
      setEnrolledClasses(enrolledClassesList);
    } catch (error) {
      console.error("Error fetching enrolled classes:", error);
      alert("Failed to fetch enrolled classes.");
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

  // Function to check attendance
  const viewAttendance = async () => {
    try {
      const studentAttendance = [];
      for (let enrolledClass of enrolledClasses) {
        const isAttended = await contract.methods
          .checkAttendance(enrolledClass.classId)
          .call({ from: accounts[0] });

        studentAttendance.push({
          classId: enrolledClass.classId,
          subjectName: enrolledClass.subjectName,
          attended: isAttended,
        });
      }
      setAttendanceHistory(studentAttendance);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      alert("Failed to fetch attendance history.");
    }
  };

  return (
    <div>
      <div className="enrolled-classes-list">
        <h3>Enrolled Classes</h3>
        <button onClick={viewEnrolledClasses}>View Enrolled Classes</button>
        <ul>
          {enrolledClasses.map((enrolledClass, index) => (
            <li key={index}>
              {` ${enrolledClass.classId}: ${enrolledClass.subjectName}`}
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

      <div className="check-attendance-list">
        <h3>Attendance History</h3>
        <button onClick={viewAttendance}>View Attendance</button>
        <ul>
          {attendanceHistory.map((entry, index) => (
            <li key={index}>
            {`Class ID: ${entry.classId} - Subject: ${entry.subjectName} - ${
              entry.attended ? "Present" : "Absent"
            }`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentPage;
