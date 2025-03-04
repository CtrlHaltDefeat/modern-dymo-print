import DymoPrinter from "@/printers/DymoPrinter.ts";

export default class TapePrinter extends DymoPrinter {
	public printerType = "TapePrinter";
	public isAutoCutSupported: boolean;

	constructor(element: Element) {
		super(element);

		this.isAutoCutSupported = element.querySelector("IsAutoCutSupported")?.textContent === "True";
	}
}
