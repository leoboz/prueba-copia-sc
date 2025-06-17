
import React from 'react';
import { Navigate } from 'react-router-dom';

// This file was incorrectly showing CreateLot component
// Redirect to the correct login page
const Login: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default Login;
