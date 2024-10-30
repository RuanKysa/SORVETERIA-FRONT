import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBk5kDhUsMcT5S2BYW_7wGFZ3bhvdEKnJQ",
  authDomain: "authsorvete.firebaseapp.com",
  projectId: "authsorvete",
  storageBucket: "authsorvete.appspot.com",
  messagingSenderId: "13096450238",
  appId: "1:13096450238:web:3f1ec0a7b71ec8902286ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);