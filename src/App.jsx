import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import { logEvent, trackSessionStart } from './lib/firebase';

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/index.html" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu.html" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
