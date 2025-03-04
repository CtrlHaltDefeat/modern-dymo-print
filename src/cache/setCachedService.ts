import { LOCAL_STORAGE_KEY, NEITHER_LOCAL_STORAGE_AND_COOKIES_AVAILABLE_ERROR } from "@/cache/constants.ts";
import { removeCookie, setCookie } from "@/cache/cookies.ts";
import { removeLocalStorage, setLocalStorage } from "@/cache/localStorage.ts";
import logMessage from "@/logging/logMessage.ts";

export function setCachedService(serviceHost?: string, servicePort?: number): void {
	try {
		if (servicePort && serviceHost) {
			setLocalStorage(LOCAL_STORAGE_KEY, { serviceHost, servicePort });
			return;
		}

		removeLocalStorage(LOCAL_STORAGE_KEY);
		return;
	} catch (error) {
		logMessage("LocalStorage not available", error instanceof Error ? error : undefined);
	}

	try {
		if (servicePort && serviceHost) {
			setCookie(LOCAL_STORAGE_KEY, JSON.stringify({ serviceHost, servicePort }));
			return;
		}

		removeCookie(LOCAL_STORAGE_KEY);
		return;
	} catch (error) {
		logMessage(NEITHER_LOCAL_STORAGE_AND_COOKIES_AVAILABLE_ERROR, error instanceof Error ? error : undefined);
		throw new Error(NEITHER_LOCAL_STORAGE_AND_COOKIES_AVAILABLE_ERROR);
	}
}
