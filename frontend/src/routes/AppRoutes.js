import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Login from '../components/pages/Login';
import Dashboard from '../components/pages/Dashboard';
import Layout from '../components/layout/Layout';
import BusinessPartner from '../components/pages/BusinessPartner';
import IncomingPayment from '../components/pages/IncomingPayment'
import LoginLocationSet from '../components/pages/LoginLocationSelect';

const AppRoutes = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      navigate('/'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Add the login route */}

      <Route
        path="/LocationSelect"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <LoginLocationSet />
          </PrivateRoute>
        }
      />
      <Route
        path="/Dashboard"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/BusinessPartner"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <BusinessPartner />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/IncomingPayment"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <IncomingPayment />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/Home"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <Home />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/about"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <About />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
    </Routes>
  );
};

export default AppRoutes;
