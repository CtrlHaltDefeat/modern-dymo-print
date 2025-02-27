import { describe, it, expect } from "vitest";
import { getCookie, removeCookie, setCookie } from "@/cache/cookies";

describe("Cookie operations", () => {
	it("should store and retrieve a value", () => {
		const key = "testCookie";
		const value = "value";

		setCookie(key, value);

		const cookie = document.cookie.split("; ").find((row) => row.startsWith(key));
		expect(cookie).toBe(`${key}=${value}`);
		expect(getCookie(key)).toBe(value);
	});

	it("should remove a stored value", () => {
		const key = "removeCookieTest";
		const value = "value";

		document.cookie = `${key}=${value}`;
		removeCookie(key);

		const cookie = document.cookie.split("; ").find((row) => row.startsWith(key));
		expect(cookie).toBe("removeCookieTest=");
	});

	it("throws an error if cookies are not available", () => {
		const originalCookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");

		// Simulate no cookie support
		Object.defineProperty(document, "cookie", {
			get: () => {
				throw new Error();
			},
			set: () => {
				throw new Error();
			},
		});

		expect(() => setCookie("key", "value")).toThrow();
		expect(() => getCookie("key")).toThrow();
		expect(() => removeCookie("key")).toThrow();

		// Restore original cookie property
		if (originalCookieDesc) {
			Object.defineProperty(document, "cookie", originalCookieDesc);
		}
	});
});
