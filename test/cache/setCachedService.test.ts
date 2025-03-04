import { LOCAL_STORAGE_KEY } from "@/cache/constants.ts";
import { setCachedService } from "@/cache/setCachedService.ts";
import { GlobalRegistrator } from "happy-dom";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { serviceSettings, unsetLocalStorage } from "./utils.ts";

// Helper to clear storage before each test
function clearStorage() {
	localStorage.clear();
}

Deno.test("setCachedService - localStorage operations", () => {
	clearStorage();

	// Set service
	setCachedService(serviceSettings.serviceHost, serviceSettings.servicePort);
	assertEquals(
		JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!),
		serviceSettings,
	);

	// Remove service
	setCachedService();
	assertEquals(localStorage.getItem(LOCAL_STORAGE_KEY), null);
});

Deno.test("setCachedService - cookie fallback when localStorage unavailable", async () => {
	clearStorage();
	GlobalRegistrator.register();
	const originalLocalStorage = unsetLocalStorage();

	// Set service
	setCachedService(serviceSettings.serviceHost, serviceSettings.servicePort);
	const cookieValue = document.cookie
		.split("; ")
		.find((row) => row.startsWith(LOCAL_STORAGE_KEY))
		?.split("=")[1];
	assertEquals(JSON.parse(cookieValue!), serviceSettings);

	// Remove service
	setCachedService();
	assertEquals(document.cookie, `${LOCAL_STORAGE_KEY}=`);

	globalThis.localStorage = originalLocalStorage;
	await GlobalRegistrator.unregister();
});

Deno.test("setCachedService - throws when no storage available", async () => {
	clearStorage();
	GlobalRegistrator.register();
	const originalLocalStorage = unsetLocalStorage();
	Object.defineProperty(document, "cookie", {
		get: () => {
			throw new Error();
		},
		set: () => {
			throw new Error();
		},
	});

	assertThrows(
		() => setCachedService(),
		Error,
		"Neither localStorage nor cookies are available.",
	);

	await GlobalRegistrator.unregister();
	globalThis.localStorage = originalLocalStorage;
});
