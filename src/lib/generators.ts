import { FabricImage, FabricObject, FabricText, Rect, util, type Canvas } from 'fabric';
import { downloadAllWebfont } from './webfontDownloader';
import { convertImageToWebP } from './imageFunc';

type Font = {
	fontsize: number;
	color: string;
	bg_color?: string;
	font?: string;
};

type tabType = 'gifSearch' | 'gifPreview' | 'textEdit' | 'rectEdit' | 'none';
type Selected = 'rect' | 'text' | 'gif' | 'none' | 'img';

type Selector = (type: Selected) => void;

export type GifData = { url: string };
export type TextData = {
	content: string;
	fontsize: number;
	color: string;
	bg_color: string;
	font: string;
};
export type RectData = {
	width: number;
	height: number;
	color: string;
};
export type ModifierParams = {
	content?: string;
	fontsize?: number;
	color?: string;
	bg_color?: string;
	font?: string;
	width?: number;
	height?: number;
	textAlign?: string;
};

export type Obj = FabricImage | FabricText | Rect;

export class GifGenerator {
	list: FabricImage[];
	canvas: Canvas;
	selector: Selector;
	selected: boolean[];
	constructor(canvas: Canvas, selector: Selector) {
		this.list = [];
		this.canvas = canvas;
		this.selector = selector;
		this.selected = [];
	}
	async createNew(url: string, width: number = 100, height: number = 100) {
		const gif = document.createElement('video');
		const gifSource = document.createElement('source');
		gif.id = url;
		gif.width = width;
		gif.height = height;
		gif.muted = true;
		gifSource.src = url;
		gif.autoplay = true;
		gif.loop = true;
		gif.appendChild(gifSource);

		const newGif = new FabricImage(gif, {
			objectCaching: false,
			scaleX: 200 / width,
			scaleY: 200 / width,
			centeredScaling: true
		});
		newGif.set('src', url);
		newGif.set('isGif', true);

		newGif.on('scaling', (event) => {
			const { corner } = event.transform;
			if (corner === 'ml') {
				newGif.scale(newGif.scaleX);
			} else if (corner === 'mr') {
				newGif.scale(newGif.scaleX);
			} else if (corner === 'mt') {
				newGif.scale(newGif.scaleY);
			} else {
				newGif.scale(newGif.scaleY);
			}
		});
		this.canvas.setActiveObject(newGif);
		newGif.on('selected', () => {
			this.canvas.bringObjectToFront(newGif);
			this.selector('gif');
		});
		newGif.on('removed', () => {
			this.list.splice(this.list.indexOf(newGif), 1);
		});
		this.canvas.add(newGif);
		gif.play();
		this.selector('gif');
		const canvas = this.canvas;
		util.requestAnimFrame(function render() {
			canvas.renderAll();
			util.requestAnimFrame(render);
		});
	}
	removeSelected() {
		if (this?.canvas) {
			let obj: FabricObject | undefined = this?.canvas?.getActiveObject();
			this.canvas.remove(obj ? obj : new FabricObject());
			this.selector('none');
		}
	}
}

export class TextGenerator {
	list: FabricText[];
	canvas: Canvas;
	selector: Selector;
	selected: boolean[];
	constructor(canvas: Canvas, selector: Selector) {
		this.list = [];
		this.canvas = canvas;
		this.selector = selector;
		this.selected = [];
	}
	createNew(content: string, params: Font) {
		const { fontsize, color, bg_color, font } = params;
		const newText = new FabricText(content, {
			fontSize: fontsize,
			backgroundColor: bg_color,
			fill: color,
			centeredScaling: true
		});
		if (font) {
			newText.set('fontFamily', font);
		}
		newText.on('scaling', (event) => {
			const { corner } = event.transform;
			if (corner === 'ml') {
				newText.scale(newText.scaleX);
			} else if (corner === 'mr') {
				newText.scale(newText.scaleX);
			} else if (corner === 'mt') {
				newText.scale(newText.scaleY);
			} else {
				newText.scale(newText.scaleY);
			}
		});
		this.list.push(newText);
		this.canvas.add(newText);
		this.canvas.setActiveObject(newText);
		newText.on('selected', () => {
			this.canvas.bringObjectToFront(newText);
			this.selector('text');
		});
		newText.on('removed', () => {
			this.list.splice(this.list.indexOf(newText), 1);
		});
		this.selector('text');
	}
	modify(params: ModifierParams) {
		const { content, fontsize, color, bg_color, font, textAlign } = params;
		if (content) this.canvas.getActiveObject()?.set('text', content);
		if (fontsize) this.canvas.getActiveObject()?.set('fontSize', fontsize);
		if (color) this.canvas.getActiveObject()?.set('fill', color);
		if (font) this.canvas.getActiveObject()?.set('fontFamily', font);
		if (textAlign) this.canvas.getActiveObject()?.set('textAlign', textAlign);
		this.canvas.renderAll();
	}
	removeSelected() {
		if (this?.canvas) {
			let obj: FabricObject | undefined = this?.canvas?.getActiveObject();
			this.canvas.remove(obj ? obj : new FabricObject());
			this.selector('none');
		}
	}
}

export class RectGenerator {
	list: Rect[];
	canvas: Canvas;
	selector: Selector;
	selected: boolean[];
	constructor(canvas: Canvas, selector: Selector) {
		this.list = [];
		this.selected = [];
		this.canvas = canvas;
		this.selector = selector;
	}
	createNew() {
		const newRect = new Rect({ width: 100, height: 100, fill: 'blue', centeredScaling: true });
		this.list.push(newRect);
		this.canvas.add(newRect);

		newRect.on('selected', () => {
			this.canvas.bringObjectToFront(newRect);
			this.selector('rect');
		});
		newRect.on('removed', () => {
			this.list.splice(this.list.indexOf(newRect), 1);
		});
		newRect.on('resizing', () => {
			newRect.width = newRect.width * newRect.scaleX;
			newRect.height = newRect.height * newRect.scaleY;
			newRect.scaleX = 1;
			newRect.scaleY = 1;
		});
		this.canvas.setActiveObject(newRect);
		this.selector('rect');
	}
	modify(params: ModifierParams) {
		const { color } = params;
		if (color) this.canvas.getActiveObject()?.set('fill', color);
		this.canvas.renderAll();
	}
	removeSelected() {
		if (this?.canvas) {
			let obj: FabricObject | undefined = this?.canvas?.getActiveObject();
			this.canvas.remove(obj ? obj : new FabricObject());
			this.selector('none');
		}
	}
}

export class ImgGenerator {
	list: FabricImage[];
	canvas: Canvas;
	selector: Selector;
	selected: boolean[];
	constructor(canvas: Canvas, selector: Selector) {
		this.list = [];
		this.canvas = canvas;
		this.selector = selector;
		this.selected = [];
	}
	async createNew(url: string, width: number = 100) {
		const newImg = await FabricImage.fromURL(url);
		newImg.centeredScaling = true;

		this.list.push(newImg);
		newImg.scale(width / newImg.width);
		newImg.on('scaling', (event) => {
			const { corner } = event.transform;
			if (corner === 'ml') {
				newImg.scale(newImg.scaleX);
			} else if (corner === 'mr') {
				newImg.scale(newImg.scaleX);
			} else if (corner === 'mt') {
				newImg.scale(newImg.scaleY);
			} else {
				newImg.scale(newImg.scaleY);
			}
		});
		newImg.on('selected', () => {
			this.canvas.bringObjectToFront(newImg);
			this.selector('img');
		});
		newImg.on('removed', () => {
			this.list.splice(this.list.indexOf(newImg), 1);
			this.selector('none');
		});
		this.canvas.add(newImg);
		this.canvas.setActiveObject(newImg);
		this.selector('img');
	}
	removeSelected() {
		if (this?.canvas) {
			let obj: FabricObject | undefined = this?.canvas?.getActiveObject();
			this.canvas.remove(obj ? obj : new FabricObject());
			this.selector('none');
		}
	}
}
