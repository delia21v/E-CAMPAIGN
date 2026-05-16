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
    fetchTopic().catch(() => alert("Discutia nu a putut fi incarcata."));
  }, [fetchTopic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Trebuie sa fii autentificat pentru a raspunde.");
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
      alert("Raspunsul nu a putut fi salvat.");
    }
  };

  if (!topic) return <p>Se incarca...</p>;

  return (
    <div>
      <Link to="/forum" className="small-link">Inapoi la forum</Link>
      <article className="content-panel mt-3">
        <span className="eyebrow">Discutie</span>
        <h1>{topic.title}</h1>
        <p>{topic.body}</p>
        <span className="meta-line">Autor: {topic.authorId?.username || "utilizator"}</span>
      </article>

      <section className="reply-list">
        <h2>Raspunsuri</h2>
        {replies.map((reply) => (
          <div className="reply-item" key={reply._id}>
            <p>{reply.body}</p>
            <span>{reply.authorId?.username || "utilizator"}</span>
          </div>
        ))}
        {replies.length === 0 && <p>Nu exista raspunsuri inca.</p>}
      </section>

      <form className="content-panel mt-4" onSubmit={handleSubmit}>
        <label className="form-label">Raspunsul tau</label>
        <textarea className="form-control" rows="4" value={body} onChange={(e) => setBody(e.target.value)} required />
        <button className="btn btn-primary mt-2">Trimite raspunsul</button>
      </form>
    </div>
  );
}

export default ForumTopic;
