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
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();

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

  useEffect(() => {
    const fetchRole = async () => {
      if (contract && accounts.length > 0) {
        try {
          const userRole = await contract.methods.getRole(accounts[0]).call();
          console.log("Fetched role:", userRole);
          setRole(userRole);
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
    };
  
    fetchRole();
  }, [contract, accounts]);

const RoleRedirector = ({ role }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "student") navigate("/student");
      else navigate("/");
    }, [role, navigate]);

    return null;
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

  );
};

export default App;