// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5uGnHaDDGWxF9cCG-x4MG_ghVmn_yqkI",
  authDomain: "baby-sitter-a4869.firebaseapp.com",
  projectId: "baby-sitter-a4869",
  storageBucket: "baby-sitter-a4869.appspot.com",
  messagingSenderId: "919403570748",
  appId: "1:919403570748:web:a17fe6a11095a6522b8539",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  deleteDoc,
};
