import { createClient } from 'pexels';

export const getPexels = async (q: string) => {
	const client = createClient(import.meta.env.VITE_PEXELS_API_KEY);
	const query = q;

	// client.photos.search({ query, per_page: 1 }).then(photos => {...});
};
