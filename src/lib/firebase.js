import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtifcpaAFC-kus18HoEWLpw5r561r07PQ",
  authDomain: "thamar-alnakheel.firebaseapp.com",
  projectId: "thamar-alnakheel",
  storageBucket: "thamar-alnakheel.firebasestorage.app",
  messagingSenderId: "395825843840",
  appId: "1:395825843840:web:9ba7c0fdb2016c2daf6065"
};

// Initialize Firebase - prevent duplicate app error on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

// Helper to log events safely
export const logEvent = (eventName, params = {}) => {
  try {
    firebaseLogEvent(analytics, eventName, params);

    // Log to console in development for verification
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${eventName}:`, params);
    }
  } catch (error) {
    console.error("Analytics Error:", error);
  }
};

// ============================================
// Scroll Depth Tracking
// ============================================
let scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

export const initScrollTracking = (pageName) => {
  // Reset milestones for new page
  scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    [25, 50, 75, 100].forEach(milestone => {
      if (scrollPercent >= milestone && !scrollMilestones[milestone]) {
        scrollMilestones[milestone] = true;
        logEvent('scroll_depth', {
          page: pageName,
          percent: milestone
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
};

// ============================================
// Time on Page Tracking
// ============================================
let pageStartTime = null;

export const startTimeTracking = () => {
  pageStartTime = Date.now();
};

export const endTimeTracking = (pageName) => {
  if (pageStartTime) {
    const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
    logEvent('time_on_page', {
      page: pageName,
      seconds: timeSpent
    });
    pageStartTime = null;
  }
};

// ============================================
// Product View Tracking (Intersection Observer)
// ============================================
const viewedProducts = new Set();

export const trackProductView = (productName) => {
  if (!viewedProducts.has(productName)) {
    viewedProducts.add(productName);
    logEvent('view_product', {
      product: productName
    });
  }
};

export const resetProductViews = () => {
  viewedProducts.clear();
};

// ============================================
// Session & User Info (auto-tracked by GA, but we add custom)
// ============================================
export const trackSessionStart = () => {
  logEvent('session_start_custom', {
    referrer: document.referrer || 'direct',
    landing_page: window.location.pathname,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight,
    user_agent: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
  });
};

export { analytics };
