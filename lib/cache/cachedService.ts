import { removeCookie, setCookie } from "@/cache/cookies";
import { removeLocalStorage, setLocalStorage } from "@/cache/localStorage";
import logMessage from "@/logging/logMessage";

export const LOCAL_STORAGE_KEY = "DymoConnectSettings";

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
		logMessage("neither cookies nor localStorage available", error instanceof Error ? error : undefined);
		throw new Error("Neither localStorage nor cookies are available.");
	}
}
