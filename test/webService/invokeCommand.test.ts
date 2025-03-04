import { DymoPrintService } from "@/index.ts";
import { COMMAND_ERROR, MISSING_CONTENT_TYPE_ERROR } from "@/webService/constants.ts";
import invokeCommand from "@/webService/invokeCommand.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { startHttpServer } from "../utils.ts";

Deno.test("throws an error if the response is not ok", async () => {
	await assertRejects(() => invokeCommand(DymoPrintService.HOST, DymoPrintService.START_PORT, "test"), Error, COMMAND_ERROR);
});

Deno.test({
	name: "throws an error if no content type is provided",
	sanitizeResources: false,
	fn: async () => {
		const server = await startHttpServer(DymoPrintService.HOST, DymoPrintService.START_PORT, () => {
			return new Response("", {
				headers: { "content-type": "" },
			});
		});

		await assertRejects(() => invokeCommand(DymoPrintService.HOST, DymoPrintService.START_PORT, "test"), Error, MISSING_CONTENT_TYPE_ERROR);

		await server.shutdown();
	},
});

Deno.test({
	name: "should return JSON response if content type is application/json",
	sanitizeResources: false,
	fn: async () => {
		const server = await startHttpServer(DymoPrintService.HOST, DymoPrintService.START_PORT, () => {
			return Response.json({ test: "test" });
		});

		const result = await invokeCommand(DymoPrintService.HOST, DymoPrintService.START_PORT, "test");
		assertEquals(result, { test: "test" });

		await server.shutdown();
	},
});

Deno.test({
	name: "should return text response if content type is not application/json",
	sanitizeResources: false,
	fn: async () => {
		const server = await startHttpServer(DymoPrintService.HOST, DymoPrintService.START_PORT, () => {
			return new Response("test", {
				headers: { "content-type": "text/plain" },
			});
		});

		const result = await invokeCommand(DymoPrintService.HOST, DymoPrintService.START_PORT, "test");
		assertEquals(result, "test");

		await server.shutdown();
	},
});
