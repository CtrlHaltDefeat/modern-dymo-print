import { DymoPrintService } from "@/index";
import { COMMAND_ERROR, MISSING_CONTENT_TYPE_ERROR } from "@/webService/constants";
import invokeCommand from "@/webService/invokeCommand";
import { describe, expect, it } from "vitest";
import { startHttpServer, stopHttpServer } from "../utils";

describe("invokeCommand", () => {
	it("throws an error if the response is not ok", async () => {
		await expect(invokeCommand("localhost", DymoPrintService.START_PORT, "test")).rejects.toThrow(new RegExp(`^${COMMAND_ERROR}`));
	});

	it("throws an error if no content type is provided", async () => {
		await startHttpServer("localhost", DymoPrintService.START_PORT, (_request, response) => {
			response.setHeader("content-type", "");
		});

		try {
			await expect(invokeCommand("localhost", DymoPrintService.START_PORT, "test")).rejects.toThrow(MISSING_CONTENT_TYPE_ERROR);
		} finally {
			await stopHttpServer();
		}
	});

	it("should return JSON response if content type is application/json", async () => {
		await startHttpServer("localhost", DymoPrintService.START_PORT, (_request, response) => {
			response.setHeader("content-type", "application/json");
			response.end(JSON.stringify({ test: "test" }));
		});

		try {
			const result = await invokeCommand("localhost", DymoPrintService.START_PORT, "test");
			expect(result).toEqual({ test: "test" });
		} finally {
			await stopHttpServer();
		}
	});

	it("should return text response if content type is not application/json", async () => {
		await startHttpServer("localhost", DymoPrintService.START_PORT, (_request, response) => {
			response.setHeader("content-type", "text/plain");
			response.end("test");
		});

		try {
			const result = await invokeCommand("localhost", DymoPrintService.START_PORT, "test");
			expect(result).toBe("test");
		} finally {
			await stopHttpServer();
		}
	});
});
