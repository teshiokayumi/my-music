import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcJjlCK6GxJ0Gmxpb307txR8S2s5G1ho4",
  authDomain: "my-music-1176b.firebaseapp.com",
  projectId: "my-music-1176b",
  storageBucket: "my-music-1176b.appspot.com",
  messagingSenderId: "1026666666666",
  appId: "1:1026666666666:web:1176b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);