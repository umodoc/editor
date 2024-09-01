import type { Extension } from "@tiptap/core";

import type { NodesComputed } from "@/extensions/page/types";

export interface MarginOption {
	left: number;
	right: number;
	top: number;
	bottom: number;
}
export interface WatermarkOption {
	type: string;
	alpha: number;
	fontColor: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
	text: string;
}
export interface NodesComputedOption {
	types: string[];
	nodesComputed: NodesComputed;
}

export interface PageOption {
	defaultMargin?: MarginOption;
	defaultOrientation?: string;
	defaultBackground?: string;
	watermark?: WatermarkOption;
	nodesComputedOption?: NodesComputedOption;
	size?: unknown;
	margin?: unknown;
	orientation?: string;
	background?: string;
	header?: boolean;
	footer?: boolean;
	showLineNumber?: boolean;
	showToc?: boolean;
	pagination?: boolean;
	zoomLevel?: number;
	autoWidth?: boolean;
	preview?: {
		enabled?: boolean;
		laserPointer?: boolean;
	};
}
export interface ToolbarOptions {
	defaultMode: string;
	enableSourceEditor: boolean;
	menus: string[];
	disableMenuItems: unknown[];
	importWord: {
		enabled: boolean;
		options: unknown;
		useCustomMethod: boolean;
	};
}
export type Dictionary = Record<string, unknown>;

export interface DocumentOptions {
	id: string;
	title: string;
	content: string;
	placeholder: Dictionary;
	enableSpellcheck: boolean;
	enableMarkdown: boolean;
	enableBubbleMenu: boolean;
	enableBlockMenu: boolean;
	enableComment: boolean;
	readOnly: boolean;
	autofocus: boolean;
	characterLimit: number;
	typographyRules: Dictionary;
	editorProps: Dictionary;
	parseOptions: Dictionary;
	autoSave: Dictionary;
}

//定义一个 异步方法
export type AsyncMethod = (...args: unknown[]) => Promise<void>;
export type Method = (...args: unknown[]) => void;
export interface UmoEditorOptions {
	editorKey: string;
	locale: "en-US" | "zh-CN";
	theme: "light" | "dark";
	height: string;
	dicts?: { pageSizes: { default: boolean; value: string }[] };
	toolbar?: ToolbarOptions;
	page: PageOption;
	document?: DocumentOptions;
	assistant?: Dictionary;
	templates?: unknown[];
	cdnUrl?: string;
	shareUrl?: string;
	diagrams?: Dictionary;
	file?: Dictionary;
	user?: Dictionary;
	extensions?: Extension[];
	translations?: Dictionary;
	onSave?: AsyncMethod;
	onFileUpload?: AsyncMethod;
	onFileDelete?: Method;
	onAssistant?: AsyncMethod;
	onCustomImportWordMethod?: AsyncMethod;
}
