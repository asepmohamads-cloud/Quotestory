import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAvOxbPGokqn6utSfMJw13fdgBbfcB3YPc",
  authDomain: "quotestory-studio.firebaseapp.com",
  projectId: "quotestory-studio",
  storageBucket: "quotestory-studio.firebasestorage.app",
  messagingSenderId: "964458275139",
  appId: "1:964458275139:web:dbcbb6e1e161c7785f4ff6",
  measurementId: "G-BT16C46CP0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics safely (only in browser context where supported)
export let analytics: any = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
