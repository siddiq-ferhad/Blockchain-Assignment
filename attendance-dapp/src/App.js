import React, { useState, useEffect } from "react";
import getWeb3 from "./utils/getWeb3";
import AttendanceContract from "./contracts/Attendance.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Get Web3 instance
        const web3 = await getWeb3();
        setWeb3(web3);

        // Get user's accounts
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        // Get the contract instance
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AttendanceContract.networks[networkId];
        const instance = new web3.eth.Contract(
          AttendanceContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);
      } catch (error) {
        console.error("Error connecting to Web3:", error);
      }
    };

    init();
  }, []);

  const addStudent = async (studentAddress, studentName) => {
    try {
      await contract.methods.addStudent(studentAddress, studentName).send({
        from: accounts[0],
      });
      alert("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <div>
      <h1>Attendance DApp</h1>
      <p>Connected Account: {accounts[0]}</p>
      <button
        onClick={() =>
          addStudent("0x5310bF9b55CD0d1b902A191F9e15Aa00Ad11B803", "John Doe") // Replace with test address/name
        }
      >
        Add Student
      </button>
    </div>
  );
}

export default App;
