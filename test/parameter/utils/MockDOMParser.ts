import type { MockElement } from "./types.ts";

/**
 * Minimal mock of DOMParser for testing XML generation.\
 * Neither happy-dom nor deno-dom support XML parsing as of 12.2025.
 */
export default class MockDOMParser {
	parseFromString(xml: string, mime: string) {
		if (mime !== "text/xml" && mime !== "application/xml") {
			throw new Error(
				`MockDOMParser only supports XML mime types, got: ${mime}`,
			);
		}

		const m = xml.match(/<\s*([A-Za-z_:\-][\w.:\-]*)\b[^>]*(?:\/>|>)/);
		if (!m) {
			throw new Error(`MockDOMParser: cannot parse root element from: ${xml}`);
		}
		const rootTag = m[1];

		const root: MockElement = {
			tagName: rootTag,
			textContent: "",
			attrs: {},
			children: [],
			setAttribute(k: string, v: string) {
				this.attrs[k] = String(v);
			},
		};

		return {
			documentElement: {
				appendChild(child: MockElement) {
					root.children.push(child);
				},
			},
			createElement(tag: string): MockElement {
				return {
					tagName: tag,
					textContent: "",
					attrs: {},
					children: [],
					setAttribute(k: string, v: string) {
						this.attrs[k] = String(v);
					},
				};
			},
			__mockRoot: root,
		};
	}
}
