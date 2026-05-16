import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/users/register`, { username, email, password });
      alert("Inregistrare reusita!");
      window.location.href = "/login";
    } catch (err) {
      alert("Eroare la inregistrare");
    }
  };

  return (
    <form onSubmit={handleRegister} className="content-panel auth-panel">
      <h1>Inregistrare</h1>
      <label className="form-label">Username</label>
      <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <label className="form-label">Email</label>
      <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label className="form-label">Password</label>
      <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn btn-primary w-100 mt-2">Register</button>
    </form>
  );
}

export default Register;
