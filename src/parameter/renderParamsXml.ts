import isObject from "@/parameter/isObject.ts";
import type { XmlElementInput } from "@/parameter/types.ts";
import serializeXml from "@/utils/serializeXml.ts";

export default function renderParamsXml(
	elementTag: string,
	xmlElements: XmlElementInput[],
): string {
	if (!elementTag || elementTag.trim() === "") {
		throw new Error("Element tag cannot be empty");
	}

	const doc = new DOMParser().parseFromString(`<${elementTag}/>`, "text/xml");

	if (Array.isArray(xmlElements) && xmlElements.length > 0) {
		xmlElements.forEach(({ tag: key, content, attributes }) => {
			if (!key || key.trim() === "") {
				throw new Error("Sub-Element tag cannot be empty");
			}

			const el = doc.createElement(key);
			el.textContent = content;

			if (isObject(attributes)) {
				Object.entries(attributes).forEach(([attrKey, attrValue]) => {
					el.setAttribute(attrKey, attrValue);
				});
			}

			doc.documentElement.appendChild(el);
		});
	}

	return serializeXml(doc);
}
