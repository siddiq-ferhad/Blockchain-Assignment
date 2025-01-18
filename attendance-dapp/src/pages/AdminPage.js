import React, { useState } from "react";

const AdminPage = ({ contract, accounts }) => {
  const [userAddress, setUserAddress] = useState("");
  const [role, setRole] = useState("");

  const assignRole = async () => {
    if (!userAddress || !role) {
      alert("Please enter both the user address and role.");
      return;
    }

    try {
      await contract.methods
        .assignRole(userAddress, role)
        .send({ from: accounts[0] }); // Assuming accounts[0] is the admin
      alert(`Role ${role} assigned to ${userAddress} successfully!`);
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Failed to assign role.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Assign Role</h2>
      <input
        type="text"
        placeholder="User Address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Role (e.g., admin, teacher, student)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={assignRole}>Assign Role</button>
    </div>
  );
};

export default AdminPage;
