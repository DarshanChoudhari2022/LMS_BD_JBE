import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import LeadDatabase from './pages/LeadDatabase';
import LeadDetail from './pages/LeadDetail';
import PartnerManagement from './pages/PartnerManagement';
import DailyTracker from './pages/DailyTracker';
import Offerings from './pages/Offerings';
import Clients from './pages/Clients';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeadProvider } from './context/LeadContext';
import { PartnerProvider } from './context/PartnerContext';
import { ClientProvider } from './context/ClientContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <LeadProvider>
      <PartnerProvider>
        <ClientProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<LeadDatabase />} />
              <Route path="/leads/:id" element={<LeadDetail />} />
              <Route path="/partners" element={<PartnerManagement />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/daily-tracker" element={<DailyTracker />} />
              <Route path="/offerings" element={<Offerings />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </ClientProvider>
      </PartnerProvider>
    </LeadProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;