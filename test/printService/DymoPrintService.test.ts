import { LOCAL_STORAGE_KEY } from "@/cache/constants.ts";
import { removeLocalStorage } from "@/cache/localStorage.ts";
import { setCachedService } from "@/cache/setCachedService.ts";
import { DymoPrinter } from "@/printers/index.ts";
import {
	FAILED_TO_PRINT_LABEL_ERROR,
	FAILED_TO_RENDER_LABEL_ERROR,
	PARSE_PRINTERS_ERROR,
	PRINTER_NOT_CONNECTED_ERROR,
} from "@/printService/constants.ts";
import DymoPrintService from "@/printService/DymoPrintService.ts";
import { NO_WEB_SERVICE_FOUND_ERROR } from "@/webService/constants.ts";
import {
	assert,
	assertEquals,
	assertInstanceOf,
	assertRejects,
	assertThrows,
} from "jsr:@std/assert";
import { Window } from "npm:happy-dom";
import { testLabel, testLabelBase64, testPrintersXml } from "../testData.ts";
import { getLabelWriter, startHttpServer } from "../utils.ts";
import { getPrintService } from "./utils.ts";

let window: Window;

function setupTest() {
	window = new Window();
	globalThis.DOMParser = window.DOMParser as unknown as typeof DOMParser;
	globalThis.XMLSerializer = window
		.XMLSerializer as unknown as typeof XMLSerializer;

	setCachedService(DymoPrintService.HOST, DymoPrintService.START_PORT);
}

async function tearDownTest(server?: Deno.HttpServer) {
	await server?.shutdown();
	await window.happyDOM.close();
	removeLocalStorage(LOCAL_STORAGE_KEY);
}

Deno.test("initDymoPrintService - should throw when no web service running", async () => {
	setupTest();
	try {
		await assertRejects(
			() => DymoPrintService.initDymoPrintService(),
			Error,
			NO_WEB_SERVICE_FOUND_ERROR,
		);
	} finally {
		await tearDownTest();
	}
});

Deno.test({
	name: "initDymoPrintService - should create instance when service running",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();
		try {
			const printService = await getPrintService(true);

			assert(printService instanceof DymoPrintService);
			assertEquals(printService["webServiceHost"], DymoPrintService.HOST);
			assertEquals(printService["webServicePort"], DymoPrintService.START_PORT);
		} finally {
			await tearDownTest();
		}
	},
});

Deno.test({
	name: "parsePrintersXml - should handle invalid XML",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();
		try {
			const printService = await getPrintService(true);

			assertThrows(
				() => printService["parsePrintersXml"](""),
				Error,
				PARSE_PRINTERS_ERROR,
			);
			assertThrows(
				() =>
					printService["parsePrintersXml"]("<Printers><LabelWriterPrinter>"),
				Error,
				PARSE_PRINTERS_ERROR,
			);
		} finally {
			await tearDownTest();
		}
	},
});

Deno.test({
	name: "parsePrintersXml - should parse valid XML",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();
		try {
			const printService = await getPrintService(true);
			const printers = printService["parsePrintersXml"](testPrintersXml);

			assertInstanceOf(printers, Array);
			assertEquals(printers.length, 1);
			assertInstanceOf(printers[0], DymoPrinter);
			assertEquals(printers[0].name, "DYMO LabelWriter 550");
			assertEquals(printers[0].modelName, "DYMO LabelWriter 550");
			assertEquals(printers[0].isConnected, false);
			assertEquals(printers[0].isLocal, true);
		} finally {
			await tearDownTest();
		}
	},
});

Deno.test({
	name: "getPrinters - should throw error if web service is not running",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();
		try {
			const printService = await getPrintService(true);

			await assertRejects(() => printService.getPrinters(), Error);
		} finally {
			await tearDownTest();
		}
	},
});

Deno.test({
	name:
		"getPrinters - should return an empty list when no printers are available",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();

		let printService: DymoPrintService, server;

		try {
			[printService, server] = await getPrintService(false, () => {
				const response = new Response("<Printers />", {
					headers: { "Content-Type": "text/plain" },
				});

				return response;
			});

			const printers = await printService.getPrinters();

			assertInstanceOf(printers, Array);
			assertEquals(printers.length, 0);
		} finally {
			await tearDownTest(server);
		}
	},
});

Deno.test({
	name: "getPrinters - should return printer list when available",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();

		let printService: DymoPrintService, server;

		try {
			[printService, server] = await getPrintService(false, () => {
				return new Response(testPrintersXml, {
					headers: { "Content-Type": "text/plain" },
				});
			});

			const printers = await printService.getPrinters();

			assertInstanceOf(printers, Array);
			assertEquals(printers.length, 1);
			assertInstanceOf(printers[0], DymoPrinter);
		} finally {
			await tearDownTest(server);
		}
	},
});

Deno.test({
	name: "printLabel - should handle printer not connected",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();
		try {
			const printer = getLabelWriter(false);
			const printService = await getPrintService(true);

			await assertRejects(
				() => printService.printLabel(printer, ""),
				Error,
				PRINTER_NOT_CONNECTED_ERROR,
			);
		} finally {
			await tearDownTest();
		}
	},
});

Deno.test({
	name: "printLabel - should throw error if web service is not running",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();
		try {
			const printer = getLabelWriter(true);
			const printService = await getPrintService(true);

			await assertRejects(
				() => printService.printLabel(printer, ""),
				Error,
				FAILED_TO_PRINT_LABEL_ERROR,
			);
		} finally {
			await tearDownTest();
		}
	},
});

Deno.test({
	name: "printLabel - should throw an error if the label could not be printed",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();

		let printService: DymoPrintService, server;

		try {
			const printer = getLabelWriter(true);
			[printService, server] = await getPrintService(false);

			await assertRejects(
				() => printService.printLabel(printer, ""),
				Error,
				FAILED_TO_PRINT_LABEL_ERROR,
			);

			await server.shutdown();

			server = await startHttpServer(
				DymoPrintService.HOST,
				DymoPrintService.START_PORT,
				() => {
					return new Response("false", {
						headers: { "Content-Type": "application/json" },
					});
				},
			);

			await assertRejects(
				() => printService.printLabel(printer, ""),
				Error,
				FAILED_TO_PRINT_LABEL_ERROR,
			);
		} finally {
			await tearDownTest(server);
		}
	},
});

Deno.test({
	name:
		"printLabel - should print the label if the printer is connected and the web service is running",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();

		let printService: DymoPrintService, server;

		try {
			const printer = getLabelWriter(true);
			[printService, server] = await getPrintService(false, () => {
				return new Response("true", {
					headers: { "Content-Type": "application/json" },
				});
			});

			await printService.printLabel(printer, "");
		} finally {
			await tearDownTest(server);
		}
	},
});

Deno.test({
	name: "renderLabel - should handle web service not running",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();
		try {
			const printService = await getPrintService(true);

			await assertRejects(
				() => printService.renderLabel(""),
				Error,
				FAILED_TO_RENDER_LABEL_ERROR,
			);
		} finally {
			await tearDownTest();
		}
	},
});

Deno.test({
	name: "renderLabel - should return base64",
	sanitizeResources: false,
	sanitizeOps: false,
	fn: async () => {
		setupTest();

		let printService: DymoPrintService, server;

		try {
			[printService, server] = await getPrintService(false, () => {
				return new Response(testLabelBase64, {
					headers: { "Content-Type": "text/plain" },
				});
			});

			const result = await printService.renderLabel(testLabel);
			assertEquals(result, testLabelBase64);
		} finally {
			await tearDownTest(server);
		}
	},
});
