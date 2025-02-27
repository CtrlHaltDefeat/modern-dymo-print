import { setCachedService } from "@/cache/cachedService";
import { getCachedService } from "@/cache/getCachedService";
import { DymoPrintService } from "@/index";
import { NO_WEB_SERVICE_FOUND_ERROR } from "@/webService/constants";
import { findAllWebServices, findWebService } from "@/webService/findWebService";
import { describe, expect, it, test } from "vitest";
import { startHttpServer, stopHttpServer } from "../utils";

describe("findWebService", () => {
	it("should reject if no service is running", async () => {
		await expect(findAllWebServices()).rejects.toThrow();
		await expect(findWebService()).rejects.toThrow(NO_WEB_SERVICE_FOUND_ERROR);
	});

	test("should clear cache if no service is running", async () => {
		setCachedService(DymoPrintService.HOST, DymoPrintService.START_PORT);
		await expect(findWebService()).rejects.toThrow();
		expect(getCachedService()).toEqual({});
	});

	const hosts = [DymoPrintService.LEGACY_HOST, DymoPrintService.HOST];
	const portRange = Array.from({ length: DymoPrintService.END_PORT - DymoPrintService.START_PORT + 1 }, (_, i) => DymoPrintService.START_PORT + i);

	describe.sequential.each(hosts)("for host %s", (serviceHost) => {
		it.sequential.each(portRange)("should find service on port %i", async (servicePort) => {
			await startHttpServer(serviceHost, servicePort, (request, response) => {
				if (!request.headers.host?.includes(serviceHost)) {
					response.statusCode = 404;
					return;
				}
				response.statusCode = 200;
			});

			const expected = { serviceHost, servicePort };
			localStorage.clear();
			expect(await findAllWebServices()).toEqual(expected);
			expect(await findWebService()).toEqual(expected);
			expect(getCachedService()).toEqual(expected);
			await stopHttpServer();
			localStorage.clear();
		});
	});
});
