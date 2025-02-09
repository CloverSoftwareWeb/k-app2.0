// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtMSRFsqSZ4cVKNPvc3qkBACr67y7CtEA",
  authDomain: "k-app-2p0.firebaseapp.com",
  projectId: "k-app-2p0",
  storageBucket: "k-app-2p0.firebasestorage.app",
  messagingSenderId: "514475088699",
  appId: "1:514475088699:web:bcede0cdb066d2cdaff51e",
  measurementId: "G-8MX4QDNMR6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };