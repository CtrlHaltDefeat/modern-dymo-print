import { describe, it, expect, vi, beforeEach } from "vitest";
import { setLoggingState } from "@/logging/enableLogging";
import logMessage, { LogLevel } from "@/logging/logMessage";

describe("logMessage", () => {
	beforeEach(() => {
		vi.spyOn(console, "log");
		vi.spyOn(console, "warn");
		vi.spyOn(console, "error");
	});

	it("should not log message to console if logging is disabled", () => {
		setLoggingState(false);
		logMessage("test message");
		expect(console.log).not.toHaveBeenCalled();
	});

	it("should log message to console if logging is enabled", () => {
		setLoggingState(true);
		logMessage("test message");
		expect(console.log).toHaveBeenCalledTimes(1);
	});

	it("should warn message to console if logging is enabled and logLevel is WARNING", () => {
		setLoggingState(true);
		logMessage("test message", undefined, LogLevel.WARNING);
		expect(console.warn).toHaveBeenCalledTimes(1);
	});

	it("should error message to console if logging is enabled and logLevel is ERROR", () => {
		setLoggingState(true);
		logMessage("test message", undefined, LogLevel.ERROR);
		expect(console.error).toHaveBeenCalledTimes(1);
	});
});
