import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	QuerySnapshot,
	startAfter,
	type DocumentData,
	type Query
} from 'firebase/firestore';
import { db } from './fbase';
import type { Canvas } from 'fabric';

export type Paper = {
	link: string;
	creator?: string;
	creatorEmoji?: string;
	canvas: Canvas;
	creatorId: string;
	createdAt: number;
	source: { height: number; width: number; src: string }[];
	to?: string;
};

export class PaperGetter {
	paperList: Paper[];
	nextPage?: Query;
	empty: boolean;
	end: boolean;
	id: string;
	constructor(id: string) {
		this.paperList = [];
		this.nextPage = undefined;
		this.empty = false;
		this.end = false;
		this.id = id;
	}

	async getFirst() {
		const first = query(
			collection(db, 'paper', this.id, 'papers'),
			orderBy('createdAt'),
			limit(12)
		);
		const snapshots = await getDocs(first);
		if (snapshots.empty) {
			this.empty = true;
			this.end = true;
		} else {
			snapshots.forEach((snapshot) => {
				this.paperList.push({ ...(snapshot.data() as Paper) });
			});
			let lastVisible = snapshots.docs[snapshots.docs.length - 1];
			this.nextPage = query(
				collection(db, 'paper', this.id, 'papers'),
				orderBy('createdAt'),
				startAfter(lastVisible),
				limit(12)
			);
		}
		return this.paperList;
	}

	async next() {
		if (this.end || !this.nextPage) return this.paperList;
		let snapshots: QuerySnapshot<DocumentData, DocumentData>;
		snapshots = await getDocs(this.nextPage);
		if (snapshots.empty) {
			this.end = true;
		}
		snapshots.forEach((snapshot) => {
			this.paperList.push({
				...(snapshot.data() as Paper)
			});
		});
		if (snapshots.docs.length < 12) {
			this.end = true;
		} else {
			let lastVisible = snapshots.docs[snapshots.docs.length - 1];
			this.nextPage = query(
				collection(db, 'paper', this.id, 'papers'),
				orderBy('createdAt'),
				startAfter(lastVisible),
				limit(12)
			);
		}
		return this.paperList;
	}
}
