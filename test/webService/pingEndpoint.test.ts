import { DymoPrintService } from "@/index.ts";
import { pingEndpoint } from "@/webService/pingEndpoint.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { startHttpServer } from "../utils.ts";

Deno.test({
	name: "should return service settings on successful ping",
	sanitizeResources: false,
	fn: async () => {
		const serviceHost = DymoPrintService.HOST;
		const servicePort = DymoPrintService.START_PORT;

		const server = await startHttpServer(serviceHost, servicePort, () => {
			return new Response("OK", { status: 200 });
		});

		try {
			assertEquals(await pingEndpoint(serviceHost, servicePort), { serviceHost, servicePort });
		} finally {
			await server.shutdown();
		}
	},
});

Deno.test("should throw an error on failed ping", async () => {
	await assertRejects(() => pingEndpoint(DymoPrintService.HOST, DymoPrintService.START_PORT), Error);
});
