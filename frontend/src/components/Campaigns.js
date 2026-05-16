import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">Cauze active</span>
        <h1>Campanii</h1>
        <p>Campanii sociale gestionate de organizatie, cu petitii, donatii si implicare civica.</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="content-panel">
          <h2>Nu exista campanii inca</h2>
          <p>Intra ca administrator si adauga prima campanie pentru demo.</p>
        </div>
      ) : (
        <div className="row g-4">
          {campaigns.map((campaign) => (
            <div className="col-md-6 col-lg-4" key={campaign._id}>
              <article className="campaign-card">
                <div className="campaign-card-media">
                  <span>{campaign.category || "social"}</span>
                </div>
                <div className="campaign-card-body">
                  <div className="status-pill">{campaign.status}</div>
                  <h2>{campaign.title}</h2>
                  <p>{campaign.summary}</p>
                  <p className="goal-line">{campaign.goal}</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <Link className="btn btn-primary btn-sm" to="/petition">Semneaza</Link>
                    <Link className="btn btn-outline-primary btn-sm" to="/donate">Doneaza</Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Campaigns;
