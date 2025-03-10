import DymoPrinter from "@/printers/DymoPrinter.ts";

export default class LabelWriter extends DymoPrinter {
	public printerType = "LabelWriter";
	public isTwinTurbo: boolean;

	constructor(element: Element) {
		super(element);

		this.isTwinTurbo =
			element.querySelector("IsTwinTurbo")?.textContent === "True";
	}
}
