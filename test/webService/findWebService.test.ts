import { getCachedService } from "@/cache/getCachedService.ts";
import { setCachedService } from "@/cache/setCachedService.ts";
import { DymoPrintService } from "@/index.ts";
import { NO_WEB_SERVICE_FOUND_ERROR } from "@/webService/constants.ts";
import {
	findAllWebServices,
	findWebService,
} from "@/webService/findWebService.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { startHttpServer } from "../utils.ts";

Deno.test("findWebService - no service running", async () => {
	await assertRejects(() => findAllWebServices(), AggregateError);
	await assertRejects(
		() => findWebService(),
		Error,
		NO_WEB_SERVICE_FOUND_ERROR,
	);
});

Deno.test("findWebService - clear cache if no service running", async () => {
	setCachedService(DymoPrintService.HOST, DymoPrintService.START_PORT);
	await assertRejects(() => findWebService(), Error);
	assertEquals(getCachedService(), {
		serviceHost: undefined,
		servicePort: undefined,
	});
});

Deno.test({
	name: `findWebService - only find one service`,
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async (t) => {
		const hosts = [DymoPrintService.LEGACY_HOST, DymoPrintService.HOST];
		const portRange = Array.from({
			length: DymoPrintService.END_PORT - DymoPrintService.START_PORT + 1,
		}, (_, i) => DymoPrintService.START_PORT + i);

		for (const serviceHost of hosts) {
			for (const servicePort of portRange) {
				await t.step(
					`should find service on host ${serviceHost} port ${servicePort}`,
					async () => {
						const server = await startHttpServer(
							serviceHost,
							servicePort,
							(request, _info) => {
								if (!request.url.includes(serviceHost)) {
									return new Response("Not found", { status: 404 });
								}

								return new Response("OK", { status: 200 });
							},
						);

						const expected = { serviceHost, servicePort };
						localStorage.clear();
						assertEquals(await findAllWebServices(), expected);
						assertEquals(await findWebService(), expected);
						assertEquals(getCachedService(), expected);

						await server.shutdown();
					},
				);
			}
		}
	},
});
