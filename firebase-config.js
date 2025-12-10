// Firebase configuration for PASESO
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Firebase configuration - Replace with your own config
const firebaseConfig = {
  apiKey: "AIzaSyB9jfEX4XpTvpVU2xdbyC0ogirZ2uO4f4M",
  authDomain: "studio-8744465219-980a1.firebaseapp.com",
  projectId: "studio-8744465219-980a1",
  storageBucket: "studio-8744465219-980a1.firebasestorage.app",
  messagingSenderId: "573420370354",
  appId: "1:573420370354:web:ed6c3c8d0fcd9c9d774cab",
  measurementId: "G-8KNT5Z9JNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export services
export { app, db, auth, storage };