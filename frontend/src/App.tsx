import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import Layout from './components/layout/Layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import BandPage from './pages/Band';
import SchedulePage from './pages/Schedule';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bands/:bandId" element={<BandPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </Layout>
  );
};

export default App;