import { getCookie, removeCookie, setCookie } from "@/cache/cookies.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";

Deno.test("cookies - store and retrieve value", async () => {
	GlobalRegistrator.register();
	const key = "testCookie";
	const value = "value";

	setCookie(key, value);

	const cookie = document.cookie.split("; ").find((row) => row.startsWith(key));
	assertEquals(cookie, `${key}=${value}`);
	assertEquals(getCookie(key), value);
	await GlobalRegistrator.unregister();
});

Deno.test("cookies - remove stored value", async () => {
	GlobalRegistrator.register();
	const key = "removeCookieTest";
	const value = "value";

	document.cookie = `${key}=${value}`;
	removeCookie(key);

	const cookie = document.cookie.split("; ").find((row) => row.startsWith(key));
	assertEquals(cookie, "removeCookieTest=");
	await GlobalRegistrator.unregister();
});

Deno.test("cookies - throws when not available", async () => {
	GlobalRegistrator.register();

	// Simulate no cookie support
	Object.defineProperty(document, "cookie", {
		get: () => {
			throw new Error();
		},
		set: () => {
			throw new Error();
		},
	});

	assertThrows(() => setCookie("key", "value"));
	assertThrows(() => getCookie("key"));
	assertThrows(() => removeCookie("key"));

	await GlobalRegistrator.unregister();
});
