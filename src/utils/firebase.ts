import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5lKYFlV7LWQgZlKeRKmUUdsIqjrK4Xok",
  authDomain: "camp-band.firebaseapp.com",
  projectId: "camp-band",
  storageBucket: "camp-band.firebasestorage.app",
  messagingSenderId: "383680620997",
  appId: "1:383680620997:web:5153606851fe6b7f27c3ac",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, onAuthStateChanged };
