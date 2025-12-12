import { assertEquals, assertThrows } from "@std/assert";
import renderParamsXml from "@/parameter/renderParamsXml.ts";
import type { XmlElementInput } from "@/parameter/types.ts";
import MockDOMParser from "./utils/MockDOMParser.ts";
import XMLSerializer from "./utils/MockXMLSerializer.ts";

function installXmlDomMocks() {
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

Deno.test("renderParamsXml - throws on empty root element", () => {
	assertThrows(() => renderParamsXml("", []), "Element tag cannot be empty");
	assertThrows(
		() => renderParamsXml("   ", []),
		"Element tag cannot be empty",
	);
	assertThrows(
		() => renderParamsXml(undefined as unknown as string, []),
		"Element tag cannot be empty",
	);
});

Deno.test("renderParamsXml - empty xmlElements", () => {
	const restore = installXmlDomMocks();

	const result = renderParamsXml("TestElement", []);
	assertEquals(result, "<TestElement/>");

	restore();
});

Deno.test("renderParamsXml - null xmlElements", () => {
	const restore = installXmlDomMocks();

	const result = renderParamsXml(
		"TestElement",
		null as unknown as XmlElementInput[],
	);
	assertEquals(result, "<TestElement/>");

	const result2 = renderParamsXml(
		"TestElement",
		undefined as unknown as XmlElementInput[],
	);
	assertEquals(result2, "<TestElement/>");

	restore();
});

Deno.test("renderParamsXml - throws on empty sub-element tag", () => {
	assertThrows(
		() => renderParamsXml("Root", [{ tag: "", content: "value" }]),
		"Sub-Element tag cannot be empty",
	);
});

Deno.test("renderParamsXml - with single element without content or attributes", () => {
	const restore = installXmlDomMocks();

	const xmlElements: XmlElementInput[] = [
		{ tag: "Item", content: "" },
	];
	const result = renderParamsXml("Root", xmlElements);
	assertEquals(
		result,
		"<Root><Item/></Root>",
	);

	restore();
});

Deno.test("renderParamsXml - with single element without attributes", () => {
	const restore = installXmlDomMocks();

	const xmlElements: XmlElementInput[] = [
		{ tag: "Item", content: "value" },
	];
	const result = renderParamsXml("Root", xmlElements);
	assertEquals(
		result,
		"<Root><Item>value</Item></Root>",
	);

	restore();
});

Deno.test("renderParamsXml - with single element with attributes", () => {
	const restore = installXmlDomMocks();

	const xmlElements: XmlElementInput[] = [
		{
			tag: "Item",
			content: "value",
			attributes: { attr1: "val1", attr2: "val2" },
		},
	];
	const result = renderParamsXml("Root", xmlElements);
	assertEquals(
		result,
		'<Root><Item attr1="val1" attr2="val2">value</Item></Root>',
	);

	restore();
});

Deno.test("renderParamsXml - with multiple elements", () => {
	const restore = installXmlDomMocks();

	const xmlElements: XmlElementInput[] = [
		{ tag: "Item1", content: "value1" },
		{ tag: "Item2", content: "value2", attributes: { id: "2" } },
	];

	const result = renderParamsXml("Root", xmlElements);
	assertEquals(
		result,
		'<Root><Item1>value1</Item1><Item2 id="2">value2</Item2></Root>',
	);

	restore();
});

Deno.test("renderParamsXml - with content as number", () => {
	const restore = installXmlDomMocks();

	const xmlElements: XmlElementInput[] = [
		{ tag: "Number", content: "42" },
	];
	const result = renderParamsXml("Root", xmlElements);
	assertEquals(
		result,
		"<Root><Number>42</Number></Root>",
	);

	restore();
});
