import DymoPrinter from "@/printers/DymoPrinter.ts";

export default class DZPrinter extends DymoPrinter {
	public static override readonly PRINTER_XML_TAG = "DZPrinter";

	public override readonly printerType = "DZPrinter";
	public readonly isAutoCutSupported: boolean;

	constructor(element: Element) {
		super(element);

		this.isAutoCutSupported =
			element.querySelector("IsAutoCutSupported")?.textContent === "True";
	}
}
