// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/" />;
}

export default AdminRoute;
