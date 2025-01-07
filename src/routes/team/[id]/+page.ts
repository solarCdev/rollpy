import { doc, getDoc } from 'firebase/firestore';
import type { PageLoad } from './$types';
import { db } from '$lib/fbase';

export const load: PageLoad = async ({ params }) => {
	return { id: params.id };
};
