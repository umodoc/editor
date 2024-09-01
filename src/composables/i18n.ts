import { isRecord } from "@tool-belt/type-predicates";

import { i18n } from "@/i18n";

export const l = (data: unknown) => {
	const lang: string = i18n.global.locale.value.replace("-", "_");
	if (typeof data === "string") {
		return data;
	}
	if (isRecord(data)) {
		return data[lang];
	}
};

// @ts-expect-error, typing is recursive.
export const t = i18n.global.t;

export { i18n };
