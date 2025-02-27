import { describe, it, expect } from "vitest";
import { LOCAL_STORAGE_KEY } from "@/cache/cachedService";
import { getCachedService } from "@/cache/getCachedService";
import { setLocalStorage } from "@/cache/localStorage";
import { serviceSettings, unsetLocalStorage } from "./utils";

describe("getCachedService", () => {
	it("should get service from localStorage if it is available", () => {
		localStorage.clear();
		setLocalStorage(LOCAL_STORAGE_KEY, serviceSettings);

		const service = getCachedService();
		expect(service).toEqual(serviceSettings);
	});

	it("should get service from cookies if not in localStorage", () => {
		document.cookie = `${LOCAL_STORAGE_KEY}=${JSON.stringify(serviceSettings)}`;
		localStorage.clear();

		const service = getCachedService();
		expect(service).toEqual(serviceSettings);
	});

	it("should get service from cookies if localStorage is not available", () => {
		const originalLocalStorage = unsetLocalStorage();

		document.cookie = `${LOCAL_STORAGE_KEY}=${JSON.stringify(serviceSettings)}`;
		expect(getCachedService()).toEqual(serviceSettings);

		globalThis.localStorage = originalLocalStorage;
	});

	it("should return undefined values if neither in localStorage nor cookies", () => {
		localStorage.clear();
		document.cookie = `${LOCAL_STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

		expect(getCachedService()).toEqual({
			serviceHost: undefined,
			servicePort: undefined,
		});
	});

	it("should throw an error if neither localStorage nor cookies are available", () => {
		const originalLocalStorage = unsetLocalStorage();
		Object.defineProperty(document, "cookie", {
			get: () => {
				throw new Error();
			},
			set: () => {
				throw new Error();
			},
		});

		expect(() => getCachedService()).toThrow("Neither localStorage nor cookies are available.");

		globalThis.localStorage = originalLocalStorage;
	});
});
