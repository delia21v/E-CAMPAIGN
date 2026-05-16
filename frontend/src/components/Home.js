import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Campanie sociala non-profit</span>
          <h1>Vocea pentru Copii</h1>
          <p>
            Platforma online pentru petitii, voluntariat, donatii simulate si discutii
            comunitare dedicate unei campanii de sprijin pentru copii vulnerabili.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/petition">Semneaza petitia</Link>
            <Link className="btn btn-outline-primary" to="/campaigns">Vezi campaniile</Link>
          </div>
        </div>
      </section>

      <section className="row g-4 mt-4">
        <div className="col-md-3">
          <Link className="feature-card feature-link" to="/petition">
            <h3>Petitie</h3>
            <p>Utilizatorii autentificati sustin cauza prin semnaturi salvate in baza de date.</p>
          </Link>
        </div>
        <div className="col-md-3">
          <Link className="feature-card feature-link" to="/volunteer">
            <h3>Voluntariat</h3>
            <p>Cererile de adeziune sunt trimise online si aprobate de administrator.</p>
          </Link>
        </div>
        <div className="col-md-3">
          <Link className="feature-card feature-link" to="/donate">
            <h3>Donatii</h3>
            <p>Flux de donatie simulat, suficient pentru demo si sigur pentru proiect.</p>
          </Link>
        </div>
        <div className="col-md-3">
          <Link className="feature-card feature-link" to="/forum">
            <h3>Forum</h3>
            <p>Comunitatea deschide discutii, iar adminul poate modera continutul.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
