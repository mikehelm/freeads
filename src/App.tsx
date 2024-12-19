import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import AdminPage from './pages/AdminPage';
import { LoadingScreen } from './components/LoadingScreen';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { DebugWindow } from './components/DebugWindow';

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background-secondary to-background-tertiary flex flex-col">
      {!isAdminPage && <Navigation />}
      <main className="flex-1">
        <React.Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </React.Suspense>
      </main>
      {!isAdminPage && <Footer />}
      <Toaster position="top-right" />
      <DebugWindow isVisible={true} />
    </div>
  );
}