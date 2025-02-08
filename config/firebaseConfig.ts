import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyAP-luSB9UfFPWDoqxLTgmGSK8SV4KG-L8',
    authDomain: 'freelance-285d0.firebaseapp.com',
    projectId: 'freelance-285d0',
    storageBucket: 'freelance-285d0.firebasestorage.app',
    messagingSenderId: '759702559661',
    appId: '1:759702559661:android:c9ddda13aab1e91bff1f24',
};

// Initialize Firebase (only for Expo managed workflow)
const app = initializeApp(firebaseConfig);
export default app;