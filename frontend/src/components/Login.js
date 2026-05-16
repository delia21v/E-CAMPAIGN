import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      localStorage.setItem("username", res.data.username);
      alert("Autentificare reusita!");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.msg || "Eroare la login. Verifica daca backend-ul este pornit.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Parolele nu coincid!");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/users/register`, { username, email, password });
      alert("Inregistrare reusita! Te poti autentifica.");
      setIsRegister(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Eroare la inregistrare. Incearca un alt nume.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="content-panel auth-panel">
        <h1>{isRegister ? "Inregistrare" : "Autentificare"}</h1>
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <label className="form-label">Nume utilizator</label>
          <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />

          {isRegister && (
            <>
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </>
          )}

          <label className="form-label">Parola</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {isRegister && (
            <>
              <label className="form-label">Confirma parola</label>
              <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-2 mb-3">
            {isRegister ? "Inregistreaza-te" : "Autentifica-te"}
          </button>
        </form>
        <button className="btn btn-outline-secondary w-100" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Ai deja cont? Autentifica-te" : "Nu ai cont? Inregistreaza-te"}
        </button>
      </div>
    </div>
  );
}

export default Login;
