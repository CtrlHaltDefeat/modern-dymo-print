import { setCachedService } from "@/cache/cachedService";
import { DymoPrinter } from "@/printers";
import {
	FAILED_TO_PRINT_LABEL_ERROR,
	FAILED_TO_RENDER_LABEL_ERROR,
	PARSE_PRINTERS_ERROR,
	PRINTER_NOT_CONNECTED_ERROR,
} from "@/printService/constants";
import DymoPrintService from "@/printService/DymoPrintService";
import { NO_WEB_SERVICE_FOUND_ERROR } from "@/webService/constants";
import { beforeEach, describe, expect, test } from "vitest";
import { testLabel, testLabelBase64, testPrintersXml } from "../testData";
import { getLabelWriter, startHttpServer, stopHttpServer } from "../utils";
import { getPrintService } from "./utils";

beforeEach(() => {
	setCachedService(DymoPrintService.HOST, DymoPrintService.START_PORT);
});

describe("initDymoPrintService", () => {
	test("initDymoPrintService should throw error if no web service is running", async () => {
		await expect(DymoPrintService.initDymoPrintService()).rejects.toThrow(NO_WEB_SERVICE_FOUND_ERROR);
	});

	test("initDymoPrintService should return new instance if web service is running", async () => {
		const printService = await getPrintService(true);

		expect(printService).toBeInstanceOf(DymoPrintService);
		// @ts-ignore: Private field, only for testing purposes
		expect(printService.webServiceHost).toBe(DymoPrintService.HOST);
		// @ts-ignore: Private field, only for testing purposes
		expect(printService.webServicePort).toBe(DymoPrintService.START_PORT);
	});
});

describe("parsePrintersXml", () => {
	test("parsePrintersXml should throw error if the XML is invalid", async () => {
		const printService = await getPrintService(true);

		// @ts-ignore: Private method, only for testing purposes
		expect(() => printService.parsePrintersXml("")).toThrow(PARSE_PRINTERS_ERROR);
		// @ts-ignore: Private method, only for testing purposes
		expect(() => printService.parsePrintersXml("<Printers><LabelWriterPrinter>")).toThrow(PARSE_PRINTERS_ERROR);
		// @ts-ignore: Private method, only for testing purposes
		expect(() => printService.parsePrintersXml("<AnythingElse></AnythingElse")).toThrow(PARSE_PRINTERS_ERROR);
	});

	test("parsePrintersXml should return a list of printers if the XML is valid", async () => {
		const printService = await getPrintService(true);

		// @ts-ignore: Private method, only for testing purposes
		const printers = printService.parsePrintersXml(testPrintersXml);
		expect(printers).toBeInstanceOf(Array);
		expect(printers).toHaveLength(1);
		expect(printers[0]).toBeInstanceOf(DymoPrinter);
	});
});

describe("getPrinters", () => {
	test("getPrinters should throw error if web service is not running", async () => {
		const printService = await getPrintService(true);

		await expect(printService.getPrinters()).rejects.toThrow();
	});

	test("getPrinters should return an empty list if the webservice is running and no printers are present", async () => {
		const printService = await getPrintService(false, (_request, response) => {
			response.setHeader("Content-Type", "text/plain");
			response.write("<Printers />");
		});

		const printers = await printService.getPrinters();
		expect(printers).toBeInstanceOf(Array);
		expect(printers).toHaveLength(0);
		await stopHttpServer();
	});

	test("getPrinters should return a list of printers if the webservice is running and printers are present", async () => {
		const printService = await getPrintService(false, (_request, response) => {
			response.setHeader("Content-Type", "text/plain");
			response.write(testPrintersXml);
		});

		const printers = await printService.getPrinters();
		expect(printers).toBeInstanceOf(Array);
		expect(printers).toHaveLength(1);
		expect(printers[0]).toBeInstanceOf(DymoPrinter);
		await stopHttpServer();
	});
});

describe("printLabel", async () => {
	const printer = getLabelWriter();

	test("printLabel should throw error if printer is not connected", async () => {
		const printService = await getPrintService(true);
		await expect(printService.printLabel(printer, "")).rejects.toThrow(PRINTER_NOT_CONNECTED_ERROR);
	});

	test("printLabel should throw error if web service is not running", async () => {
		const printService = await getPrintService(true);
		await expect(printService.printLabel(printer, "")).rejects.toThrow();
	});

	test("printLabel should throw an error if the label could not be printed", async () => {
		const printService = await getPrintService();

		// @ts-ignore: Private field, only for testing purposes
		printer.isConnected = true;

		await expect(printService.printLabel(printer, "")).rejects.toThrow(FAILED_TO_PRINT_LABEL_ERROR);

		await stopHttpServer();

		await startHttpServer(DymoPrintService.HOST, DymoPrintService.START_PORT, (_request, response) => {
			response.write("false");
		});

		await expect(printService.printLabel(printer, "")).rejects.toThrow(FAILED_TO_PRINT_LABEL_ERROR);

		await stopHttpServer();

		// @ts-ignore: Private field, only for testing purposes
		printer.isConnected = false;
	});

	test("printLabel should print the label if the printer is connected and the web service is running", async () => {
		const printService = await getPrintService(false, (_request, response) => {
			response.setHeader("Content-Type", "application/json");
			response.write("true");
		});

		// @ts-ignore: Private field, only for testing purposes
		printer.isConnected = true;

		await expect(printService.printLabel(printer, "")).resolves.toBeUndefined();

		await stopHttpServer();

		// @ts-ignore: Private field, only for testing purposes
		printer.isConnected = false;
	});
});

describe("renderLabel", () => {
	test("renderLabel should throw error if web service is not running", async () => {
		const printService = await getPrintService(true);
		await expect(printService.renderLabel("")).rejects.toThrow(FAILED_TO_RENDER_LABEL_ERROR);
	});

	test("renderLabel should return the base64 encoded label if the printer is connected and the web service is running", async () => {
		const printService = await getPrintService(false, (_request, response) => {
			response.setHeader("Content-Type", "text/plain");
			response.write(testLabelBase64);
		});

		await expect(printService.renderLabel(testLabel)).resolves.toBe(testLabelBase64);
		await stopHttpServer();
	});
});
