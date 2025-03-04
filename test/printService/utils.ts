import DymoPrintService from "@/printService/DymoPrintService.ts";
import { startHttpServer } from "../utils.ts";

type HttpHandler = Parameters<typeof startHttpServer>[2];

async function getPrintService(
	stopAfterInit: true,
	handler?: HttpHandler,
): Promise<DymoPrintService>;
async function getPrintService(
	stopAfterInit: false,
	handler?: HttpHandler,
): Promise<[DymoPrintService, Deno.HttpServer]>;
async function getPrintService(
	stopAfterInit: boolean,
	handler?: HttpHandler,
): Promise<DymoPrintService | [DymoPrintService, Deno.HttpServer]> {
	const server = await startHttpServer(
		DymoPrintService.HOST,
		DymoPrintService.START_PORT,
		handler,
	);

	const printService = await DymoPrintService.initDymoPrintService();

	if (stopAfterInit) {
		await server.shutdown();
		return printService;
	}

	return [printService, server];
}

export { getPrintService };
