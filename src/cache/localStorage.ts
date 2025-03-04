import { LOCAL_STORAGE_NOT_AVAILABLE_ERROR, LOCAL_STORAGE_SAVE_ERROR } from "@/cache/constants.ts";
import logMessage, { LogLevel } from "@/logging/logMessage.ts";

const checkIsLocalStorageAvailable = (): void => {
	let storageValue = undefined;

	try {
		globalThis.localStorage.setItem("test", "test");
		storageValue = globalThis.localStorage.getItem("test");
		globalThis.localStorage.removeItem("test");
	} catch (error) {
		logMessage(LOCAL_STORAGE_NOT_AVAILABLE_ERROR, error instanceof Error ? error : "", LogLevel.ERROR);
		throw new Error(LOCAL_STORAGE_NOT_AVAILABLE_ERROR);
	}
	if (storageValue !== "test") {
		throw new Error(LOCAL_STORAGE_SAVE_ERROR);
	}
};

export function setLocalStorage(key: string, value: unknown): void {
	checkIsLocalStorageAvailable();

	localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalStorage(key: string): void {
	checkIsLocalStorageAvailable();

	localStorage.removeItem(key);
}

export function getFromLocalStorage<T extends Record<string, unknown>>(key: string): T | undefined {
	checkIsLocalStorageAvailable();

	const value = localStorage.getItem(key);

	return value ? JSON.parse(value) : undefined;
}
