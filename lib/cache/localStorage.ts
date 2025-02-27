const checkIsLocalStorageAvailable = (): void => {
	globalThis.localStorage.setItem("test", "test");
	const storageValue = globalThis.localStorage.getItem("test");
	globalThis.localStorage.removeItem("test");
	if (storageValue !== "test") {
		throw new Error("LocalStorage values are not equivalent");
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
