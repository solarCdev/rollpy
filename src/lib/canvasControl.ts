import { Canvas, FabricImage } from 'fabric';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './fbase';

type Selected = 'rect' | 'text' | 'gif' | 'none' | 'bg';

export const renderCanvas = ({
	canvasEle,
	backgroundColor,
	backgroundImg,
	selector
}: {
	canvasEle: HTMLCanvasElement;
	selector?: (type: Selected) => void;
	backgroundColor?: string;
	backgroundImg?: string;
}) => {
	const image = new Image();
	image.src = backgroundImg ? backgroundImg : '';
	const canvas = new Canvas(canvasEle, {
		width: canvasEle.offsetWidth,
		height: canvasEle.offsetHeight,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		selection: false,
		backgroundImage: backgroundImg ? new FabricImage(image) : undefined
	});
	if (selector)
		canvas.on('mouse:move', () => {
			if (!canvas.getActiveObject()) {
				selector('bg');
			}
		});

	return canvas;
};

export const uploadCanvas = async (
	team: boolean,
	id: string,
	name: string,
	emoji: string,
	canvas?: Canvas,
	to?: string
) => {
	const json = JSON.stringify(canvas);
	let imgSourceList: { src: string; width: number; height: number }[] = [];
	canvas?.forEachObject((obj) => {
		if (obj.isType('image')) {
			let img = obj as FabricImage;
			let imgElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement = img.getElement();
			if (imgElement.id) {
				let video = imgElement as HTMLVideoElement;
				imgSourceList.push({
					src: video.id,
					width: video.width,
					height: video.height
				});
			}
		}
	});

	let data: {
		canvas: string;
		creator: string;
		creatorEmoji: string;
		createdAt: number;
		source: { src: string; width: number; height: number }[];
		creatorId?: string;
		to?: string;
	} = {
		canvas: json,
		creator: name,
		creatorEmoji: emoji,
		createdAt: Date.now(),
		source: imgSourceList
	};
	if (auth.currentUser) {
		data.creatorId = auth.currentUser.uid;
	}
	if (!team) {
		return await addDoc(collection(db, 'paper', id, 'papers'), data);
	} else {
		data.to = to;
		if (auth.currentUser?.displayName && auth.currentUser?.photoURL) {
			data.creator = auth.currentUser.displayName;
			data.creatorEmoji = auth.currentUser.photoURL;
		}

		return await addDoc(collection(db, 'team', id, 'papers'), data);
	}
};

export const downloadCanvas = async (team: boolean, id: string, arrange: string) => {
	let path: string;
	if (team) {
		path = 'team';
	} else {
		path = 'paper';
	}
	const snapshot = await getDoc(doc(db, path, id, 'papers', arrange));
	const res = snapshot.data();
	return res;
};

// export const loadImagesAndGifs = () => {};
