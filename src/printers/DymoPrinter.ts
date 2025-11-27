export default abstract class DymoPrinter {
	public abstract readonly printerType: string;

	public readonly isConnected: boolean;
	public readonly name: string;
	public readonly modelName?: string;
	public readonly isLocal: boolean;

	constructor(element: Element) {
		const name = element.querySelector("Name");
		if (!name) {
			throw new Error("No Name element found");
		}
		if (!name.textContent) {
			throw new Error("Name element is empty");
		}

		this.name = name.textContent;

		this.modelName = element.querySelector("ModelName")?.textContent ??
			undefined;
		this.isConnected =
			element.querySelector("IsConnected")?.textContent === "True";
		this.isLocal = element.querySelector("IsLocal")?.textContent === "True";
	}
}
