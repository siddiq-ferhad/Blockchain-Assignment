import React, { useEffect, useState } from "react";
import getWeb3 from "./utils/getWeb3";
import AttendanceContract from "./contracts/Attendance.json";
import './App.css';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [teacherAddress, setTeacherAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = AttendanceContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          AttendanceContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
      } catch (error) {
        console.error(
          "Failed to load web3, accounts, or contract. Check console for details.",
          error
        );
      }
    };

    init();
  }, []);

  const addStudent = async () => {
    if (!studentName || !studentAddress) {
      alert("Please enter both the student's name and address.");
      return;
    }

    try {
      await contract.methods
        .addStudent(studentAddress, studentName)
        .send({ from: accounts[0] });
      alert(`Student ${studentName} added successfully!`);
      setStudentName("");
      setStudentAddress("");
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  const addTeacher = async () => {
    if (!teacherName || !teacherAddress) {
      alert("Please enter both the teacher's name and address.");
      return;
    }

    try {
      await contract.methods
        .addTeacher(teacherAddress, teacherName)
        .send({ from: accounts[0] });
      alert(`Teacher ${teacherName} added successfully!`);
      setTeacherName("");
      setTeacherAddress("");
      fetchTeachers();
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("Failed to add teacher.");
    }
  };

  const fetchStudents = async () => {
    try {
      const studentCount = await contract.methods.studentCounter().call();
      const fetchedStudents = [];
      for (let i = 1; i <= studentCount; i++) {
        const student = await contract.methods.students(i - 1).call();
        fetchedStudents.push(student);
      }
      setStudents(fetchedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const teacherCount = await contract.methods.teacherCounter().call();
      const fetchedTeachers = [];
      for (let i = 1; i <= teacherCount; i++) {
        const teacher = await contract.methods.teachers(i - 1).call();
        fetchedTeachers.push(teacher);
      }
      setTeachers(fetchedTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  return (
    <div className="App">
      <h1>Attendance DApp</h1>
      <p>Your account: {accounts[0]}</p>

      <div className="section">
        <h2>Add a New Student</h2>
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
        />
        <button onClick={addStudent}>Add Student</button>
      </div>

      <div className="section">
        <h2>Add a New Teacher</h2>
        <input
          type="text"
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teacher Address"
          value={teacherAddress}
          onChange={(e) => setTeacherAddress(e.target.value)}
        />
        <button onClick={addTeacher}>Add Teacher</button>
      </div>

      <h2>Student and Teacher Lists</h2>
      <div className="lists-container">
        <div className="students-list">
          <h3>Students</h3>
          <button onClick={fetchStudents}>Fetch Students</button>
          <ul>
            {students.map((student, index) => (
              <li key={index}>{`${student.studentId}: ${student.name}`}</li>
            ))}
          </ul>
        </div>

        <div className="teachers-list">
          <h3>Teachers</h3>
          <button onClick={fetchTeachers}>Fetch Teachers</button>
          <ul>
            {teachers.map((teacher, index) => (
              <li key={index}>{`${teacher.teacherId}: ${teacher.name}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
