import DymoPrinter from "@/printers/DymoPrinter";

export default class DZPrinter extends DymoPrinter {
	public printerType = "DZPrinter";
	public isAutoCutSupported: boolean;

	constructor(element: Element) {
		super(element);

		this.isAutoCutSupported = element.querySelector("IsAutoCutSupported")?.textContent === "True";
	}
}
