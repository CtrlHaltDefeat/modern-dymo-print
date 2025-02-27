import { describe, it, expect, afterEach } from "vitest";
import { getFromLocalStorage, setLocalStorage } from "@/cache/localStorage";
import { unsetLocalStorage } from "./utils";

afterEach(() => {
	localStorage.clear();
});

describe("localStorage operations", () => {
	it("throws an error if localStorage is not available", () => {
		const originalLocalStorage = unsetLocalStorage();
		expect(() => setLocalStorage("key", "value")).toThrow();
		expect(() => getFromLocalStorage("key")).toThrow();
		globalThis.localStorage = originalLocalStorage;
	});

	it("should store and retrieve a value", () => {
		localStorage.clear();
		const key = "testKey";
		const value = { a: 1, b: 2 };

		setLocalStorage(key, value);
		expect(JSON.parse(localStorage.getItem(key)!)).toEqual(value);

		const retrieved = getFromLocalStorage(key);
		expect(retrieved).toEqual(value);

		localStorage.clear();
	});

	it("should return undefined for non-existent key", () => {
		localStorage.clear();
		const key = "nonExistentKey";

		expect(getFromLocalStorage(key)).toBeUndefined();
	});
});
