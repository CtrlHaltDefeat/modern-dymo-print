import { setCachedService } from "@/cache/setCachedService.ts";
import { DymoPrintService } from "@/index.ts";
import isCachedWebServiceRunning from "@/webService/isCachedWebServiceRunning.ts";
import { assertEquals } from "jsr:@std/assert";
import { startHttpServer } from "../utils.ts";

Deno.test("should return false if no service is saved", async () => {
	assertEquals(await isCachedWebServiceRunning(), false);
});

Deno.test("should return false if the service is not running", async () => {
	setCachedService(DymoPrintService.HOST, DymoPrintService.START_PORT);
	assertEquals(await isCachedWebServiceRunning(), false);
});

Deno.test({
	name: "should return true if the service is running",
	sanitizeResources: false,
	fn: async () => {
		setCachedService(DymoPrintService.HOST, DymoPrintService.START_PORT);
		const server = await startHttpServer(
			DymoPrintService.HOST,
			DymoPrintService.START_PORT,
			() => {
				return new Response("OK", { status: 200 });
			},
		);

		assertEquals(await isCachedWebServiceRunning(), true);

		await server.shutdown();
	},
});
