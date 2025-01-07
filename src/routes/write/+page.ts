import { db } from '$lib/fbase';
import { doc, getDoc } from 'firebase/firestore';
import type { PageLoad } from '../paper/[id]/$types';

export const load: PageLoad = ({ url }) => {
	return {
		type: url.searchParams.get('type'),
		to: url.searchParams.get('to'),
		id: url.searchParams.get('id')
	};
};
