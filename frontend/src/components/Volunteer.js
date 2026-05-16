import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

function Volunteer() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    age: "",
    motivation: "",
  });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/volunteers/apply`,
        { ...form, age: Number(form.age) },
        { headers: { Authorization: token } }
      );
      alert("Cererea de voluntariat a fost trimisa.");
      setForm({ fullName: "", email: "", phone: "", city: "", age: "", motivation: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "Cererea nu a putut fi trimisa.");
    }
  };

  return (
    <div className="two-column-layout">
      <section className="content-panel">
        <span className="eyebrow">Adeziuni si voluntariat</span>
        <h1>Inscrie-te ca voluntar</h1>
        <p>
          Formularul simuleaza procesul prin care un ONG primeste cereri de implicare,
          apoi administratorul le poate aproba sau respinge.
        </p>
      </section>

      <form className="content-panel" onSubmit={handleSubmit}>
        <label className="form-label">Nume complet</label>
        <input name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />

        <label className="form-label">Email</label>
        <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />

        <label className="form-label">Telefon</label>
        <input name="phone" className="form-control" value={form.phone} onChange={handleChange} required />

        <label className="form-label">Oras</label>
        <input name="city" className="form-control" value={form.city} onChange={handleChange} required />

        <label className="form-label">Varsta</label>
        <input name="age" type="number" min="14" className="form-control" value={form.age} onChange={handleChange} required />

        <label className="form-label">Motivatie</label>
        <textarea name="motivation" className="form-control" rows="5" value={form.motivation} onChange={handleChange} required />

        <button className="btn btn-primary w-100 mt-2">Trimite cererea</button>
      </form>
    </div>
  );
}

export default Volunteer;
