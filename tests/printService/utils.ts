import DymoPrintService from "@/printService/DymoPrintService.ts";
import { startHttpServer, stopHttpServer } from "../utils.ts";

type HttpHandler = Parameters<typeof startHttpServer>[2];

export const getPrintService = async (stopAfterInit: boolean = false, handler?: HttpHandler): Promise<DymoPrintService> => {
	await startHttpServer(DymoPrintService.HOST, DymoPrintService.START_PORT, handler);

	const printService = await DymoPrintService.initDymoPrintService();

	if (stopAfterInit) {
		await stopHttpServer();
	}

	return printService;
};
