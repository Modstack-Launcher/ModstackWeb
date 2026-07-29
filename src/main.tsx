import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/home.tsx';
import TermsPage from './pages/terms.tsx';
import PrivPage from './pages/privacy.tsx';
import AboutPage from './pages/about.tsx';
import ChangePage from './pages/changelog.tsx';
import SignupPage from './pages/signup.tsx';
import LoginPage from './pages/login.tsx';
import StudioPage from './pages/studio.tsx';
import { LanguageProvider } from './i18n.tsx';
import './index.css';
import { initSession, handleAuthRedirect } from './auth';

// Handle OAuth redirects and restore session on every page load
handleAuthRedirect();
initSession();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/changelog" element={<ChangePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/studio" element={<StudioPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);
