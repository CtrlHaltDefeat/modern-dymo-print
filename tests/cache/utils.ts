import { DymoPrintService } from "@/index.ts";

export const serviceSettings = { serviceHost: DymoPrintService.HOST, servicePort: DymoPrintService.START_PORT };

export function unsetLocalStorage(): Storage {
	const originalLocalStorage = globalThis.localStorage;
	Object.defineProperty(globalThis, "localStorage", {
		value: undefined,
		configurable: true,
		writable: true,
	});
	return originalLocalStorage;
}

export function unsetCookies(): string {
	const originalCookies = globalThis.document.cookie;
	Object.defineProperty(globalThis.document, "cookie", {
		value: undefined,
		configurable: true,
		writable: true,
	});
	return originalCookies;
}
