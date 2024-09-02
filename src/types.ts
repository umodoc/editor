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
export interface ToolbarOptions {
	defaultMode: "classic" | "ribbon";
	enableSourceEditor: boolean;
	menus: string[];
	disableMenuItems: unknown[];
	importWord: {
		enabled: boolean;
		options: unknown;
		useCustomMethod: boolean;
	};
}
export interface DocumentOptions {
	id: string;
	title: string;
	content: string;
	placeholder: Record<string, unknown>;
	enableSpellcheck: boolean;
	enableMarkdown: boolean;
	enableBubbleMenu: boolean;
	enableBlockMenu: boolean;
	enableComment: boolean;
	readOnly: boolean;
	autofocus: boolean;
	characterLimit: number;
	typographyRules: Record<string, unknown>;
	editorProps: Record<string, unknown>;
	parseOptions: Record<string, unknown>;
	autoSave: Record<string, unknown>;
}

//定义一个 异步方法
export interface UmoEditorOptions {
	editorKey: string;
	locale: SupportedLocale;
	theme: "light" | "dark";
	height: string;
	dicts?: { pageSizes: { default: boolean; value: string; label: string }[] };
	toolbar?: ToolbarOptions;
	page: PageOption;
	document?: DocumentOptions;
	assistant?: Record<string, unknown>;
	templates?: unknown[];
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
