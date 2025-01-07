import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './fbase';

export const getPaperList = async () => {
	const q = query(collection(db, 'paper'), where('creatorId', '==', auth.currentUser?.uid));
	const response = await getDocs(q);
	return response.docs;
};

export const getTeamList = async () => {
	const q = query(
		collection(db, 'team'),
		where('matesArr', 'array-contains', auth.currentUser?.uid)
	);
	const response = await getDocs(q);
	return response.docs;
};
