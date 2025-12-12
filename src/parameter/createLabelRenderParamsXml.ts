import type {
	Color,
	RenderParameterOptions,
	XmlElementInput,
} from "@/parameter/types.ts";
import renderParamsXml from "@/parameter/renderParamsXml.ts";

function parseColor(color: Color): Record<string, string> {
	return {
		Alpha: (color.alpha ?? 255).toString(),
		Red: (color.red ?? 0).toString(),
		Green: (color.green ?? 0).toString(),
		Blue: (color.blue ?? 0).toString(),
	};
}

/**
 * Creates an XML string suitable for passing to `renderLabel` as the `renderParamsXml` argument.\
 * Only the options explicitly provided will be included in the resulting XML.
 *
 * @param {RenderParameterOptions} options
 * An object describing label render parameters. {@link RenderParameterOptions} for details on the available options.
 *
 * @returns {string} An XML string representing the label render parameters.
 */
export default function createLabelRenderParamsXml(
	options: RenderParameterOptions,
): string {
	const xmlElements: XmlElementInput[] = [];

	if (options.LabelColor) {
		const color = options.LabelColor;
		xmlElements.push({
			tag: "LabelColor",
			content: "",
			attributes: parseColor(color),
		});
	}

	if (options.ShadowColor) {
		const color = options.ShadowColor;
		xmlElements.push({
			tag: "ShadowColor",
			content: "",
			attributes: parseColor(color),
		});
	}

	if (options.ShadowDepth !== undefined) {
		xmlElements.push({
			tag: "ShadowDepth",
			content: options.ShadowDepth.toString(),
		});
	}

	if (options.FlowDirection) {
		xmlElements.push({
			tag: "FlowDirection",
			content: options.FlowDirection,
		});
	}

	if (options.PngUseDisplayResolution !== undefined) {
		xmlElements.push({
			tag: "PngUseDisplayResolution",
			content: options.PngUseDisplayResolution ? "True" : "False",
		});
	}

	return renderParamsXml("LabelRenderParams", xmlElements);
}
