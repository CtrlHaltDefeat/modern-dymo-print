import { assertEquals, assertThrows } from "@std/assert";
import renderParamsXml from "@/parameter/renderParamsXml.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import type { XmlElementInput } from "@/parameter/types.ts";
import appendElement from "./appendElement.ts";

GlobalRegistrator.register();

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
	const result = renderParamsXml("TestElement", []);
	assertEquals(result, "<TestElement/>");
});

Deno.test("renderParamsXml - null xmlElements", () => {
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
});

Deno.test("renderParamsXml - throws on empty sub-element tag", () => {
	assertThrows(
		() => renderParamsXml("Root", [{ tag: "", content: "value" }]),
		"Sub-Element tag cannot be empty",
	);
});

Deno.test("renderParamsXml - with single element without attributes", () => {
	const xmlElements: XmlElementInput[] = [
		{ tag: "Item", content: "value" },
	];
	const result = renderParamsXml("Root", xmlElements);
	assertEquals(
		result,
		'<Root><item xmlns="http://www.w3.org/1999/xhtml">value</item></Root>',
	);
});

Deno.test("renderParamsXml - with single element with attributes", () => {
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
		'<Root><item xmlns="http://www.w3.org/1999/xhtml" attr1="val1" attr2="val2">value</item></Root>',
	);
});

Deno.test("renderParamsXml - with multiple elements", () => {
	const xmlElements: XmlElementInput[] = [
		{ tag: "Item1", content: "value1" },
		{ tag: "Item2", content: "value2", attributes: { id: "2" } },
	];
	const result = renderParamsXml("Root", xmlElements);
	assertEquals(
		result,
		'<Root><item1 xmlns="http://www.w3.org/1999/xhtml">value1</item1><item2 xmlns="http://www.w3.org/1999/xhtml" id="2">value2</item2></Root>',
	);
});

Deno.test("renderParamsXml - with content as number", () => {
	const xmlElements: XmlElementInput[] = [
		{ tag: "Number", content: "42" },
	];
	const result = renderParamsXml("Root", xmlElements);
	assertEquals(
		result,
		'<Root><number xmlns="http://www.w3.org/1999/xhtml">42</number></Root>',
	);
});

function legacyRenderParamsXmlWithDymo(
	elementTag: string,
	xmlElements: XmlElementInput[],
): string {
	const doc = new DOMParser().parseFromString(`<${elementTag}/>`, "text/xml");
	const root = doc.documentElement;

	xmlElements.forEach(({ tag, content, attributes }) =>
		appendElement(
			root,
			tag,
			content?.toString() ?? undefined,
			attributes as Record<string, string> | undefined,
		)
	);

	return new XMLSerializer().serializeToString(root);
}

Deno.test("renderParamsXml - matches legacy dymo.xml.appendElement output", () => {
	const cases: XmlElementInput[][] = [
		[],
		[{ tag: "Item", content: "value" }],
		[
			{ tag: "Item1", content: "value1" },
			{ tag: "Item2", content: "value2", attributes: { id: "2" } },
		],
		[
			{ tag: "Number", content: 42 as unknown as string },
			{ tag: "Empty", content: "" as unknown as string },
		],
		[
			{ tag: "WithAttrs", content: "x", attributes: { a: "1", b: "2" } },
			{ tag: "NoAttrs", content: "y" },
		],
	];

	for (const xmlElements of cases) {
		const expected = legacyRenderParamsXmlWithDymo("Root", xmlElements);
		const actual = renderParamsXml("Root", xmlElements);
		assertEquals(actual, expected);
	}
});
