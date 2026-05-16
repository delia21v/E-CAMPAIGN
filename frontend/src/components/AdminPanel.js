import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

function getRequestErrorMessage(err) {
  if (err.response) {
    return `${err.response.status} - ${err.response.data?.msg || "eroare de la server"}`;
  }
  if (err.request) {
    return "backend-ul nu raspunde";
  }
  return err.message || "eroare necunoscuta";
}

function AdminPanel() {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("campaigns");
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [signatures, setSignatures] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationStats, setDonationStats] = useState({ totalAmount: 0, totalCount: 0 });
  const [volunteers, setVolunteers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [campaignImage, setCampaignImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
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
    const loadStep = async (label, action) => {
      try {
        await action();
      } catch (err) {
        err.adminSection = label;
        throw err;
      }
    };

    try {
      await Promise.all([
        loadStep("campanii", fetchCampaigns),
        loadStep("donatii", fetchDonations),
        loadStep("voluntari", fetchVolunteers),
        loadStep("forum", fetchTopics),
      ]);
    } catch (err) {
      console.error("Eroare incarcare admin:", err);
      alert(`Datele de administrare nu au putut fi incarcate (${err.adminSection || "general"}: ${getRequestErrorMessage(err)}).`);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCampaignChange = (e) => {
    setCampaignForm({ ...campaignForm, [e.target.name]: e.target.value });
  };

  const handleCampaignImageChange = (e) => {
    setCampaignImage(e.target.files[0] || null);
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      title: "",
      summary: "",
      description: "",
      category: "social",
      goal: "",
      targetAmount: 0,
      status: "active",
    });
    setCampaignImage(null);
    setEditingCampaignId(null);
    setFileInputKey((current) => current + 1);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaignId(campaign._id);
    setCampaignForm({
      title: campaign.title || "",
      summary: campaign.summary || "",
      description: campaign.description || "",
      category: campaign.category || "social",
      goal: campaign.goal || "",
      targetAmount: campaign.targetAmount || 0,
      status: campaign.status || "active",
    });
    setCampaignImage(null);
    setFileInputKey((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(campaignForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (campaignImage) {
        formData.append("image", campaignImage);
      }

      if (editingCampaignId) {
        await axios.put(
          `${API_URL}/api/campaigns/${editingCampaignId}`,
          formData,
          { headers: { Authorization: token } }
        );
      } else {
        await axios.post(
          `${API_URL}/api/campaigns`,
          formData,
          { headers: { Authorization: token } }
        );
      }

      resetCampaignForm();
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.msg || "Campania nu a putut fi salvata.");
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
          <form className="content-panel" onSubmit={handleSaveCampaign}>
            <h2>{editingCampaignId ? "Editeaza campania" : "Adauga o campanie"}</h2>
            <label className="form-label">Titlu</label>
            <input name="title" className="form-control" value={campaignForm.title} onChange={handleCampaignChange} required />
            <label className="form-label">Rezumat</label>
            <input name="summary" className="form-control" value={campaignForm.summary} onChange={handleCampaignChange} required />
            <label className="form-label">Descriere</label>
            <textarea name="description" rows="5" className="form-control" value={campaignForm.description} onChange={handleCampaignChange} required />
            <label className="form-label">Categorie</label>
            <input name="category" className="form-control" value={campaignForm.category} onChange={handleCampaignChange} />
            <label className="form-label">Status</label>
            <select name="status" className="form-select" value={campaignForm.status} onChange={handleCampaignChange}>
              <option value="active">active</option>
              <option value="closed">closed</option>
            </select>
            <label className="form-label">Obiectiv</label>
            <input name="goal" className="form-control" value={campaignForm.goal} onChange={handleCampaignChange} />
            <label className="form-label">Tinta donatii</label>
            <input name="targetAmount" type="number" className="form-control" value={campaignForm.targetAmount} onChange={handleCampaignChange} />
            <label className="form-label">Imagine campanie</label>
            <input
              key={fileInputKey}
              name="image"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleCampaignImageChange}
            />
            <p className="form-help">
              {editingCampaignId
                ? "Alege o imagine noua doar daca vrei sa o inlocuiesti pe cea existenta."
                : "Imaginea este optionala, dar ajuta cardul campaniei sa arate mai bine."}
            </p>
            <div className="button-stack mt-2">
              <button className="btn btn-primary flex-fill">
                {editingCampaignId ? "Salveaza modificarile" : "Salveaza campania"}
              </button>
              {editingCampaignId && (
                <button type="button" className="btn btn-outline-secondary flex-fill" onClick={resetCampaignForm}>
                  Anuleaza
                </button>
              )}
            </div>
          </form>

          <div className="content-panel">
            <h2>Campanii existente</h2>
            <div className="admin-list">
              {campaigns.map((campaign) => (
                <div className="admin-row" key={campaign._id}>
                  <div>
                    <strong>{campaign.title}</strong>
                    <span>{campaign.status} - {campaign.category}{campaign.imageUrl ? " - imagine adaugata" : ""}</span>
                  </div>
                  <div className="button-stack">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditCampaign(campaign)}>
                      Editeaza
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCampaign(campaign._id)}>
                      Sterge
                    </button>
                  </div>
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
