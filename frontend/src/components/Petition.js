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

    fetchCampaigns().catch(() => alert("Campaniile nu au putut fi incarcate."));
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
      alert("Semnatura a fost inregistrata.");
      setForm({ fullName: "", email: "", city: "", message: "" });
      const res = await axios.get(`${API_URL}/api/petition/count/${campaignId}`);
      setCount(res.data.count);
    } catch (err) {
      alert(err.response?.data?.msg || "Semnatura nu a putut fi salvata.");
    }
  };

  return (
    <div className="two-column-layout">
      <section className="content-panel">
        <span className="eyebrow">Petitie online</span>
        <h1>Semneaza pentru sustinerea campaniei</h1>
        <p>
          Petitia demonstreaza partea de e-campaign in care utilizatorii sustin cauza
          printr-o actiune online salvata in baza de date.
        </p>
        <div className="signature-counter">
          <strong>{count}</strong>
          <span>semnaturi inregistrate</span>
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
          <p className="form-help">Nu exista campanii active pentru petitie.</p>
        )}

        <label className="form-label">Nume complet</label>
        <input name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />

        <label className="form-label">Email</label>
        <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />

        <label className="form-label">Oras</label>
        <input name="city" className="form-control" value={form.city} onChange={handleChange} required />

        <label className="form-label">Mesaj optional</label>
        <textarea name="message" className="form-control" rows="4" value={form.message} onChange={handleChange} />

        <button className="btn btn-primary w-100 mt-2" disabled={!campaignId}>Semneaza petitia</button>
      </form>
    </div>
  );
}

export default Petition;
