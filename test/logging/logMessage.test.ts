import { setLoggingState } from "@/logging/enableLogging.ts";
import logMessage, { LogLevel } from "@/logging/logMessage.ts";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

function setupSpies() {
	const consoleSpy = {
		log: spy(console, "log"),
		warn: spy(console, "warn"),
		error: spy(console, "error"),
	};
	return consoleSpy;
}

function teardownSpies(spies: ReturnType<typeof setupSpies>) {
	spies.log.restore();
	spies.warn.restore();
	spies.error.restore();
}

Deno.test("logMessage - should not log when disabled", () => {
	const spies = setupSpies();
	setLoggingState(false);
	logMessage("test message");
	assertSpyCalls(spies.log, 0);
	teardownSpies(spies);
});

Deno.test("logMessage - should log when enabled", () => {
	const spies = setupSpies();
	setLoggingState(true);
	logMessage("test message");
	assertSpyCalls(spies.log, 1);
	teardownSpies(spies);
});

Deno.test("logMessage - should warn when level is WARNING", () => {
	const spies = setupSpies();
	setLoggingState(true);
	logMessage("test message", undefined, LogLevel.WARNING);
	assertSpyCalls(spies.warn, 1);
	teardownSpies(spies);
});

Deno.test("logMessage - should error when level is ERROR", () => {
	const spies = setupSpies();
	setLoggingState(true);
	logMessage("test message", undefined, LogLevel.ERROR);
	assertSpyCalls(spies.error, 1);
	teardownSpies(spies);
});
