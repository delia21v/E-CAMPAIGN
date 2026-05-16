import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Campaigns from "./components/Campaigns";
import Petition from "./components/Petition";
import Donate from "./components/Donate";
import Volunteer from "./components/Volunteer";
import Forum from "./components/Forum";
import ForumTopic from "./components/ForumTopic";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route
            path="/petition"
            element={
              <PrivateRoute>
                <Petition />
              </PrivateRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <PrivateRoute>
                <Donate />
              </PrivateRoute>
            }
          />
          <Route
            path="/volunteer"
            element={
              <PrivateRoute>
                <Volunteer />
              </PrivateRoute>
            }
          />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumTopic />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
