import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtifcpaAFC-kus18HoEWLpw5r561r07PQ",
  authDomain: "thamar-alnakheel.firebaseapp.com",
  projectId: "thamar-alnakheel",
  storageBucket: "thamar-alnakheel.firebasestorage.app",
  messagingSenderId: "395825843840",
  appId: "1:395825843840:web:9ba7c0fdb2016c2daf6065",
  measurementId: "G-8RJ8HHGJJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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

export { analytics };
