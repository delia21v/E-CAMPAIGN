import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "";

function Forum() {
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({ title: "", body: "" });
  const token = localStorage.getItem("token");

  const fetchTopics = async () => {
    const res = await axios.get(`${API_URL}/api/forum/topics`);
    setTopics(res.data);
  };

  useEffect(() => {
    fetchTopics().catch(() => alert("Forumul nu a putut fi incarcat."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Trebuie sa fii autentificat pentru a posta.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/forum/topics`, form, { headers: { Authorization: token } });
      setForm({ title: "", body: "" });
      fetchTopics();
    } catch (err) {
      alert("Topic-ul nu a putut fi creat.");
    }
  };

  return (
    <div className="two-column-layout forum-layout">
      <section>
        <div className="page-heading">
          <span className="eyebrow">Comunitate</span>
          <h1>Forum</h1>
          <p>Spatiu pentru discutii despre campanie, voluntariat si actiuni locale.</p>
        </div>

        <div className="topic-list">
          {topics.map((topic) => (
            <Link className="topic-row" to={`/forum/${topic._id}`} key={topic._id}>
              <div>
                <h2>{topic.title}</h2>
                <p>{topic.body}</p>
              </div>
              <span>{topic.authorId?.username || "utilizator"}</span>
            </Link>
          ))}
          {topics.length === 0 && <p>Nu exista discutii inca.</p>}
        </div>
      </section>

      <form className="content-panel" onSubmit={handleSubmit}>
        <h2>Deschide o discutie</h2>
        <label className="form-label">Titlu</label>
        <input name="title" className="form-control" value={form.title} onChange={handleChange} required />

        <label className="form-label">Mesaj</label>
        <textarea name="body" className="form-control" rows="6" value={form.body} onChange={handleChange} required />

        <button className="btn btn-primary w-100 mt-2">Publica</button>
      </form>
    </div>
  );
}

export default Forum;
