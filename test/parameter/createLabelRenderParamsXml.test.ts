import { assertEquals } from "@std/assert";
import createLabelRenderParamsXml from "@/parameter/createLabelRenderParamsXml.ts";
import type { RenderParameterOptions } from "@/parameter/types.ts";
import { FlowDirection } from "@/parameter/enums.ts";
import installXmlDomMocks from "./utils/installXmlDomMocks.ts";

Deno.test("createLabelRenderParamsXml - empty options", () => {
	const restore = installXmlDomMocks();

	const result = createLabelRenderParamsXml({});
	assertEquals(result, "<LabelRenderParams/>");

	restore();
});

Deno.test("createLabelRenderParamsXml - with LabelColor", () => {
	const restore = installXmlDomMocks();

	const options: RenderParameterOptions = {
		LabelColor: { red: 255, green: 0, blue: 0 },
	};
	const result = createLabelRenderParamsXml(options);
	assertEquals(
		result,
		'<LabelRenderParams><LabelColor Alpha="255" Red="255" Green="0" Blue="0"/></LabelRenderParams>',
	);

	restore();
});

Deno.test("createLabelRenderParamsXml - with LabelColor and alpha", () => {
	const restore = installXmlDomMocks();

	const options: RenderParameterOptions = {
		LabelColor: { red: 100, green: 150, blue: 200, alpha: 128 },
	};
	const result = createLabelRenderParamsXml(options);
	assertEquals(
		result,
		'<LabelRenderParams><LabelColor Alpha="128" Red="100" Green="150" Blue="200"/></LabelRenderParams>',
	);

	restore();
});

Deno.test("createLabelRenderParamsXml - with ShadowColor", () => {
	const restore = installXmlDomMocks();

	const options: RenderParameterOptions = {
		ShadowColor: { red: 0, green: 0, blue: 0 },
	};
	const result = createLabelRenderParamsXml(options);
	assertEquals(
		result,
		'<LabelRenderParams><ShadowColor Alpha="255" Red="0" Green="0" Blue="0"/></LabelRenderParams>',
	);

	restore();
});

Deno.test("createLabelRenderParamsXml - with ShadowDepth", () => {
	const restore = installXmlDomMocks();

	const options: RenderParameterOptions = {
		ShadowDepth: 5,
	};
	const result = createLabelRenderParamsXml(options);
	assertEquals(
		result,
		"<LabelRenderParams><ShadowDepth>5</ShadowDepth></LabelRenderParams>",
	);

	restore();
});

Deno.test("createLabelRenderParamsXml - with FlowDirection", () => {
	const restore = installXmlDomMocks();

	const options: RenderParameterOptions = {
		FlowDirection: FlowDirection.LeftToRight,
	};
	const result = createLabelRenderParamsXml(options);
	assertEquals(
		result,
		"<LabelRenderParams><FlowDirection>LeftToRight</FlowDirection></LabelRenderParams>",
	);

	restore();
});

Deno.test("createLabelRenderParamsXml - with PngUseDisplayResolution true", () => {
	const restore = installXmlDomMocks();

	const options: RenderParameterOptions = {
		PngUseDisplayResolution: true,
	};
	const result = createLabelRenderParamsXml(options);
	assertEquals(
		result,
		"<LabelRenderParams><PngUseDisplayResolution>True</PngUseDisplayResolution></LabelRenderParams>",
	);

	restore();
});

Deno.test("createLabelRenderParamsXml - with PngUseDisplayResolution false", () => {
	const restore = installXmlDomMocks();

	const options: RenderParameterOptions = {
		PngUseDisplayResolution: false,
	};
	const result = createLabelRenderParamsXml(options);
	assertEquals(
		result,
		"<LabelRenderParams><PngUseDisplayResolution>False</PngUseDisplayResolution></LabelRenderParams>",
	);

	restore();
});

Deno.test("createLabelRenderParamsXml - with all options", () => {
	const restore = installXmlDomMocks();

	const options: RenderParameterOptions = {
		LabelColor: { red: 255, green: 255, blue: 255, alpha: 255 },
		ShadowColor: { red: 128, green: 128, blue: 128, alpha: 200 },
		ShadowDepth: 10,
		FlowDirection: FlowDirection.RightToLeft,
		PngUseDisplayResolution: true,
	};
	const result = createLabelRenderParamsXml(options);
	assertEquals(
		result,
		'<LabelRenderParams><LabelColor Alpha="255" Red="255" Green="255" Blue="255"/><ShadowColor Alpha="200" Red="128" Green="128" Blue="128"/><ShadowDepth>10</ShadowDepth><FlowDirection>RightToLeft</FlowDirection><PngUseDisplayResolution>True</PngUseDisplayResolution></LabelRenderParams>',
	);

	restore();
});
