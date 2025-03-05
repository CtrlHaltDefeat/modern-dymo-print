import { getCachedService } from "@/cache/getCachedService.ts";
import type { WebServiceSettings } from "@/cache/types.ts";
import DymoLabel from "@/label/DymoLabel.ts";
import { setLoggingState } from "@/logging/enableLogging.ts";
import logMessage, { LogLevel } from "@/logging/logMessage.ts";
import type DymoPrinter from "@/printers/DymoPrinter.ts";
import DZPrinter from "@/printers/DZPrinter.ts";
import LabelWriter from "@/printers/LabelWriter.ts";
import TapePrinter from "@/printers/TapePrinter.ts";
import {
	FAILED_TO_PRINT_LABEL_ERROR,
	FAILED_TO_RENDER_LABEL_ERROR,
	PARSE_PRINTERS_ERROR,
	PRINTER_NOT_CONNECTED_ERROR,
} from "@/printService/constants.ts";
import { findWebService } from "@/webService/findWebService.ts";
import invokeCommand, { HttpMethod } from "@/webService/invokeCommand.ts";
import isCachedWebServiceRunning from "@/webService/isCachedWebServiceRunning.ts";

export default class DymoPrintService {
	public static readonly PROTOCOL = "https://";
	public static readonly SERVICE_PATH = "DYMO/DLS/Printing";
	public static readonly START_PORT = 41951;
	public static readonly END_PORT = 41960;
	public static readonly LEGACY_HOST = "localhost";
	public static readonly HOST = "127.0.0.1";
	public static readonly COMMANDS = {
		STATUS: "StatusConnected",
		GET_PRINTERS: "GetPrinters",
		OPEN_LABEL: "OpenLabelFile",
		PRINT_LABEL: "PrintLabel",
		PRINT_LABEL2: "PrintLabel2",
		RENDER_LABEL: "RenderLabel",
		LOAD_IMAGE: "LoadImageAsPngBase64",
		GET_JOB_STATUS: "GetJobStatus",
		IS_550_PRINTER: "Is550Printer",
		GET_CONSUMABLE_INFO_IN_550_PRINTER: "GetConsumableInfoIn550Printer",
	};

	private readonly LABEL_WRITER_TAG = "LabelWriterPrinter";
	private readonly TAPE_PRINTER_TAG = "TapePrinter";
	private readonly DZ_PRINTER_TAG = "DZPrinter";

	private webServiceHost: string;
	private webServicePort: number;

	private constructor(webServiceHost: string, webServicePort: number) {
		this.webServiceHost = webServiceHost;
		this.webServicePort = webServicePort;
	}

	/**
	 * @param {DymoPrinter} printer - The printer to check the status of
	 * @throws {Error} If the printer is not connected
	 */
	private checkPrinterConnection(printer: DymoPrinter): void {
		if (!printer.isConnected) {
			logMessage(
				`Printer: ${printer.name} is not connected`,
				undefined,
				LogLevel.ERROR,
			);
			throw new Error(PRINTER_NOT_CONNECTED_ERROR);
		}
	}

	/**
	 * @param {string} printersXml - The XML string containing the printers
	 * @throws {Error} If the XML string is not valid
	 * @returns {DymoPrinter[]} A list of DymoPrinters
	 */
	private parsePrintersXml(printersXml: string): DymoPrinter[] {
		const printerDoc = new DOMParser().parseFromString(printersXml, "text/xml");

		if (
			!printerDoc ||
			printerDoc.children.length !== 1 ||
			printerDoc.children[0].tagName !== "Printers" ||
			// cSpell:disable-next-line
			[...printerDoc.children[0].children].some((element) =>
				element.tagName === "parsererror" || element.tagName === "PARSERERROR"
			)
		) {
			let logTitle = !printerDoc
				? PARSE_PRINTERS_ERROR
				: "Unexpected number of children in printers XML";
			logTitle += `\n${printersXml}`;
			logMessage(logTitle, undefined, LogLevel.ERROR);
			throw new Error(PARSE_PRINTERS_ERROR);
		}

		const printerElement = printerDoc.children[0];

		const printers: DymoPrinter[] = [];
		[...printerElement.children].forEach((element) => {
			switch (element.tagName) {
				case this.LABEL_WRITER_TAG:
					printers.push(new LabelWriter(element));
					break;
				case this.TAPE_PRINTER_TAG:
					printers.push(new TapePrinter(element));
					break;
				case this.DZ_PRINTER_TAG:
					printers.push(new DZPrinter(element));
			}
		});

		return printers;
	}

	private getLabelString(label: string | DymoLabel): string {
		return typeof label === "string"
			? DymoLabel.fromString(label).toString()
			: label.toString();
	}

	/**
	 * Checks if the web service is running and returns a new instance of DymoPrintService if it is.
	 * @static
	 * @async
	 * @param {boolean} isLoggingEnabled - Whether to enable logging to the console
	 * @throws {Error} - If no web service is found
	 * @returns {Promise<DymoPrintService>} A promise that resolves to a new instance of DymoPrintService
	 */
	public static async initDymoPrintService(
		isLoggingEnabled?: boolean,
	): Promise<DymoPrintService> {
		if (isLoggingEnabled) setLoggingState(isLoggingEnabled);

		let serviceHost: string | undefined = undefined;
		let servicePort: number | undefined = undefined;

		if (await isCachedWebServiceRunning()) {
			({ serviceHost, servicePort } = getCachedService() as Required<
				WebServiceSettings
			>);
		} else {
			({ serviceHost, servicePort } = await findWebService());
		}

		return new DymoPrintService(serviceHost, servicePort);
	}

	/**
	 * @async
	 * @throws {Error} If there is a problem with the web service connection
	 * @throws {Error} If there is a problem with parsing the printers XML
	 * @returns {Promise<DymoPrinter[]>} A promise that resolves to a list of DymoPrinters
	 */
	public async getPrinters(): Promise<DymoPrinter[]> {
		const printersXml = await invokeCommand(
			this.webServiceHost,
			this.webServicePort,
			DymoPrintService.COMMANDS.GET_PRINTERS,
		);

		if (typeof printersXml !== "string") {
			logMessage(
				"Failed to get printers XML. Return type was not a string",
				undefined,
				LogLevel.ERROR,
			);
			throw new Error("Failed to get printers XML");
		}

		return this.parsePrintersXml(printersXml);
	}

	/**
	 * @async
	 * @param printer {DymoPrinter} The printer to print to
	 * @param label {DymoLabel | string} The label to print
	 * @param printParamsXml {string} The print parameters
	 * @param labelSetXml {string} The label set
	 * @throws {Error} If the printer is not connected
	 * @throws {Error} If there was an error printing the label
	 */
	public async printLabel(
		printer: DymoPrinter,
		label: DymoLabel | string,
		printParamsXml?: string,
		labelSetXml?: string,
	): Promise<void> {
		this.checkPrinterConnection(printer);

		try {
			const response = await invokeCommand(
				this.webServiceHost,
				this.webServicePort,
				DymoPrintService.COMMANDS.PRINT_LABEL,
				HttpMethod.POST,
				{
					printerName: printer.name,
					labelXml: this.getLabelString(label),
					printParamsXml: printParamsXml ?? "",
					labelSetXml: labelSetXml ?? "",
				},
			);

			if (response === true) return;

			throw new Error(FAILED_TO_PRINT_LABEL_ERROR);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "";
			logMessage(FAILED_TO_PRINT_LABEL_ERROR, errorMessage, LogLevel.ERROR);
			throw new Error(FAILED_TO_PRINT_LABEL_ERROR);
		}
	}

	/**
	 * @async
	 * @param label {DymoLabel | string}
	 * @param renderParamsXml {string}
	 * @throws {Error} If there was an error rendering the label
	 * @returns {Promise<string>} A promise that resolves to the base64 encoded label
	 */
	public async renderLabel(
		label: DymoLabel | string,
		renderParamsXml?: string,
	): Promise<string> {
		try {
			const labelBase64 = await invokeCommand(
				this.webServiceHost,
				this.webServicePort,
				DymoPrintService.COMMANDS.RENDER_LABEL,
				HttpMethod.POST,
				{
					labelXml: this.getLabelString(label),
					renderParamsXml: renderParamsXml ?? "",
				},
			);

			if (typeof labelBase64 !== "string") {
				throw new Error(FAILED_TO_RENDER_LABEL_ERROR);
			}

			return labelBase64;
		} catch {
			logMessage(
				"Failed to render label. Return type was not a string",
				undefined,
				LogLevel.ERROR,
			);
			throw new Error(FAILED_TO_RENDER_LABEL_ERROR);
		}
	}
}
