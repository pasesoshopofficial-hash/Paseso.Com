// Firebase Storage for PASESO
import { storage, db, auth } from './firebase-config.js';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Handle image upload for posts
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    // Show uploading state
    const postButton = document.querySelector('#create-modal button.px-6.py-2');
    const originalText = postButton.innerHTML;
    postButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    postButton.disabled = true;
    
    // Create a storage reference
    const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Store in pendingImage for later use
    window.pendingImage = downloadURL;
    
    // Show preview
    const previewContainer = document.getElementById('image-preview-container');
    const previewImage = document.getElementById('preview-image');
    previewImage.src = downloadURL;
    previewContainer.classList.remove('hidden');
    
    // Reset button
    postButton.innerHTML = originalText;
    postButton.disabled = false;
    
    showToast('Image uploaded successfully!', 'success');
  } catch (error) {
    console.error("Error uploading image:", error);
    showToast('Error uploading image: ' + error.message, 'error');
    
    // Reset button
    const postButton = document.querySelector('#create-modal button.px-6.py-2');
    postButton.innerHTML = 'Post';
    postButton.disabled = false;
  }
}

// Handle story image upload
async function handleStoryImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    // Create a storage reference
    const storageRef = ref(storage, `stories/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Store in pendingStoryImage for later use
    window.pendingStoryImage = downloadURL;
    
    // Show preview
    const previewImage = document.getElementById('story-preview-image');
    const placeholder = document.getElementById('story-upload-placeholder');
    previewImage.src = downloadURL;
    previewImage.classList.remove('hidden');
    placeholder.classList.add('hidden');
    
    showToast('Image uploaded successfully!', 'success');
  } catch (error) {
    console.error("Error uploading story image:", error);
    showToast('Error uploading image: ' + error.message, 'error');
  }
}

// Handle avatar upload
async function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    // Create a storage reference
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update preview
    const previewImage = document.getElementById('edit-avatar-preview');
    previewImage.src = downloadURL;
    
    // Store for saving later
    window.pendingAvatar = downloadURL;
    
    showToast('Avatar uploaded successfully!', 'success');
  } catch (error) {
    console.error("Error uploading avatar:", error);
    showToast('Error uploading avatar: ' + error.message, 'error');
  }
}

// Remove image from post
function removeImage() {
  window.pendingImage = null;
  document.getElementById('image-preview-container').classList.add('hidden');
  document.getElementById('preview-image').src = '';
  document.getElementById('image-upload').value = '';
}

// Create post with image
async function createPostWithImage(content, imageUrl, visibility) {
  try {
    const postsCollection = collection(db, "posts");
    const postData = {
      content: content,
      imageUrl: imageUrl,
      visibility: visibility,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      likes: 0,
      comments: 0,
      shares: 0
    };
    
    const docRef = await addDoc(postsCollection, postData);
    console.log("Document written with ID: ", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

// Export functions
window.handleImageUpload = handleImageUpload;
window.handleStoryImageUpload = handleStoryImageUpload;
window.handleAvatarUpload = handleAvatarUpload;
window.removeImage = removeImage;
window.createPostWithImage = createPostWithImage;