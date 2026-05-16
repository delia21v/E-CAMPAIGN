import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

function getVolunteerStatusLabel(status) {
  if (status === "approved") return "aprobată";
  if (status === "rejected") return "respinsă";
  return "în așteptare";
}

function Volunteer() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    age: "",
    motivation: "",
  });
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchMyApplication = async () => {
    const res = await axios.get(`${API_URL}/api/volunteers/me`, {
      headers: { Authorization: token },
    });
    setApplication(res.data);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMyApplication()
      .catch(() => alert("Cererea ta de voluntariat nu a putut fi încărcată."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/volunteers/apply`,
        { ...form, age: Number(form.age) },
        { headers: { Authorization: token } }
      );
      alert("Cererea de voluntariat a fost trimisă.");
      setApplication(res.data);
      setForm({ fullName: "", email: "", phone: "", city: "", age: "", motivation: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "Cererea nu a putut fi trimisă.");
    }
  };

  if (loading) return <p>Se încarcă...</p>;

  if (!token) {
    return (
      <div className="two-column-layout">
        <section className="content-panel">
          <span className="eyebrow">Adeziuni și voluntariat</span>
          <h1>Înscrie-te ca voluntar</h1>
          <p>
            Pentru a trimite o cerere de voluntariat și pentru a vedea răspunsul
            administratorului, trebuie să fii autentificat.
          </p>
        </section>

        <section className="content-panel">
          <h2>Autentificare necesară</h2>
          <p>Intră în cont sau creează un cont nou, apoi revino pe pagina de voluntariat.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="two-column-layout">
      <section className="content-panel">
        <span className="eyebrow">Adeziuni și voluntariat</span>
        <h1>Înscrie-te ca voluntar</h1>
        <p>
          Formularul simulează procesul prin care un ONG primește cereri de implicare,
          apoi administratorul le poate aproba sau respinge.
        </p>
      </section>

      {application ? (
        <section className="content-panel">
          <span className="eyebrow">Cererea ta</span>
          <h2>Status: {getVolunteerStatusLabel(application.status)}</h2>
          <p>
            Ai trimis deja o cerere de voluntariat. Formularul nu mai este afișat
            pentru a evita înscrierile duplicate.
          </p>
          <div className="application-details">
            <strong>{application.fullName}</strong>
            <span>{application.email} - {application.city}</span>
            <span>Telefon: {application.phone}</span>
            <span>Vârstă: {application.age}</span>
            <p>{application.motivation}</p>
          </div>
        </section>
      ) : (
        <form className="content-panel" onSubmit={handleSubmit}>
          <label className="form-label">Nume complet</label>
          <input name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />

          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />

          <label className="form-label">Telefon</label>
          <input name="phone" className="form-control" value={form.phone} onChange={handleChange} required />

          <label className="form-label">Oraș</label>
          <input name="city" className="form-control" value={form.city} onChange={handleChange} required />

          <label className="form-label">Vârstă</label>
          <input name="age" type="number" min="14" className="form-control" value={form.age} onChange={handleChange} required />

          <label className="form-label">Motivație</label>
          <textarea name="motivation" className="form-control" rows="5" value={form.motivation} onChange={handleChange} required />

          <button className="btn btn-primary w-100 mt-2">Trimite cererea</button>
        </form>
      )}
    </div>
  );
}

export default Volunteer;
