export const getGIF = async (term: string, type: string) => {
	let apikey = 'AIzaSyDnrNIODWmOsExA7q_buNQNOysDrCUczPk';
	let clientkey = 'rollpy';
	let lmt = 20;

	// test search term
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
	// let search_url =
	// 	'https://tenor.googleapis.com/v2/search?media_filter=gif&country=KR&q=' +
	// 		search_term +
	// 		'&key=' +
	// 		apikey +
	// 		'&client_key=' +
	// 		clientkey +
	// 		'&limit=' +
	// 		lmt +
	// 		type ===
	// 	'sticker'
	// 		? '&searchfilter=' + type
	// 		: '';
	let response = await fetch(search_url);
	let result = await response.text();

	return JSON.parse(result);
};
