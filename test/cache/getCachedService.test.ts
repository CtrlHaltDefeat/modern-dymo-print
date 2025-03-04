import { LOCAL_STORAGE_KEY } from "@/cache/constants.ts";
import { getCachedService } from "@/cache/getCachedService.ts";
import { GlobalRegistrator } from "happy-dom";
import { assertEquals } from "jsr:@std/assert";
import { serviceSettings, unsetLocalStorage } from "./utils.ts";

function clearStorage() {
	localStorage.clear();
}

Deno.test("getCachedService - returns null when no service is cached", () => {
	clearStorage();
	assertEquals(getCachedService(), { serviceHost: undefined, servicePort: undefined });
});

Deno.test("getCachedService - returns service from localStorage when available", () => {
	clearStorage();
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serviceSettings));
	assertEquals(getCachedService(), serviceSettings);
});

Deno.test("getCachedService - returns service from cookies when localStorage unavailable", async () => {
	clearStorage();
	GlobalRegistrator.register();

	const originalLocalStorage = unsetLocalStorage();
	document.cookie = `${LOCAL_STORAGE_KEY}=${JSON.stringify(serviceSettings)}`;

	assertEquals(getCachedService(), serviceSettings);

	await GlobalRegistrator.unregister();
	globalThis.localStorage = originalLocalStorage;
});
