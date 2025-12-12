import { assertEquals, assertThrows } from "@std/assert";
import createPrintParamsXml from "@/parameter/createPrintParamsXml.ts";
import {
	Alignment,
	CutMode,
	FlowDirection,
	PrinterType,
	PrintQuality,
	TwinTurboRoll,
} from "@/parameter/enums.ts";
import installXmlDomMocks from "./utils/installXmlDomMocks.ts";

Deno.test("createPrintParamsXml - throws on unsupported printer type", () => {
	assertThrows(
		() => createPrintParamsXml("Unsupported" as PrinterType.LabelWriter, {}),
		"Unsupported printer type: Unsupported",
	);
});

Deno.test("createPrintParamsXml - empty options", () => {
	const restore = installXmlDomMocks();

	const result = createPrintParamsXml(PrinterType.LabelWriter, {});
	assertEquals(result, "<LabelWriterPrintParams/>");

	restore();
});

Deno.test("createPrintParamsXml - basic options", () => {
	const restore = installXmlDomMocks();

	const options = {
		Copies: 1,
		JobTitle: "Test Job",
	};

	let result = createPrintParamsXml(PrinterType.LabelWriter, options);
	assertEquals(
		result,
		"<LabelWriterPrintParams><Copies>1</Copies><JobTitle>Test Job</JobTitle></LabelWriterPrintParams>",
	);

	result = createPrintParamsXml(PrinterType.TapePrinter, options);
	assertEquals(
		result,
		"<TapePrintParams><Copies>1</Copies><JobTitle>Test Job</JobTitle></TapePrintParams>",
	);

	result = createPrintParamsXml(PrinterType.DZPrinter, options);
	assertEquals(
		result,
		"<DZPrintParams><Copies>1</Copies><JobTitle>Test Job</JobTitle></DZPrintParams>",
	);

	restore();
});

Deno.test("createPrintParamsXml - all options", () => {
	const restore = installXmlDomMocks();

	let options: Record<string, unknown> = {
		Copies: 2,
		JobTitle: "Full Test",
		FlowDirection: FlowDirection.LeftToRight,
		PrintQuality: PrintQuality.Auto,
		TwinTurboRoll: TwinTurboRoll.Left,
	};

	let result = createPrintParamsXml(PrinterType.LabelWriter, options);
	assertEquals(
		result,
		"<LabelWriterPrintParams><Copies>2</Copies><JobTitle>Full Test</JobTitle><FlowDirection>LeftToRight</FlowDirection><PrintQuality>Auto</PrintQuality><TwinTurboRoll>Left</TwinTurboRoll></LabelWriterPrintParams>",
	);

	options = {
		Copies: 3,
		JobTitle: "Tape Full",
		FlowDirection: FlowDirection.RightToLeft,
		Alignment: Alignment.Center,
		CutMode: CutMode.AutoCut,
	};

	result = createPrintParamsXml(PrinterType.TapePrinter, options);
	assertEquals(
		result,
		"<TapePrintParams><Copies>3</Copies><JobTitle>Tape Full</JobTitle><FlowDirection>RightToLeft</FlowDirection><Alignment>Center</Alignment><CutMode>AutoCut</CutMode></TapePrintParams>",
	);

	result = createPrintParamsXml(PrinterType.DZPrinter, options);
	assertEquals(
		result,
		"<DZPrintParams><Copies>3</Copies><JobTitle>Tape Full</JobTitle><FlowDirection>RightToLeft</FlowDirection><Alignment>Center</Alignment><CutMode>AutoCut</CutMode></DZPrintParams>",
	);

	restore();
});
