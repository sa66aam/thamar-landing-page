import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";

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
const db = getFirestore(app);

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
// Gallery Analytics Tracking
// ============================================
export const trackGalleryVisit = () => {
  logEvent('gallery_visit', {
    timestamp: new Date().toISOString()
  });
};

export const trackMediaClick = (mediaType, mediaId, mediaName) => {
  logEvent('media_click', {
    type: mediaType, // 'video' or 'image'
    id: mediaId,
    name: mediaName
  });
};

export const trackVideoPlay = (videoId, videoName) => {
  logEvent('video_play', {
    id: videoId,
    name: videoName
  });
};

// ============================================
// Visitor Counter (Firestore - Shared across all users)
// ============================================
const VISITOR_TRACKED_KEY = 'thamar_visitor_tracked';
const INITIAL_VISITOR_COUNT = 347;
// Bump this number to force-reset the Firestore counter to INITIAL_VISITOR_COUNT.
// This wipes any stale/wrong values (e.g. 1725 from old INITIAL=2000 era).
const COUNTER_VERSION = 2;

// Subscribe to real-time visitor count updates
// Uses a version marker to detect and reset stale Firestore data.
// Returns null to callback initially (caller should hide counter until first value).
export const subscribeToVisitorCount = (callback) => {
  const docRef = doc(db, 'counters', 'galleryVisitors');

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const firestoreCount = data.count || 0;
      const version = data.v || 0;

      // Version mismatch → old/corrupt data → force reset to base count
      if (version < COUNTER_VERSION) {
        setDoc(docRef, { count: INITIAL_VISITOR_COUNT, v: COUNTER_VERSION });
        callback(INITIAL_VISITOR_COUNT);
      } else if (firestoreCount < INITIAL_VISITOR_COUNT) {
        setDoc(docRef, { count: INITIAL_VISITOR_COUNT, v: COUNTER_VERSION });
        callback(INITIAL_VISITOR_COUNT);
      } else {
        callback(firestoreCount);
      }
    } else {
      // Document doesn't exist → initialize
      setDoc(docRef, { count: INITIAL_VISITOR_COUNT, v: COUNTER_VERSION });
      callback(INITIAL_VISITOR_COUNT);
    }
  }, (error) => {
    console.error('Error subscribing to visitor count:', error);
    callback(INITIAL_VISITOR_COUNT);
  });
};

// Get current visitor count (one-time)
export const getVisitorCount = async () => {
  try {
    const docRef = doc(db, 'counters', 'galleryVisitors');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const version = data.v || 0;
      if (version < COUNTER_VERSION) return INITIAL_VISITOR_COUNT;
      return Math.max(data.count || 0, INITIAL_VISITOR_COUNT);
    }
    return INITIAL_VISITOR_COUNT;
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return INITIAL_VISITOR_COUNT;
  }
};

// Increment visitor count in Firestore
export const incrementVisitorCount = async () => {
  // Check if this visitor was already tracked in this session
  const alreadyTracked = sessionStorage.getItem(VISITOR_TRACKED_KEY);

  if (!alreadyTracked) {
    try {
      const docRef = doc(db, 'counters', 'galleryVisitors');
      const docSnap = await getDoc(docRef);

      let newCount;
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentCount = data.count || 0;
        const version = data.v || 0;

        // If version is old, reset first then increment
        if (version < COUNTER_VERSION || currentCount < INITIAL_VISITOR_COUNT) {
          newCount = INITIAL_VISITOR_COUNT + 1;
          await setDoc(docRef, { count: newCount, v: COUNTER_VERSION });
        } else {
          await updateDoc(docRef, { count: increment(1), v: COUNTER_VERSION });
          newCount = currentCount + 1;
        }
      } else {
        newCount = INITIAL_VISITOR_COUNT + 1;
        await setDoc(docRef, { count: newCount, v: COUNTER_VERSION });
      }

      sessionStorage.setItem(VISITOR_TRACKED_KEY, 'true');

      // Log to Analytics
      logEvent('new_gallery_visitor', {
        visitor_number: newCount
      });

      return newCount;
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
      return INITIAL_VISITOR_COUNT;
    }
  }

  return await getVisitorCount();
};

// ============================================
// Product Selection Counter (Firestore - Shared)
// ============================================

// Initial counts for each product (used when initializing Firestore)
const INITIAL_SELECTION_COUNTS = {
  1: 28, // ذوق المدينة
  2: 19, // ذوق السكري
  3: 15, // ذوق نجد
  4: 22, // المجموعة الكاملة
};

// Get all product selection counts from Firestore
export const getProductSelectionCounts = async () => {
  try {
    const docRef = doc(db, 'counters', 'productSelections');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize with default values if document doesn't exist
      await setDoc(docRef, INITIAL_SELECTION_COUNTS);
      return INITIAL_SELECTION_COUNTS;
    }
  } catch (error) {
    console.error('Error getting selection counts:', error);
    return INITIAL_SELECTION_COUNTS;
  }
};

// Increment product selection count in Firestore
export const incrementProductSelection = async (productId, productName) => {
  try {
    const docRef = doc(db, 'counters', 'productSelections');

    // Check if document exists first
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(docRef, {
        [productId]: increment(1)
      });
    } else {
      // Create document with initial values + increment
      const initialData = { ...INITIAL_SELECTION_COUNTS };
      initialData[productId] = (initialData[productId] || 0) + 1;
      await setDoc(docRef, initialData);
    }

    // Log to Analytics
    logEvent('product_selection', {
      product_id: productId,
      product_name: productName
    });

    // Get updated count
    const updatedSnap = await getDoc(docRef);
    return updatedSnap.data()[productId];
  } catch (error) {
    console.error('Error incrementing selection:', error);
    return null;
  }
};

// Subscribe to real-time updates of selection counts
export const subscribeToSelectionCounts = (callback) => {
  const docRef = doc(db, 'counters', 'productSelections');

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(INITIAL_SELECTION_COUNTS);
    }
  }, (error) => {
    console.error('Error subscribing to counts:', error);
    callback(INITIAL_SELECTION_COUNTS);
  });
};

// Legacy function for backward compatibility
export const getProductSelectionCount = (productId) => {
  return INITIAL_SELECTION_COUNTS[productId] || 0;
};

// ============================================
// Product Ratings (Firestore - Shared)
// ============================================

// Initial ratings data
const INITIAL_RATINGS = {
  1: { average: 4.8, count: 14, total: 67 }, // ذوق المدينة
  2: { average: 4.7, count: 11, total: 52 }, // ذوق السكري
  3: { average: 4.6, count: 9, total: 41 },  // ذوق نجد
  4: { average: 4.8, count: 12, total: 58 }, // المجموعة الكاملة
};

// Subscribe to real-time ratings updates
export const subscribeToRatings = (callback) => {
  const docRef = doc(db, 'counters', 'productRatings');

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      // Initialize with default values
      setDoc(docRef, INITIAL_RATINGS);
      callback(INITIAL_RATINGS);
    }
  }, (error) => {
    console.error('Error subscribing to ratings:', error);
    callback(INITIAL_RATINGS);
  });
};

// Submit a new rating
export const submitProductRating = async (productId, productName, rating) => {
  try {
    const docRef = doc(db, 'counters', 'productRatings');
    const docSnap = await getDoc(docRef);

    let currentData;
    if (docSnap.exists()) {
      currentData = docSnap.data();
    } else {
      currentData = { ...INITIAL_RATINGS };
    }

    // Calculate new average
    const productRating = currentData[productId] || { average: 0, count: 0, total: 0 };
    const newCount = productRating.count + 1;
    const newTotal = productRating.total + rating;
    const newAverage = Math.round((newTotal / newCount) * 10) / 10; // Round to 1 decimal

    // Update Firestore
    await setDoc(docRef, {
      ...currentData,
      [productId]: {
        average: newAverage,
        count: newCount,
        total: newTotal
      }
    });

    // Log to Analytics
    logEvent('submit_rating', {
      product_id: productId,
      product_name: productName,
      rating: rating,
      new_average: newAverage
    });

    return { average: newAverage, count: newCount };
  } catch (error) {
    console.error('Error submitting rating:', error);
    return null;
  }
};

// ============================================
// Product Comments (Firestore - Shared)
// ============================================

// Initial comments count (start from zero for transparency)
const INITIAL_COMMENTS = {
  1: { count: 0 },  // ذوق المدينة
  2: { count: 0 },  // ذوق السكري
  3: { count: 0 },  // ذوق نجد
  4: { count: 0 },  // المجموعة الكاملة
};

// Subscribe to comments counts
export const subscribeToComments = (callback) => {
  const docRef = doc(db, 'counters', 'productComments');

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      setDoc(docRef, INITIAL_COMMENTS);
      callback(INITIAL_COMMENTS);
    }
  }, (error) => {
    console.error('Error subscribing to comments:', error);
    callback(INITIAL_COMMENTS);
  });
};

// Get comments for a product
export const getProductComments = async (productId) => {
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    // Sort by timestamp in JavaScript (avoids need for Firestore index)
    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};

// Submit a new comment
export const submitProductComment = async (productId, productName, comment) => {
  try {
    // Add comment to comments collection
    const commentsRef = doc(db, 'comments', `${productId}_${Date.now()}`);
    await setDoc(commentsRef, {
      productId,
      productName,
      comment,
      timestamp: new Date().toISOString()
    });

    // Update comment count
    const countRef = doc(db, 'counters', 'productComments');
    const countSnap = await getDoc(countRef);

    let currentData = countSnap.exists() ? countSnap.data() : { ...INITIAL_COMMENTS };
    const currentCount = currentData[productId]?.count || 0;

    await setDoc(countRef, {
      ...currentData,
      [productId]: { count: currentCount + 1 }
    });

    // Log to Analytics
    logEvent('submit_comment', {
      product_id: productId,
      product_name: productName
    });

    return currentCount + 1;
  } catch (error) {
    console.error('Error submitting comment:', error);
    return null;
  }
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
