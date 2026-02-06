import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { logEvent, trackSessionStart } from './lib/firebase';

// Lazy load pages for faster navigation
const LandingPage = lazy(() => import('./pages/LandingPage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

// Minimal loading spinner
const PageLoader = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-gold-main border-t-transparent rounded-full animate-spin" />
  </div>
);

// Component to track page views automatically
const PageTracker = () => {
  const location = useLocation();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Track session start only on first load
    if (isFirstLoad.current) {
      trackSessionStart();
      isFirstLoad.current = false;
    }

    // Track page view
    logEvent('page_view', {
      page_path: location.pathname,
      page_title: document.title
    });
  }, [location]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/index.html" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu.html" element={<MenuPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery.html" element={<GalleryPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
