import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from './components/Toast';
import { ChatbotProvider } from './components/chatbot/ChatbotContext';

import { PublicLayout } from './layouts/PublicLayout';
import { MainLayout } from './layouts/MainLayout';

import { Landing } from './pages/Landing';
import { Quickstart } from './pages/Quickstart';
import { Pricing } from './pages/Pricing';
import { FAQs } from './pages/FAQs';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { ExtractionReview } from './pages/ExtractionReview';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { Dashboards } from './pages/Dashboards';
import { Settings } from './pages/Settings';
import { Security } from './pages/Security';
import { Help } from './pages/Help';
import { Documentation } from './pages/Documentation';
import { DemoResults } from './pages/DemoResults';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14e7ff]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14e7ff]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/demo/results" element={<DemoResults />} />
        <Route path="/quickstart" element={<Quickstart />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faqs" element={<FAQs />} />
      </Route>

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/extracted" element={<ExtractionReview />} />
        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/dashboards" element={<Dashboards />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/security" element={<Security />} />
        <Route path="/help" element={<Help />} />
        <Route path="/documentation" element={<Documentation />} />

      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatbotProvider>
          <BrowserRouter>
            <AppRoutes />
            <ToastContainer />
          </BrowserRouter>
        </ChatbotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
