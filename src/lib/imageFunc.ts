import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from './fbase';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

function makeid(length: number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export const uploadImage = async (image: File, curList: string[]) => {
	const webpImg: Blob = await convertImageToWebP(image);

	const id = makeid(5);
	const path = 'image/' + auth.currentUser?.uid + '/' + id + '.webp';
	const reference = ref(storage, path);
	let response = await uploadBytes(reference, webpImg);
	let url = await getDownloadURL(response.ref);
	let arr = curList;
	arr.push(url);
	if (auth.currentUser?.uid)
		updateDoc(doc(db, 'user', auth.currentUser?.uid), { uploadedImgs: arr });
	return url;
};

export const convertImageToWebP: (file: Blob) => Promise<Blob> = (file: Blob) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = URL.createObjectURL(file);
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			(canvas.width = img.width), (canvas.height = img.height);
			ctx?.drawImage(img, 0, 0, img.width, img.height);

			canvas.toBlob((blob) => {
				if (blob) {
					if (blob.size > 10485760) {
						reject(new Error('Size too big'));
					} else {
						resolve(blob);
					}
				} else {
					reject(new Error('Image conversion failed'));
				}
			}, 'image/webp');
		};
		img.onerror = reject;
	});
};

export const deleteImg = async (img: string, li: string[], idx: number) => {
	const reference = ref(storage, img);
	await deleteObject(reference);
	li.splice(idx, 1);
	if (auth.currentUser?.uid)
		await updateDoc(doc(db, 'user', auth.currentUser.uid), { uploadedImgs: li });
};
