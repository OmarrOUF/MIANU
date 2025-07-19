import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

/**
 * AdminRoute component
 * Protects routes that should only be accessible to admin users
 */
const AdminRoute = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  // If user is not authenticated or not an admin, redirect to unauthorized page
  if (!currentUser || !userData || userData.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If user is authenticated and is an admin, render the protected component
  return children;
};

export default AdminRoute;