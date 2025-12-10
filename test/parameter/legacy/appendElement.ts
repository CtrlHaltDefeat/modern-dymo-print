/**
 * Legacy function from dymo.xml.appendElement
 * @see https://github.com/dymosoftware/dymo-connect-framework/blob/43e069cb39b4fc96dcf6b6543b85bb88f1f6dee8/dymo.connect.framework.full.js#L33648
 */
export default function appendElement(
	parentElement: Element,
	tagName: string,
	text?: string,
	attributes?: Record<string, string>,
) {
	const result = parentElement.ownerDocument.createElement(tagName);

	if (text) {
		result.appendChild(parentElement.ownerDocument.createTextNode(text));
	}

	if (attributes) {
		for (const a in attributes) {
			result.setAttribute(a, attributes[a]);
		}
	}

	parentElement.appendChild(result);

	return result;
}
