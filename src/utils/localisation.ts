import { isRecord } from "@tool-belt/type-predicates";

import { i18n } from "@/i18n";

export function localize(data: string | Record<string, string>) {
	if (typeof data === "string") {
		return data;
	}

	if (isRecord(data)) {
		return data[i18n.global.locale.value.replace("-", "_")];
	}
}
