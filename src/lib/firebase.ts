import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "@firebase/database";

import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLzOpsnxaFJkz0lPi0PaclxkyacQEU_LE", // Consider storing as an environment variable
  authDomain: "mirrored-commentary.firebaseapp.com",
  projectId: "mirrored-commentary",
  storageBucket: "mirrored-commentary.firebasestorage.app",
  messagingSenderId: "543936057428",
  appId: "1:543936057428:web:cd7350e2a8ee9a35185dc1",
  measurementId: "G-63RVGFX2KW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Realtime Database'i başlat
export const db = getDatabase(app);

// Veri yazma örneği
export async function writeData(path: string, data: any) {
  try {
    const dbRef = ref(db, path);
    await set(dbRef, data);
    console.log("Realtime Database'e veri yazıldı!");
  } catch (error) {
    console.error("Realtime Database'e veri yazılırken hata oluştu:", error);
    throw error; // Hatayı yeniden fırlat
  }
}

// Veri okuma örneği
export function readData(path: string, callback: (data: any) => void) {
  const dbRef = ref(db, path);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  }, {
    onlyOnce: false // Veriler değiştiğinde dinlemeye devam et
  });
}
