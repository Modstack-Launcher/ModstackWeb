/* eslint-disable react-refresh/only-export-components -- application entry point */
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n.tsx';
import './index.css';
import { initSession, handleAuthRedirect } from './auth';

const App = lazy(() => import('./pages/home.tsx'));
const TermsPage = lazy(() => import('./pages/terms.tsx'));
const PrivPage = lazy(() => import('./pages/privacy.tsx'));
const AboutPage = lazy(() => import('./pages/about.tsx'));
const ChangePage = lazy(() => import('./pages/changelog.tsx'));
const SignupPage = lazy(() => import('./pages/signup.tsx'));
const LoginPage = lazy(() => import('./pages/login.tsx'));
const StudioPage = lazy(() => import('./pages/studio.tsx'));
const GuidesPage = lazy(() => import('./pages/guides.tsx'));
const SupportPage = lazy(() => import('./pages/support.tsx'));
const EditorPage = lazy(() => import('./pages/editor.tsx'));

const loadingFallback = (
  <div className="route-loading" role="progressbar" aria-label="Loading Modstack">
    <div className="route-loading__bar" />
  </div>
);

// Handle OAuth redirects and restore session on every page load
handleAuthRedirect();
initSession();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={loadingFallback}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/changelog" element={<ChangePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/studio" element={<StudioPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/editor" element={<EditorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);
