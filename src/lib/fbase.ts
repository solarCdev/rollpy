import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { Firestore, getFirestore } from 'firebase/firestore';
import { type FirebaseStorage, getStorage } from 'firebase/storage';
import { getAuth, type Auth } from 'firebase/auth';
import { onMount } from 'svelte';
import { browser } from '$app/environment';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export let app: FirebaseApp | undefined;
export let db: Firestore;
export let auth: Auth;
export let storage: FirebaseStorage;

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error('Something Wrong Happened');
	}
	if (!app) {
		app = initializeApp(firebaseConfig);
		auth = getAuth(app);
		db = getFirestore();
		storage = getStorage();
	}
};
