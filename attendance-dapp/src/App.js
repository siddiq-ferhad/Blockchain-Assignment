import React, { useEffect, useState } from "react";
import getWeb3 from "./utils/getWeb3";
import AttendanceContract from "./contracts/Attendance.json";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentAddress, setStudentAddress] = useState("");

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
      setStudentName(""); // Clear the input field
      setStudentAddress(""); // Clear the input field
      fetchStudents(); // Refresh the list of students
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
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

  return (
    <div className="App">
      <h1>Attendance DApp</h1>
      <p>Your account: {accounts[0]}</p>

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

      <h2>Students List</h2>
      <button onClick={fetchStudents}>Fetch Students</button>
      <ul>
        {students.map((student, index) => (
          <li key={index}>{`${student.studentId}: ${student.name}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
