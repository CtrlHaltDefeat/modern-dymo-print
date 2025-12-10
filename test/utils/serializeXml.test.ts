import { assertEquals } from "@std/assert";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import serializeXml from "@/utils/serializeXml.ts";

GlobalRegistrator.register();

Deno.test("serializeXml - basic XML serialization", () => {
	const doc = new DOMParser().parseFromString(
		"<root><element>content</element></root>",
		"text/xml",
	);
	const result = serializeXml(doc);
	assertEquals(result, "<root><element>content</element></root>");
});

Deno.test("serializeXml - XML with self-closing Color element", () => {
	const doc = new DOMParser().parseFromString(
		'<root><Color red="255"/></root>',
		"text/xml",
	);
	const result = serializeXml(doc);
	assertEquals(result, '<root><Color red="255"> </Color></root>');
});

Deno.test("serializeXml - XML with multiple self-closing Color elements", () => {
	const doc = new DOMParser().parseFromString(
		'<root><Color red="255"/><Color blue="0"/></root>',
		"text/xml",
	);
	const result = serializeXml(doc);
	assertEquals(
		result,
		'<root><Color red="255"/><Color blue="0"> </Color></root>',
	);
});

Deno.test("serializeXml - XML with Color element that has content", () => {
	const doc = new DOMParser().parseFromString(
		'<root><Color red="255">some content</Color></root>',
		"text/xml",
	);
	const result = serializeXml(doc);
	assertEquals(result, '<root><Color red="255">some content</Color></root>');
});

Deno.test("serializeXml - XML with declaration", () => {
	const doc = new DOMParser().parseFromString(
		'<?xml version="1.0"?><root/>',
		"text/xml",
	);
	const result = serializeXml(doc);
	assertEquals(result, '<?xml version="1.0"?><root/>');
});

Deno.test("serializeXml - empty document", () => {
	const doc = new DOMParser().parseFromString("<empty/>", "text/xml");
	const result = serializeXml(doc);
	assertEquals(result, "<empty/>");
});
