
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://mail-box-client-7d600-default-rtdb.firebaseio.com",
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "mail-box-client-7d600.firebaseapp.com",
  projectId: "mail-box-client-7d600",
  storageBucket: "mail-box-client-7d600.firebasestorage.app",
  messagingSenderId: "446941702517",
  appId: "1:446941702517:web:9d1cf5d8c93db3e0de0b3c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

