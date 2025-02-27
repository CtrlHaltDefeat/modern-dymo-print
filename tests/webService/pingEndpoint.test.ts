import { DymoPrintService } from "@/index";
import { pingEndpoint } from "@/webService/pingEndpoint";
import { describe, expect, test } from "vitest";
import { startHttpServer, stopHttpServer } from "../utils";

describe("pingEndpoint", () => {
	test("should return service settings on successful ping", async () => {
		const serviceHost = DymoPrintService.HOST;
		const servicePort = DymoPrintService.START_PORT;

		await startHttpServer(serviceHost, servicePort);

		expect(await pingEndpoint(serviceHost, servicePort)).toEqual({ serviceHost, servicePort });
		await stopHttpServer();
	});

	test("should throw an error on failed ping", async () => {
		await expect(pingEndpoint(DymoPrintService.HOST, DymoPrintService.START_PORT)).rejects.toThrow(Error);
	});
});
