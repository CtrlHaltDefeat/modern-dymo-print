import { LOCAL_STORAGE_KEY } from "@/cache/cachedService";
import { getCookie } from "@/cache/cookies";
import { getFromLocalStorage } from "@/cache/localStorage";
import type { WebServiceSettings } from "@/cache/types";
import logMessage from "@/logging/logMessage";

export function getCachedService(): WebServiceSettings {
	let serviceHost: string | undefined = undefined;
	let servicePort: number | undefined = undefined;
	let localStorageUnavailable = false;
	let cookiesUnavailable = false;

	try {
		({ serviceHost, servicePort } = getFromLocalStorage<WebServiceSettings>(LOCAL_STORAGE_KEY) ?? {});

		if (serviceHost && servicePort) {
			return {
				serviceHost,
				servicePort,
			};
		}
	} catch (error) {
		localStorageUnavailable = true;
		logMessage("LocalStorage not available", error instanceof Error ? error : undefined);
	}

	let cookie: string = "{}";

	try {
		cookie = getCookie(LOCAL_STORAGE_KEY) ?? "{}";

		return {
			serviceHost: JSON.parse(cookie).serviceHost,
			servicePort: JSON.parse(cookie).servicePort,
		};
	} catch (error) {
		cookiesUnavailable = true;
		logMessage("Cookies not available", error instanceof Error ? error : undefined);
	}

	if (localStorageUnavailable && cookiesUnavailable) throw new Error("Neither localStorage nor cookies are available.");

	return {
		serviceHost,
		servicePort,
	};
}
