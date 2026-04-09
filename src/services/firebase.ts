import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseEnv = [
  ["VITE_FIREBASE_API_KEY", import.meta.env.VITE_FIREBASE_API_KEY],
  ["VITE_FIREBASE_AUTH_DOMAIN", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN],
  ["VITE_FIREBASE_PROJECT_ID", import.meta.env.VITE_FIREBASE_PROJECT_ID],
  ["VITE_FIREBASE_STORAGE_BUCKET", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET],
  [
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  ],
  ["VITE_FIREBASE_APP_ID", import.meta.env.VITE_FIREBASE_APP_ID],
] as const;

const missingEnvKeys = firebaseEnv
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnvKeys.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missingEnvKeys.join(", ")}`,
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
