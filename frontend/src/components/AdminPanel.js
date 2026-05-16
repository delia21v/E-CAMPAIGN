import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

function AdminPanel() {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [signatures, setSignatures] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationStats, setDonationStats] = useState({ totalAmount: 0, totalCount: 0 });
  const [volunteers, setVolunteers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [campaignForm, setCampaignForm] = useState({
    title: "",
    summary: "",
    description: "",
    category: "social",
    goal: "",
    targetAmount: 0,
    status: "active",
  });

  const authConfig = { headers: { Authorization: token } };

  const fetchCampaigns = async () => {
    const res = await axios.get(`${API_URL}/api/campaigns`);
    setCampaigns(res.data);
    if (res.data[0] && !selectedCampaignId) {
      setSelectedCampaignId(res.data[0]._id);
      fetchSignatures(res.data[0]._id);
    }
  };

  const fetchSignatures = async (campaignId) => {
    if (!campaignId) return;
    const res = await axios.get(`${API_URL}/api/petition/signatures/${campaignId}`, authConfig);
    setSignatures(res.data);
  };

  const fetchDonations = async () => {
    const [donationRes, statsRes] = await Promise.all([
      axios.get(`${API_URL}/api/donations`, authConfig),
      axios.get(`${API_URL}/api/donations/stats`, authConfig),
    ]);
    setDonations(donationRes.data);
    setDonationStats(statsRes.data);
  };

  const fetchVolunteers = async () => {
    const res = await axios.get(`${API_URL}/api/volunteers`, authConfig);
    setVolunteers(res.data);
  };

  const fetchTopics = async () => {
    const res = await axios.get(`${API_URL}/api/forum/topics`);
    setTopics(res.data);
  };

  const fetchAll = async () => {
    try {
      await Promise.all([fetchCampaigns(), fetchDonations(), fetchVolunteers(), fetchTopics()]);
    } catch (err) {
      alert("Datele de administrare nu au putut fi incarcate.");
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCampaignChange = (e) => {
    setCampaignForm({ ...campaignForm, [e.target.name]: e.target.value });
  };

  const handleAddCampaign = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/campaigns`,
        { ...campaignForm, targetAmount: Number(campaignForm.targetAmount) },
        authConfig
      );
      setCampaignForm({
        title: "",
        summary: "",
        description: "",
        category: "social",
        goal: "",
        targetAmount: 0,
        status: "active",
      });
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.msg || "Campania nu a putut fi adaugata.");
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("Stergi aceasta campanie?")) return;
    await axios.delete(`${API_URL}/api/campaigns/${id}`, authConfig);
    fetchCampaigns();
  };

  const handleSelectedCampaign = (id) => {
    setSelectedCampaignId(id);
    fetchSignatures(id).catch(() => alert("Semnaturile nu au putut fi incarcate."));
  };

  const updateVolunteerStatus = async (id, status) => {
    await axios.patch(`${API_URL}/api/volunteers/${id}/status`, { status }, authConfig);
    fetchVolunteers();
  };

  const deleteTopic = async (id) => {
    if (!window.confirm("Stergi acest topic si raspunsurile lui?")) return;
    await axios.delete(`${API_URL}/api/forum/topics/${id}`, authConfig);
    fetchTopics();
  };

  const tabs = [
    ["campaigns", "Campanii"],
    ["signatures", "Semnaturi"],
    ["donations", "Donatii"],
    ["volunteers", "Voluntari"],
    ["forum", "Forum"],
  ];

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">Administrare</span>
        <h1>Panou administrator</h1>
        <p>Gestionarea bazei de date pentru sistemul e-campaign.</p>
      </div>

      <div className="admin-tabs">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            className={activeTab === id ? "active" : ""}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "campaigns" && (
        <section className="admin-grid">
          <form className="content-panel" onSubmit={handleAddCampaign}>
            <h2>Adauga o campanie</h2>
            <label className="form-label">Titlu</label>
            <input name="title" className="form-control" value={campaignForm.title} onChange={handleCampaignChange} required />
            <label className="form-label">Rezumat</label>
            <input name="summary" className="form-control" value={campaignForm.summary} onChange={handleCampaignChange} required />
            <label className="form-label">Descriere</label>
            <textarea name="description" rows="5" className="form-control" value={campaignForm.description} onChange={handleCampaignChange} required />
            <label className="form-label">Categorie</label>
            <input name="category" className="form-control" value={campaignForm.category} onChange={handleCampaignChange} />
            <label className="form-label">Obiectiv</label>
            <input name="goal" className="form-control" value={campaignForm.goal} onChange={handleCampaignChange} />
            <label className="form-label">Tinta donatii</label>
            <input name="targetAmount" type="number" className="form-control" value={campaignForm.targetAmount} onChange={handleCampaignChange} />
            <button className="btn btn-primary w-100 mt-2">Salveaza campania</button>
          </form>

          <div className="content-panel">
            <h2>Campanii existente</h2>
            <div className="admin-list">
              {campaigns.map((campaign) => (
                <div className="admin-row" key={campaign._id}>
                  <div>
                    <strong>{campaign.title}</strong>
                    <span>{campaign.status} - {campaign.category}</span>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCampaign(campaign._id)}>
                    Sterge
                  </button>
                </div>
              ))}
              {campaigns.length === 0 && <p>Nu exista campanii.</p>}
            </div>
          </div>
        </section>
      )}

      {activeTab === "signatures" && (
        <section className="content-panel">
          <h2>Semnaturi petitie</h2>
          <select className="form-select mb-3" value={selectedCampaignId} onChange={(e) => handleSelectedCampaign(e.target.value)}>
            {campaigns.map((campaign) => (
              <option value={campaign._id} key={campaign._id}>{campaign.title}</option>
            ))}
          </select>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nume</th>
                  <th>Email</th>
                  <th>Oras</th>
                  <th>Mesaj</th>
                </tr>
              </thead>
              <tbody>
                {signatures.map((signature) => (
                  <tr key={signature._id}>
                    <td>{signature.fullName}</td>
                    <td>{signature.email}</td>
                    <td>{signature.city}</td>
                    <td>{signature.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {signatures.length === 0 && <p>Nu exista semnaturi pentru campania selectata.</p>}
        </section>
      )}

      {activeTab === "donations" && (
        <section className="content-panel">
          <h2>Donatii simulate</h2>
          <div className="impact-grid compact">
            <div className="impact-item">
              <strong>{donationStats.totalAmount || 0} RON</strong>
              <span>total confirmat</span>
            </div>
            <div className="impact-item">
              <strong>{donationStats.totalCount || 0}</strong>
              <span>donatii</span>
            </div>
          </div>
          <div className="admin-list mt-3">
            {donations.map((donation) => (
              <div className="admin-row" key={donation._id}>
                <div>
                  <strong>{donation.donorName} - {donation.amount} {donation.currency}</strong>
                  <span>{donation.campaignId?.title || "campanie"} - {donation.status}</span>
                </div>
              </div>
            ))}
            {donations.length === 0 && <p>Nu exista donatii.</p>}
          </div>
        </section>
      )}

      {activeTab === "volunteers" && (
        <section className="content-panel">
          <h2>Cereri voluntariat</h2>
          <div className="admin-list">
            {volunteers.map((volunteer) => (
              <div className="admin-row" key={volunteer._id}>
                <div>
                  <strong>{volunteer.fullName}</strong>
                  <span>{volunteer.email} - {volunteer.city} - status: {volunteer.status}</span>
                  <p>{volunteer.motivation}</p>
                </div>
                <div className="button-stack">
                  <button className="btn btn-sm btn-success" onClick={() => updateVolunteerStatus(volunteer._id, "approved")}>Aproba</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => updateVolunteerStatus(volunteer._id, "rejected")}>Respinge</button>
                </div>
              </div>
            ))}
            {volunteers.length === 0 && <p>Nu exista cereri.</p>}
          </div>
        </section>
      )}

      {activeTab === "forum" && (
        <section className="content-panel">
          <h2>Moderare forum</h2>
          <div className="admin-list">
            {topics.map((topic) => (
              <div className="admin-row" key={topic._id}>
                <div>
                  <strong>{topic.title}</strong>
                  <span>autor: {topic.authorId?.username || "utilizator"}</span>
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTopic(topic._id)}>
                  Sterge
                </button>
              </div>
            ))}
            {topics.length === 0 && <p>Nu exista topicuri.</p>}
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminPanel;
