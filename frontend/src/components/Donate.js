import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

function Donate() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    campaignId: "",
    donorName: "",
    email: "",
    amount: 50,
  });
  const [receipt, setReceipt] = useState(null);
  const token = localStorage.getItem("token");
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "active");

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res = await axios.get(`${API_URL}/api/campaigns`);
      setCampaigns(res.data);
      const firstActiveCampaign = res.data.find((campaign) => campaign.status === "active");
      if (firstActiveCampaign) setForm((current) => ({ ...current, campaignId: firstActiveCampaign._id }));
    };

    fetchCampaigns().catch(() => alert("Campaniile nu au putut fi incarcate."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setAmount = (amount) => {
    setForm({ ...form, amount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/donations`,
        { ...form, amount: Number(form.amount) },
        { headers: { Authorization: token } }
      );
      setReceipt(res.data.donation);
      alert("Donatie simulata confirmata.");
    } catch (err) {
      alert(err.response?.data?.msg || "Donatia nu a putut fi salvata.");
    }
  };

  return (
    <div className="two-column-layout">
      <section className="content-panel">
        <span className="eyebrow">Donatii online</span>
        <h1>Doneaza pentru campanie</h1>
        <p>
          Pentru proiect, plata este simulata: se salveaza suma, campania si statusul
          donatiei, fara date reale de card.
        </p>
        <div className="amount-grid">
          {[25, 50, 100, 250].map((amount) => (
            <button type="button" className="amount-button" onClick={() => setAmount(amount)} key={amount}>
              {amount} RON
            </button>
          ))}
        </div>
        {receipt && (
          <div className="alert alert-success mt-3">
            Donatie confirmata: {receipt.amount} {receipt.currency}, status {receipt.status}.
          </div>
        )}
      </section>

      <form className="content-panel" onSubmit={handleSubmit}>
        <label className="form-label">Campanie</label>
        <select name="campaignId" className="form-select mb-3" value={form.campaignId} onChange={handleChange} required>
          {activeCampaigns.map((campaign) => (
            <option value={campaign._id} key={campaign._id}>{campaign.title}</option>
          ))}
        </select>

        <label className="form-label">Nume donator</label>
        <input name="donorName" className="form-control" value={form.donorName} onChange={handleChange} required />

        <label className="form-label">Email</label>
        <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />

        <label className="form-label">Suma</label>
        <input name="amount" type="number" min="1" className="form-control" value={form.amount} onChange={handleChange} required />

        <button className="btn btn-primary w-100 mt-2" disabled={!form.campaignId}>Confirma donatia</button>
        {activeCampaigns.length === 0 && (
          <p className="form-help">Nu exista campanii active pentru donatii.</p>
        )}
      </form>
    </div>
  );
}

export default Donate;
