const fontList: [string, string, string][] = [
	[
		'Pretendard-Regular',
		'https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff',
		'프리텐다드'
	],
	[
		'yg-jalnan',
		'https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff',
		'잘난체'
	],
	[
		'GmarketSansMedium',
		'https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff',
		'지마켓 산스'
	],
	[
		'establishRetrosansOTF',
		'https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2112@1.0/establishRetrosansOTF.woff',
		'설립체 유건욱'
	],
	[
		'Gyeonggi_Batang_Regular',
		'https://fastly.jsdelivr.net/gh/projectnoonnu/2410-3@1.0/Batang_Regular.woff',
		'경기천년바탕'
	],
	[
		'SBAggroB',
		'https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff',
		'어그로체'
	],
	[
		'LOTTERIADDAG',
		'https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/LOTTERIADDAG.woff2',
		'롯데리아 딱붙어체'
	]
];

export const downloadAllWebfont = () => {
	for (const font of fontList) {
		let a = new FontFace(font[0], 'url(' + font[1] + ')', {
			style: 'normal',
			weight: '400'
		});
		// a.load()
		// 	.then(() => {})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
		document.fonts.add(a);
	}
};

export const getWebfontList = () => {
	return fontList;
};
