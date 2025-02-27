import { setCachedService } from "@/cache/cachedService";
import DymoPrintService from "@/printService/DymoPrintService";
import isCachedWebServiceRunning from "@/webService/isCachedWebServiceRunning";
import { beforeEach, describe, expect, test } from "vitest";
import { startHttpServer, stopHttpServer } from "../utils";

describe("isCachedWebServiceRunning", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test("should return false if no service is saved", async () => {
		expect(await isCachedWebServiceRunning()).toBe(false);
	});

	test("should return false if the service is not running", async () => {
		setCachedService(DymoPrintService.HOST, DymoPrintService.START_PORT);
		expect(await isCachedWebServiceRunning()).toBe(false);
	});

	test("should return true if the service is running", async () => {
		setCachedService(DymoPrintService.HOST, DymoPrintService.START_PORT);
		await startHttpServer(DymoPrintService.HOST, DymoPrintService.START_PORT);

		expect(await isCachedWebServiceRunning()).toBe(true);
		await stopHttpServer();
	});
});
