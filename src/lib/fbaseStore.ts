import { writable, type Writable } from 'svelte/store';

export type SessionState = {
	loading?: boolean;
	loggedIn?: boolean;
};

export const session = <Writable<SessionState>>writable();
