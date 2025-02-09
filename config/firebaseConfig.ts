import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAP-luSB9UfFPWDoqxLTgmGSK8SV4KG-L8',
    authDomain: 'freelance-285d0.firebaseapp.com',
    projectId: 'freelance-285d0',
    storageBucket: 'freelance-285d0.appspot.com',
    messagingSenderId: '759702559661',
    appId: '1:759702559661:android:c9ddda13aab1e91bff1f24',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Export Firebase Auth instance
export default app;
