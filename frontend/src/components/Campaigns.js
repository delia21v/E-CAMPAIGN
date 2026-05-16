import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "";

function getStatusLabel(status) {
  if (status === "active") return "activ";
  return "inactiv";
}

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "active");
  const completedCampaigns = campaigns.filter((campaign) => campaign.status !== "active");

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/campaigns`);
        setCampaigns(res.data);
      } catch (err) {
        alert("Campaniile nu au putut fi incarcate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <p>Se incarca...</p>;

  const renderCampaignCard = (campaign) => (
    <div className="col-md-6 col-lg-4" key={campaign._id}>
      <article className="campaign-card">
        <div
          className={`campaign-card-media${campaign.imageUrl ? " has-image" : ""}`}
          style={
            campaign.imageUrl
              ? { backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.42)), url(${getImageUrl(campaign.imageUrl)})` }
              : undefined
          }
        >
          <span>{campaign.category || "social"}</span>
        </div>
        <div className="campaign-card-body">
          <div className="status-pill">{getStatusLabel(campaign.status)}</div>
          <h2>{campaign.title}</h2>
          <p>{campaign.summary}</p>
          <p className="goal-line">{campaign.goal}</p>
          <div className="d-flex gap-2 flex-wrap">
            {campaign.status === "active" ? (
              <>
                <Link className="btn btn-primary btn-sm" to="/petition">Semneaza</Link>
                <Link className="btn btn-outline-primary btn-sm" to="/donate">Doneaza</Link>
              </>
            ) : (
              <span className="status-note">Tinta atinsa - campanie incheiata cu succes</span>
            )}
          </div>
        </div>
      </article>
    </div>
  );

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">Cauze si rezultate</span>
        <h1>Campanii</h1>
        <p>Campanii sociale gestionate de organizatie, cu petitii, donatii si implicare civica.</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="content-panel">
          <h2>Nu exista campanii inca</h2>
          <p>Intra ca administrator si adauga prima campanie pentru demo.</p>
        </div>
      ) : (
        <>
          <section className="campaign-section">
            <div className="section-heading">
              <span className="eyebrow">In desfasurare</span>
              <h2>Campanii active</h2>
            </div>
            {activeCampaigns.length === 0 ? (
              <div className="content-panel">
                <p>Nu exista campanii active in acest moment.</p>
              </div>
            ) : (
              <div className="row g-4">
                {activeCampaigns.map(renderCampaignCard)}
              </div>
            )}
          </section>

          <section className="campaign-section">
            <div className="section-heading">
              <span className="eyebrow">Rezultate</span>
              <h2>Campanii incheiate cu succes</h2>
            </div>
            {completedCampaigns.length === 0 ? (
              <div className="content-panel">
                <p>Campaniile finalizate vor aparea aici dupa atingerea tintei de donatii.</p>
              </div>
            ) : (
              <div className="row g-4">
                {completedCampaigns.map(renderCampaignCard)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Campaigns;
