import type { Component } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const currentNavBar: Writable<'basis' | 'out' | 'mypage' | 'paper'> = writable('basis');
const titleOnTop: Writable<string> = writable('hi');
const paperstatus: Writable<{
	id: string;
	anonymous: boolean;
	title: string;
	type: 'paper' | 'team';
	creator: string;
}> = writable({
	id: '',
	anonymous: false,
	title: '',
	type: 'paper',
	creator: ''
});
let toggleSetting = writable(false);
export { titleOnTop, currentNavBar, paperstatus, toggleSetting };
