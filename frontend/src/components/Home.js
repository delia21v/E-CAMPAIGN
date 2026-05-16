import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Campanie socială non-profit</span>
          <h1>Vocea pentru Copii</h1>
          <p>
            Platformă online pentru petiții, voluntariat, donații simulate și discuții
            comunitare dedicate unei campanii de sprijin pentru copii vulnerabili.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/petition">Semnează petițiile</Link>
            <Link className="btn btn-outline-primary" to="/campaigns">Vezi campaniile</Link>
          </div>
        </div>
      </section>

      <section className="row g-4 mt-4">
        <div className="col-md-3">
          <Link className="feature-card feature-link" to="/petition">
            <h3>Petiție</h3>
            <p>Utilizatorii autentificați susțin cauza prin semnături salvate în baza de date.</p>
          </Link>
        </div>
        <div className="col-md-3">
          <Link className="feature-card feature-link" to="/volunteer">
            <h3>Voluntariat</h3>
            <p>Cererile de adeziune sunt trimise online și aprobate de administrator.</p>
          </Link>
        </div>
        <div className="col-md-3">
          <Link className="feature-card feature-link" to="/donate">
            <h3>Donații</h3>
            <p>Flux de donație simulat, suficient pentru demo și sigur pentru proiect.</p>
          </Link>
        </div>
        <div className="col-md-3">
          <Link className="feature-card feature-link" to="/forum">
            <h3>Forum</h3>
            <p>Comunitatea deschide discuții, iar adminul poate modera conținutul.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
