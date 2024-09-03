import type { Extension } from "@tiptap/core";
import type { AsyncFunction } from "@tool-belt/type-predicates";

import type { NodesComputed } from "@/extensions/page/types";
export type SupportedLocale = "en-US" | "zh-CN";
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

export type ToolbarMenu =
	| "base"
	| "insert"
	| "table"
	| "tools"
	| "page"
	| "export"
	| "advanced"
	| "custom";

export interface ToolbarOptions {
	defaultMode: "classic" | "ribbon";
	enableSourceEditor: boolean;
	menus: ToolbarMenu[];
	disableMenuItems: string[];
	importWord: {
		enabled: boolean;
		options: unknown;
		useCustomMethod: boolean;
	};
}
export interface DocumentOptions {
	id?: string;
	title: string;
	content: string;
	placeholder?: Record<string, unknown>;
	enableSpellcheck?: boolean;
	enableMarkdown?: boolean;
	enableBubbleMenu?: boolean;
	enableBlockMenu?: boolean;
	enableComment?: boolean;
	readOnly?: boolean;
	autofocus?: "start" | "end" | "all" | number | boolean | null;
	characterLimit?: number;
	typographyRules?: Record<string, unknown>;
	editorProps?: Record<string, unknown>;
	parseOptions?: Record<string, unknown>;
	autoSave?: {
		enabled: boolean;
		interval: number;
	};
}

export type LocaleLabel = string | { en_US: string; zh_CN: string };

export interface PageSize {
	label: LocaleLabel;
	width: number;
	height: number;
	default?: boolean;
}

export interface Font {
	label: LocaleLabel;
	value: string | null;
}

export interface LineHeight {
	label: LocaleLabel;
	value: number;
	default?: boolean;
}

export interface GraphicSymbol {
	label: LocaleLabel;
	items: string;
}

export interface Emoji {
	label: LocaleLabel;
	items: string;
}

export interface Template {
	title: string;
	content: string;
	description?: string;
}

//定义一个 异步方法
export interface UmoEditorOptions {
	editorKey: string;
	locale: SupportedLocale;
	theme: "light" | "dark";
	height: string;
	dicts?: {
		pageSizes: PageSize[];
		fonts: Font[];
		colors: string[];
		lineHeights: LineHeight[];
		symbols: GraphicSymbol[];
		emojis: Emoji[];
	};
	toolbar?: ToolbarOptions;
	page: PageOption;
	document?: DocumentOptions;
	assistant?: Record<string, unknown>;
	templates?: Template[];
	cdnUrl?: string;
	shareUrl?: string;
	diagrams?: Record<string, unknown>;
	file?: Record<string, unknown>;
	user?: Record<string, unknown>;
	extensions?: Extension[];
	translations?: Record<string, unknown>;
	onSave?: AsyncFunction;
	onFileUpload?: AsyncFunction;
	onFileDelete?: CallableFunction;
	onAssistant?: AsyncFunction;
	onCustomImportWordMethod?: AsyncFunction;
}
