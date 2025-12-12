import MockDOMParser from "./MockDOMParser.ts";
import XMLSerializer from "./MockXMLSerializer.ts";

export default function installXmlDomMocks() {
	const originalDOMParser = globalThis.DOMParser;
	const originalXMLSerializer = globalThis.XMLSerializer;

	globalThis.DOMParser = MockDOMParser as unknown as typeof originalDOMParser;
	globalThis.XMLSerializer =
		XMLSerializer as unknown as typeof originalXMLSerializer;

	return () => {
		globalThis.DOMParser = originalDOMParser;
		globalThis.XMLSerializer = originalXMLSerializer;
	};
}
