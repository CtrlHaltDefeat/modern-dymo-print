import LabelWriter from "@/printers/LabelWriter";
import DymoPrintService from "@/printService/DymoPrintService";
import listen from "async-listen";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { testPrintersXml } from "./testData";

let server: Server | undefined;
let jobRunning: Promise<void>;
let jobResolver: () => void;

export const startHttpServer = async (
	hostname: string,
	port: number,
	handler?: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>
): Promise<void> => {
	await jobRunning;

	jobRunning = new Promise((resolve) => {
		jobResolver = resolve;
	});

	// @ts-ignore: Only for testing purposes
	DymoPrintService.PROTOCOL = "http://";

	server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Content-Type", "text/plain");

		await handler?.(req, res);

		res.end();
	});

	server.on("error", async () => {
		await stopHttpServer();
	});

	await listen(server, port, hostname);
};

export const stopHttpServer = async (): Promise<void> => {
	jobResolver?.();
	// @ts-ignore: Only for testing purposes
	DymoPrintService.PROTOCOL = "https://";

	return new Promise((resolve) => {
		server?.on("close", () => resolve());
		server?.close();
	});
};

export const getLabelWriter = () => {
	const printersXml = new DOMParser().parseFromString(testPrintersXml, "text/xml");
	const printerElement = printersXml.children[0];
	return new LabelWriter(printerElement.children[0]);
};
