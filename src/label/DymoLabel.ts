export default class DymoLabel {
	private readonly DOCUMENT: XMLDocument;

	constructor(labelXml: XMLDocument | string) {
		if (typeof labelXml === "string") {
			this.DOCUMENT = new DOMParser().parseFromString(labelXml, "text/xml");
		} else {
			this.DOCUMENT = labelXml;
		}
	}

	public get isValidLabel(): boolean {
		return this.isDCDLabel || this.isDLSLabel;
	}

	public get isDCDLabel(): boolean {
		return !!this.DOCUMENT.querySelectorAll("DYMOLabel");
	}

	public get isDLSLabel(): boolean {
		return !!this.DOCUMENT.querySelectorAll("Label") ||
			!!this.DOCUMENT.querySelectorAll("DieCutLabel");
	}

	public static fromString(labelXml: string): DymoLabel {
		const document = new DOMParser().parseFromString(labelXml, "text/xml");
		return new DymoLabel(document);
	}

	public toString(): string {
		let labelString = new XMLSerializer().serializeToString(this.DOCUMENT);
		labelString = labelString.replaceAll(
			/<Color (.+)\/>/g,
			"<Color $1> </Color>",
		);
		return new XMLSerializer().serializeToString(this.DOCUMENT);
	}
}
