const EXPIRATION_DATE_STRING = "Thu, 01 Jan 1970 00:00:00 UTC";

const checkAreCookiesAvailable = (): void => {
	if (typeof navigator.cookieEnabled === "boolean" && navigator.cookieEnabled) {
		return;
	}

	const testCookieKey = "testCookie";
	const testCookieValue = "test";

	globalThis.document.cookie = getCookieString(testCookieKey, testCookieValue);

	const newValue = (document?.cookie ?? "")
		.split("; ")
		.find((row) => row.startsWith(testCookieKey))
		?.split("=")[1];

	globalThis.document.cookie = getCookieString(testCookieKey);

	if (newValue !== testCookieValue) {
		throw new Error("Cookies are not equivalent.");
	}
};

export function getCookieString(key: string, value?: string): string {
	let cookieString = key;
	if (value) {
		cookieString += `=${value}`;
	} else {
		cookieString += `=; ${EXPIRATION_DATE_STRING}`;
	}

	return cookieString;
}

/**
 * @throws {Error} - If cookies are not available.
 */
export function removeCookie(key: string): void {
	checkAreCookiesAvailable();

	document.cookie = getCookieString(key);
}

/**
 * @throws {Error} - If cookies are not available.
 */
export function setCookie(key: string, value: string): void {
	checkAreCookiesAvailable();

	document.cookie = getCookieString(key, value);
}

/**
 * @throws {Error} - If cookies are not available.
 */
export function getCookie(key: string): string | undefined {
	checkAreCookiesAvailable();

	return (document?.cookie ?? "")
		.split("; ")
		.find((row) => row.startsWith(key))
		?.split("=")[1];
}
