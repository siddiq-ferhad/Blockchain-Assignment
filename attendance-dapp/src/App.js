import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import getWeb3 from "./utils/getWeb3";
import AttendanceContract from "./contracts/Attendance.json";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import Unauthorized from "./pages/Unauthorized";
import './App.css';


const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  // const [students, setStudents] = useState([]);
  // const [teachers, setTeachers] = useState([]);
  // const [subjects, setSubjects] = useState([]);
  // const [studentName, setStudentName] = useState("");
  // const [teacherName, setTeacherName] = useState("");
  // const [studentAddress, setStudentAddress] = useState("");
  // const [teacherAddress, setTeacherAddress] = useState("");
  // const [subjectName, setSubjectName] = useState("");
  // const [classDate, setClassDate] = useState("");
  // const [subjectId, setSubjectId] = useState("");
  // const [assignTeacherSubjectId, setAssignTeacherSubjectId] = useState("");
  // const [assignTeacherAddress, setAssignTeacherAddress] = useState("");
  const [role, setRole] = useState("");

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

  // fetchRole function to fetch the user's role from the contract
  useEffect(() => {
    const fetchRole = async () => {
      if (contract && accounts.length > 0) {
        try {
          const userRole = await contract.methods.getRole(accounts[0]).call();
          console.log("Fetched role:", userRole); // Debug log
          setRole(userRole);
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
    };
  
    fetchRole();
  }, [contract, accounts]);

  // debug logs
  // if (!web3) return <div>Loading Web3...</div>;
  // if (!contract) return <div>Loading contract...</div>;
  // if (accounts.length === 0) return <div>Loading accounts...</div>;
  // if (!role) return <div>Loading role data...</div>;

  // const addStudent = async () => {
  //   if (!studentName || !studentAddress) {
  //     alert("Please enter both the student's name and address.");
  //     return;
  //   }

  //   try {
  //     await contract.methods
  //       .addStudent(studentAddress, studentName)
  //       .send({ from: accounts[0] });
  //     alert(`Student ${studentName} added successfully!`);
  //     setStudentName("");
  //     setStudentAddress("");
  //     viewStudents();
  //   } catch (error) {
  //     console.error("Error adding student:", error);
  //     alert("Failed to add student.");
  //   }
  // };

  // const addTeacher = async () => {
  //   if (!teacherName || !teacherAddress) {
  //     alert("Please enter both the teacher's name and address.");
  //     return;
  //   }

  //   try {
  //     await contract.methods
  //       .addTeacher(teacherAddress, teacherName)
  //       .send({ from: accounts[0] });
  //     alert(`Teacher ${teacherName} added successfully!`);
  //     setTeacherName("");
  //     setTeacherAddress("");
  //     viewTeachers();
  //   } catch (error) {
  //     console.error("Error adding teacher:", error);
  //     alert("Failed to add teacher.");
  //   }
  // };

  // const addSubject = async () => {
  //   if (!subjectName) {
  //     alert("Please enter the subject name.");
  //     return;
  //   }

  //   try {
  //     await contract.methods
  //       .createSubject(subjectName)
  //       .send({ from: accounts[0] });
  //     alert(`Subject ${subjectName} added successfully!`);
  //     setSubjectName("");
  //     viewSubjects(contract);
  //   } catch (error) {
  //     console.error("Error adding subject:", error);
  //     alert("Failed to add subject.");
  //   }
  // };

  // const addClass = async () => {
  //   if (!classDate || !subjectId) {
  //     alert("Please enter both the class date and subject ID.");
  //     return;
  //   }

  //   try {
  //     const timestamp = new Date(classDate).getTime() / 1000; // Convert date to UNIX timestamp
  //     const subject = await contract.methods.subjectDetails(subjectId).call();
  //     const subjectName = subject.subjectName;

  //     await contract.methods
  //       .createClass(timestamp, subjectId)
  //       .send({ from: accounts[0] });
  //     alert(`Class for ${subjectName} on ${classDate} added successfully!`);
  //     setClassDate("");
  //     setSubjectId("");
  //   } catch (error) {
  //     console.error("Error adding class:", error);
  //     alert("Failed to add class.");
  //   }
  // };

  // const assignTeacher = async () => {
  //   if (!assignTeacherSubjectId || !assignTeacherAddress) {
  //     alert("Please enter both the subject ID and teacher address.");
  //     return;
  //   }
  
  //   try {
  //     // Call the assignTeacher method from the contract
  //     await contract.methods
  //       .assignTeacher(assignTeacherSubjectId, assignTeacherAddress)
  //       .send({ from: accounts[0] });
  
  //     // View the subject name for the success message
  //     const subject = await contract.methods.subjectDetails(assignTeacherSubjectId).call();
  //     const subjectName = subject.subjectName;
  
  //     alert(`Teacher assigned to ${subjectName} successfully!`);
  
  //     // Clear inputs
  //     setAssignTeacherSubjectId("");
  //     setAssignTeacherAddress("");
  //   } catch (error) {
  //     console.error("Error assigning teacher:", error);
  //     alert("Failed to assign teacher.");
  //   }
  // };

  // const viewStudents = async () => {
  //   try {
  //     const studentCount = await contract.methods.studentCounter().call();
  //     const viewedStudents = [];
  //     for (let i = 1; i <= studentCount; i++) {
  //       const student = await contract.methods.students(i - 1).call();
  //       viewedStudents.push(student);
  //     }
  //     setStudents(viewedStudents);
  //   } catch (error) {
  //     console.error("Error viewing students:", error);
  //   }
  // };

  // const viewTeachers = async () => {
  //   try {
  //     const teacherCount = await contract.methods.teacherCounter().call();
  //     const viewedTeachers = [];
  //     for (let i = 1; i <= teacherCount; i++) {
  //       const teacher = await contract.methods.teachers(i - 1).call();
  //       viewedTeachers.push(teacher);
  //     }
  //     setTeachers(viewedTeachers);
  //   } catch (error) {
  //     console.error("Error viewing teachers:", error);
  //   }
  // };

  // const viewSubjects = async () => {
  //   try {
  //     const subjectCount = await contract.methods.subjectCounter().call();
  //     const viewedSubjects = [];
  //     for (let i = 1; i <= subjectCount; i++) {
  //       const subject = await contract.methods.subjectDetails(i).call();
  //       viewedSubjects.push(subject);
  //     }
  //     setSubjects(viewedSubjects);
  //   } catch (error) {
  //     console.error("Error viewing subjects:", error);
  //   }
  // };


// New Component for Role-Based Redirection
const RoleRedirector = ({ role }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "student") navigate("/student");
      else navigate("/");
    }, [role, navigate]);

    return null; // No UI, just redirection
  };

  return (

    <Router>
      <RoleRedirector role={role} />
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={role} requiredRole="admin">
              <AdminPage contract={contract} accounts={accounts}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role={role} requiredRole="teacher">
              <TeacherPage contract={contract} accounts={accounts}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute role={role} requiredRole="student">
              <StudentPage contract={contract} accounts={accounts}/>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Unauthorized />} />
      </Routes>
    </Router>

    // <div className="App">
    //   <h1>Attendance DApp</h1>
    //   <p>Your account: {accounts[0]}</p>

    //   <div className="section">
    //     <h2>Add a New Student</h2>
    //     <input
    //       type="text"
    //       placeholder="Student Name"
    //       value={studentName}
    //       onChange={(e) => setStudentName(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       placeholder="Student Address"
    //       value={studentAddress}
    //       onChange={(e) => setStudentAddress(e.target.value)}
    //     />
    //     <button onClick={addStudent}>Add Student</button>
    //   </div>

    //   <div className="section">
    //     <h2>Add a New Teacher</h2>
    //     <input
    //       type="text"
    //       placeholder="Teacher Name"
    //       value={teacherName}
    //       onChange={(e) => setTeacherName(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       placeholder="Teacher Address"
    //       value={teacherAddress}
    //       onChange={(e) => setTeacherAddress(e.target.value)}
    //     />
    //     <button onClick={addTeacher}>Add Teacher</button>
    //   </div>

    //   <div className="section">
    //     <h2>Add a New Subject</h2>
    //     <input
    //       type="text"
    //       placeholder="Subject Name"
    //       value={subjectName}
    //       onChange={(e) => setSubjectName(e.target.value)}
    //     />
    //     <button onClick={addSubject}>Add Subject</button>
    //   </div>

    //   <div className="section">
    //     <h2>Add a New Class</h2>
    //     <input
    //       type="date"
    //       value={classDate}
    //       onChange={(e) => setClassDate(e.target.value)}
    //     />
    //     <input
    //       type="number"
    //       placeholder="Subject ID"
    //       value={subjectId}
    //       onChange={(e) => setSubjectId(e.target.value)}
    //     />
    //     <button onClick={addClass}>Add Class</button>
    //   </div>

    //   <div className="section">
    //     <h2>Assign a Teacher to a Subject</h2>
    //     <input
    //       type="text"
    //       placeholder="Subject ID"
    //       value={assignTeacherSubjectId}
    //       onChange={(e) => setAssignTeacherSubjectId(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       placeholder="Teacher Address"
    //       value={assignTeacherAddress}
    //       onChange={(e) => setAssignTeacherAddress(e.target.value)}
    //     />
    //     <button onClick={assignTeacher}>Assign Teacher</button>
    //   </div>

    //   <h2>Lists</h2>
    //   <div className="lists-container">
    //     <div className="students-list">
    //       <h3>Students</h3>
    //       <button onClick={viewStudents}>View Students</button>
    //       <ul>
    //         {students.map((student, index) => (
    //           <li key={index}>{`${student.studentId}: ${student.name}`}</li>
    //         ))}
    //       </ul>
    //     </div>

    //     <div className="teachers-list">
    //       <h3>Teachers</h3>
    //       <button onClick={viewTeachers}>View Teachers</button>
    //       <ul>
    //         {teachers.map((teacher, index) => (
    //           <li key={index}>{`${teacher.teacherId}: ${teacher.name}`}</li>
    //         ))}
    //       </ul>
    //     </div>

    //     <div className="subjects-list">
    //       <h3>Subjects</h3>
    //       <button onClick={viewSubjects}>View Subjects</button>
    //       <ul>
    //         {subjects.map((subject, index) => (
    //           <li key={index}>{`${subject.subjectId}: ${subject.subjectName}`}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   </div>
    // </div>
  );
};

export default App;
