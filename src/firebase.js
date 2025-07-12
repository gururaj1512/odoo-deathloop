import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyC7SNUGqmUeIu9hFyZ2Iovk3eB_cUvrEQk",
  authDomain: "odoo-dc977.firebaseapp.com",
  projectId: "odoo-dc977",
  storageBucket: "odoo-dc977.firebasestorage.app",
  messagingSenderId: "70272279279",
  appId: "1:70272279279:web:2d5c1b706ffea5b008311a",
  measurementId: "G-CDSDVJED7J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const signUp = async (email, password, role = 'user', username = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Ensure role defaults to 'user' if not provided
    const userRole = role || 'user';
    
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      username: username,
      role: userRole,
      createdAt: new Date().toISOString(),
      uid: user.uid
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    return null;
  }
}; 