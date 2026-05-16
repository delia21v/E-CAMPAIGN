import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "";

function ForumTopic() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [body, setBody] = useState("");
  const token = localStorage.getItem("token");

  const fetchTopic = useCallback(async () => {
    const res = await axios.get(`${API_URL}/api/forum/topics/${id}`);
    setTopic(res.data.topic);
    setReplies(res.data.replies);
  }, [id]);

  useEffect(() => {
    fetchTopic().catch(() => alert("Discuția nu a putut fi încărcată."));
  }, [fetchTopic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Trebuie să fii autentificat pentru a răspunde.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/forum/topics/${id}/replies`,
        { body },
        { headers: { Authorization: token } }
      );
      setBody("");
      fetchTopic();
    } catch (err) {
      alert("Răspunsul nu a putut fi salvat.");
    }
  };

  if (!topic) return <p>Se încarcă...</p>;

  return (
    <div>
      <Link to="/forum" className="small-link">Înapoi la forum</Link>
      <article className="content-panel mt-3">
        <span className="eyebrow">Discuție</span>
        <h1>{topic.title}</h1>
        <p>{topic.body}</p>
        <span className="meta-line">Autor: {topic.authorId?.username || "utilizator"}</span>
      </article>

      <section className="reply-list">
        <h2>Răspunsuri</h2>
        {replies.map((reply) => (
          <div className="reply-item" key={reply._id}>
            <p>{reply.body}</p>
            <span>{reply.authorId?.username || "utilizator"}</span>
          </div>
        ))}
        {replies.length === 0 && <p>Nu există răspunsuri încă.</p>}
      </section>

      <form className="content-panel mt-4" onSubmit={handleSubmit}>
        <label className="form-label">Răspunsul tău</label>
        <textarea className="form-control" rows="4" value={body} onChange={(e) => setBody(e.target.value)} required />
        <button className="btn btn-primary mt-2">Trimite răspunsul</button>
      </form>
    </div>
  );
}

export default ForumTopic;
