import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Vocea pentru Copii</NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/campaigns">Campanii</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/petition">Petiție</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/volunteer">Voluntariat</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/forum">Forum</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link donate-link" to="/donate">Donează</NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">Admin</NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            {isLoggedIn ? (
              <>
                <li className="nav-item d-flex align-items-center me-3 text-light">
                  Bun venit, <strong className="ms-1">{username}</strong>
                </li>
                <li className="nav-item">
                  <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login / Înregistrare</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
