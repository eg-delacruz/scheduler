// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'scheduler-9c3cb.firebaseapp.com',
  projectId: 'scheduler-9c3cb',
  storageBucket: 'scheduler-9c3cb.appspot.com',
  messagingSenderId: '124355250188',
  appId: '1:124355250188:web:8ff8900f8adca80cc38629',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
