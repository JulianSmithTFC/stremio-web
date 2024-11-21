// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDNdi0sdr0UNwfdrxzpcR3NzrdZQjGUrOs",
    authDomain: "stremio-strembros.firebaseapp.com",
    projectId: "stremio-strembros",
    storageBucket: "stremio-strembros.firebasestorage.app",
    messagingSenderId: "1027890058571",
    appId: "1:1027890058571:web:ad0dd96aff5569c09204ce"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;