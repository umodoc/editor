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

export const t = i18n.global.t as (key: string) => string;

export { i18n };
