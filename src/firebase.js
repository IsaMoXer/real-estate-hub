// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAieO0P2WvbGU8EDztk_gh9Q_dbX2pWZLA",
  authDomain: "realtor-clone-react-2664b.firebaseapp.com",
  projectId: "realtor-clone-react-2664b",
  storageBucket: "realtor-clone-react-2664b.appspot.com",
  messagingSenderId: "34096085681",
  appId: "1:34096085681:web:0117cecb13aa03257b4090",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
