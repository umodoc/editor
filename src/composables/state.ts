import type { RemovableRef } from "@vueuse/core";

import { i18n } from "@/i18n";
import type { DocumentOptions } from "@/types";

type StateKey = "toolbar" | "document" | "recent" | "print" | "locale";

type StateValue<K extends StateKey> = K extends "document"
	? RemovableRef<Partial<DocumentOptions>>
	: K extends "toolbar"
		? RemovableRef<{
				mode: "classic" | "ribbon" | "source";
				show: boolean;
			}>
		: K extends "recent"
			? RemovableRef<{
					fonts: string[];
					colors: string[];
				}>
			: K extends "print"
				? RemovableRef<{
						singleColumn: boolean;
						showPageNumber: boolean;
					}>
				: K extends "locale"
					? RemovableRef<"en-US" | "zh-CN">
					: never;

export function useState<K extends StateKey>(
	key: K,
	editorKey?: string,
): StateValue<K> {
	const { options } = useStore();
	const storageKey = `umo-editor:${editorKey ?? options.value.editorKey}:${key}`;

	if (key === "document") {
		return useStorage(
			storageKey,
			options.value.document ?? ({} as Partial<DocumentOptions>),
		) as StateValue<K>;
	}
	if (key === "toolbar") {
		return useStorage(storageKey, {
			mode: options.value.toolbar?.defaultMode ?? "classic",
			show: true,
		}) as StateValue<K>;
	}
	if (key === "recent") {
		return useStorage(storageKey, {
			fonts: [] as string[],
			colors: [] as string[],
		}) as StateValue<K>;
	}
	if (key === "print") {
		return useStorage(storageKey, {
			singleColumn: true,
			showPageNumber: true,
		}) as StateValue<K>;
	}
	if (key === "locale") {
		return useStorage(storageKey, i18n.global.locale.value) as StateValue<K>;
	}
	throw new Error("[useStorage]", { cause: "Key is not valid" });
}
