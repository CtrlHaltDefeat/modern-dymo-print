import { LOCAL_STORAGE_NOT_AVAILABLE_ERROR } from "@/cache/constants.ts";
import { getFromLocalStorage, setLocalStorage } from "@/cache/localStorage.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { unsetLocalStorage } from "./utils.ts";

function clearStorage() {
	localStorage.clear();
}

Deno.test("localStorage - throws when not available", () => {
	clearStorage();
	const originalLocalStorage = unsetLocalStorage();

	assertThrows(() => setLocalStorage("key", "value"), LOCAL_STORAGE_NOT_AVAILABLE_ERROR);
	assertThrows(() => getFromLocalStorage("key"), LOCAL_STORAGE_NOT_AVAILABLE_ERROR);

	globalThis.localStorage = originalLocalStorage;
});

Deno.test("localStorage - store and retrieve value", () => {
	clearStorage();
	const key = "testKey";
	const value = { a: 1, b: 2 };

	setLocalStorage(key, value);
	assertEquals(JSON.parse(localStorage.getItem(key)!), value);

	const retrieved = getFromLocalStorage(key);
	assertEquals(retrieved, value);
});

Deno.test("localStorage - return undefined for non-existent key", () => {
	clearStorage();
	const key = "nonExistentKey";

	assertEquals(getFromLocalStorage(key), undefined);
});
