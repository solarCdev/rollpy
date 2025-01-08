export const getGIF = async (term: string, type: string, next?: string) => {
	let apikey = 'AIzaSyDnrNIODWmOsExA7q_buNQNOysDrCUczPk';
	let clientkey = 'rollpy';
	let lmt = 20;
	let search_term = term;

	let search_url =
		'https://tenor.googleapis.com/v2/search?' +
		'key=' +
		apikey +
		'&q=' +
		search_term +
		'&limit=' +
		lmt +
		'&client_key=' +
		clientkey +
		'media_filter=gif,mp4';

	if (type === 'sticker') {
		search_url += '&searchfilter=' + type;
	}
	if (next) {
		search_url += '&pos=' + next;
	}
	let response = await fetch(search_url);
	let result = await response.text();

	return JSON.parse(result);
};
