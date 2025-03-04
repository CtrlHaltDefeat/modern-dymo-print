import LabelWriter from "@/printers/LabelWriter.ts";
import DymoPrintService from "@/printService/DymoPrintService.ts";
import { testPrintersXml } from "./testData.ts";

const servers = new Map<string, Promise<void>>();

export const startHttpServer = async (hostname: string, port: number, handler?: Deno.ServeHandler): Promise<Deno.HttpServer> => {
	const serverName = `${hostname}:${port}`;
	await servers.get(serverName);

	let jobResolver: () => void;

	servers.set(
		serverName,
		new Promise((resolve) => {
			jobResolver = resolve;
		})
	);

	// @ts-ignore: Only for testing purposes
	DymoPrintService.PROTOCOL = "http://";

	const controller = new AbortController();

	const server = Deno.serve({ hostname, port, signal: controller.signal, onListen: () => undefined }, async (req, info) => {
		const headers = new Headers({
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "text/plain",
		});

		if (handler) {
			return await handler(req, info);
		}

		return new Response("asdf", { headers });
	});

	server.finished.then(() => {
		jobResolver();
		// @ts-ignore: Only for testing purposes
		DymoPrintService.PROTOCOL = "https://";
	});

	return server;
};

export const getLabelWriter = (connected: boolean): LabelWriter => {
	const printersXml = new DOMParser().parseFromString(testPrintersXml, "text/xml");
	const printerElement = printersXml.children[0];
	const printer = new LabelWriter(printerElement.children[0]);

	// @ts-ignore: Only for testing purposes
	printer.isConnected = connected;

	return printer;
};
