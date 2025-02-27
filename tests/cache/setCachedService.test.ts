import { describe, it, expect, afterEach } from "vitest";
import { LOCAL_STORAGE_KEY, setCachedService } from "@/cache/cachedService";
import { serviceSettings, unsetLocalStorage } from "./utils";

afterEach(() => {
	localStorage.clear();
});

describe("setCachedService", () => {
	it("should set and remove service in localStorage when available", () => {
		// Set service
		setCachedService(serviceSettings.serviceHost, serviceSettings.servicePort);
		expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!)).toEqual(serviceSettings);

		// Remove service
		setCachedService();
		expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
	});

	it("should set and remove service in cookies if localStorage is not available", () => {
		const originalLocalStorage = unsetLocalStorage();

		// Set service
		setCachedService(serviceSettings.serviceHost, serviceSettings.servicePort);
		const cookieValue = document.cookie
			.split("; ")
			.find((row) => row.startsWith(LOCAL_STORAGE_KEY))
			?.split("=")[1];
		expect(JSON.parse(cookieValue!)).toEqual(serviceSettings);

		// Remove service
		setCachedService();
		expect(document.cookie).toBe(`${LOCAL_STORAGE_KEY}=`);

		globalThis.localStorage = originalLocalStorage;
	});

	it("should throw if neither localStorage nor cookies are available", () => {
		const originalLocalStorage = unsetLocalStorage();
		Object.defineProperty(document, "cookie", {
			get: () => {
				throw new Error();
			},
			set: () => {
				throw new Error();
			},
		});

		expect(() => setCachedService()).toThrow("Neither localStorage nor cookies are available.");

		globalThis.localStorage = originalLocalStorage;
	});
});
