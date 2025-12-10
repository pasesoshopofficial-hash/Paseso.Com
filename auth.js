// Firebase Authentication for PASESO
import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const sidebarName = document.getElementById('sidebar-name');
const sidebarUsername = document.getElementById('sidebar-username');
const sidebarAvatar = document.getElementById('sidebar-avatar');
const mobileAvatar = document.getElementById('mobile-avatar');
const createName = document.getElementById('create-name');
const createAvatar = document.getElementById('create-avatar');

// Check auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    authScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    loadUserData(user.uid);
  } else {
    // User is signed out
    authScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
  }
});

// Handle login
async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showToast('Logged in successfully!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Handle register
async function handleRegister() {
  const firstname = document.getElementById('reg-firstname').value;
  const lastname = document.getElementById('reg-lastname').value;
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      bio: '',
      location: '',
      website: '',
      followers: 0,
      following: 0,
      posts: 0,
      createdAt: new Date()
    });
    
    showToast('Account created successfully!', 'success');
    showLogin();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Handle logout
async function handleLogout() {
  try {
    await signOut(auth);
    showToast('Logged out successfully!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Load user data
async function loadUserData(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const fullName = `${userData.firstname} ${userData.lastname}`;
      
      // Update UI with user data
      sidebarName.textContent = fullName;
      sidebarUsername.textContent = `@${userData.username}`;
      createName.textContent = fullName;
      
      // Set avatars
      const avatarUrl = userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
      sidebarAvatar.src = avatarUrl;
      mobileAvatar.src = avatarUrl;
      createAvatar.src = avatarUrl;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Show toast message
function showToast(message, type) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  
  toast.className = `toast px-6 py-4 rounded-xl glass flex items-center gap-3 animate-slide-in ${
    type === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
  }`;
  
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle text-green-400' : 'fa-exclamation-circle text-red-400'}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Export functions
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;