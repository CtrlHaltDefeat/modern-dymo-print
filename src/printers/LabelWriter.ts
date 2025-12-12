import DymoPrinter from "@/printers/DymoPrinter.ts";

export default class LabelWriter extends DymoPrinter {
	public static override readonly PRINTER_PARAM_XML_TAG =
		"LabelWriterPrintParams";
	public static override readonly PRINTER_XML_TAG = "LabelWriterPrinter";

	public override readonly printerType = "LabelWriter";
	public readonly isTwinTurbo: boolean;

	constructor(element: Element) {
		super(element);

		this.isTwinTurbo =
			element.querySelector("IsTwinTurbo")?.textContent === "True";
	}
}
