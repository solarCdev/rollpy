import { initializeFirebase, auth } from '$lib/fbase';
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';

export async function load() {
	if (browser) {
		try {
			initializeFirebase();
		} catch (ex) {
			console.error(ex);
		}
	}
}
