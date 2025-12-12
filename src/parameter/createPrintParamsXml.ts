import DZPrinter from "@/printers/DZPrinter.ts";
import LabelWriter from "@/printers/LabelWriter.ts";
import TapePrinter from "@/printers/TapePrinter.ts";
import type {
	DZPrinterPrintParameterOptions,
	LabelWriterPrintParameterOptions,
	TapePrinterPrintParameterOptions,
} from "@/parameter/types.ts";
import { PrinterType } from "@/parameter/enums.ts";
import renderParamsXml from "@/parameter/renderParamsXml.ts";

function createPrintParamsXml(
	type: PrinterType.LabelWriter,
	options: LabelWriterPrintParameterOptions,
): string;
function createPrintParamsXml(
	type: PrinterType.TapePrinter,
	options: TapePrinterPrintParameterOptions,
): string;
function createPrintParamsXml(
	type: PrinterType.DZPrinter,
	options: DZPrinterPrintParameterOptions,
): string;
function createPrintParamsXml(
	type: PrinterType,
	options: Record<string, string | number>,
): string {
	let elementTag: string;

	switch (type) {
		case PrinterType.LabelWriter:
			elementTag = LabelWriter.PRINTER_PARAM_XML_TAG;
			break;
		case PrinterType.TapePrinter:
			elementTag = TapePrinter.PRINTER_PARAM_XML_TAG;
			break;
		case PrinterType.DZPrinter:
			elementTag = DZPrinter.PRINTER_PARAM_XML_TAG;
			break;
		default:
			throw new Error(`Unsupported printer type: ${type}`);
	}

	const xmlElements = Object.entries(options).map(([tag, value]) => ({
		tag,
		content: value.toString(),
	}));

	return renderParamsXml(elementTag, xmlElements);
}

export default createPrintParamsXml;
