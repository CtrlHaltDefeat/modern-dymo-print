import type { MockElement } from "./types.ts";

/**
 * Minimal mock of XMLSerializer for testing XML generation.\
 * Neither happy-dom nor deno-dom support XML parsing as of 12.2025.
 */
export default class MockXMLSerializer {
	private escapeText(s: string): string {
		return s
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;");
	}

	private escapeAttr(s: string): string {
		return this.escapeText(s)
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&apos;");
	}

	private serializeEl(element: MockElement): string {
		const attrs = Object.entries(element.attrs)
			.map(([k, v]) => ` ${k}="${this.escapeAttr(String(v))}"`)
			.join("");

		if (element.children.length === 0 && !element.textContent) {
			return `<${element.tagName}${attrs}/>`;
		}

		const children = element.children.map((child) => this.serializeEl(child))
			.join(
				"",
			);

		const text = this.escapeText(String(element.textContent ?? ""));
		return `<${element.tagName}${attrs}>${text}${children}</${element.tagName}>`;
	}

	public serializeToString(
		document: HTMLElement & { __mockRoot?: MockElement },
	): string {
		const root: MockElement | undefined = document?.__mockRoot;

		if (!root) {
			throw new Error("MockXMLSerializer: cannot find mock root to serialize");
		}

		return this.serializeEl(root);
	}
}
