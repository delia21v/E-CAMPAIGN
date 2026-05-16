import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

function Petition() {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState("");
  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    city: "",
    message: "",
  });

  const token = localStorage.getItem("token");
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "active");

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res = await axios.get(`${API_URL}/api/campaigns`);
      setCampaigns(res.data);
      const firstActiveCampaign = res.data.find((campaign) => campaign.status === "active");
      if (firstActiveCampaign) setCampaignId(firstActiveCampaign._id);
    };

    fetchCampaigns().catch(() => alert("Campaniile nu au putut fi încărcate."));
  }, []);

  useEffect(() => {
    if (!campaignId) return;
    axios
      .get(`${API_URL}/api/petition/count/${campaignId}`)
      .then((res) => setCount(res.data.count))
      .catch(() => setCount(0));
  }, [campaignId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/petition/sign`,
        { ...form, campaignId },
        { headers: { Authorization: token } }
      );
      alert("Semnătura a fost înregistrată.");
      setForm({ fullName: "", email: "", city: "", message: "" });
      const res = await axios.get(`${API_URL}/api/petition/count/${campaignId}`);
      setCount(res.data.count);
    } catch (err) {
      alert(err.response?.data?.msg || "Semnătura nu a putut fi salvată.");
    }
  };

  return (
    <div className="two-column-layout">
      <section className="content-panel">
        <span className="eyebrow">Petiție online</span>
        <h1>Semnează pentru susținerea campaniei</h1>
        <p>
          Petiția demonstrează partea de e-campaign în care utilizatorii susțin cauza
          printr-o acțiune online salvată în baza de date.
        </p>
        <div className="signature-counter">
          <strong>{count}</strong>
          <span>semnături înregistrate</span>
        </div>
      </section>

      <form className="content-panel" onSubmit={handleSubmit}>
        <label className="form-label">Campanie</label>
        <select className="form-select mb-3" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} required>
          {activeCampaigns.map((campaign) => (
            <option value={campaign._id} key={campaign._id}>{campaign.title}</option>
          ))}
        </select>
        {activeCampaigns.length === 0 && (
          <p className="form-help">Nu există campanii active pentru petiție.</p>
        )}

        <label className="form-label">Nume complet</label>
        <input name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />

        <label className="form-label">Email</label>
        <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />

        <label className="form-label">Oraș</label>
        <input name="city" className="form-control" value={form.city} onChange={handleChange} required />

        <label className="form-label">Mesaj opțional</label>
        <textarea name="message" className="form-control" rows="4" value={form.message} onChange={handleChange} />

        <button className="btn btn-primary w-100 mt-2" disabled={!campaignId}>Semnează petiția</button>
      </form>
    </div>
  );
}

export default Petition;
