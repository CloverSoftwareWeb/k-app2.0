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

// testing project config - do not use

// const firebaseConfig = {
//   apiKey: "AIzaSyAEh3qEZJ-RLLY-N5pZCj5udu4c0zzN1bk",
//   authDomain: "k-app-332d2.firebaseapp.com",
//   projectId: "k-app-332d2",
//   storageBucket: "k-app-332d2.firebasestorage.app",
//   messagingSenderId: "370623465586",
//   appId: "1:370623465586:web:4f3c21f1e9a203da205aeb"
// };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };