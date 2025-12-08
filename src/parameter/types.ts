import type {
	Alignment,
	CutMode,
	FlowDirection,
	PrintQuality,
	TwinTurboRoll,
} from "@/parameter/enums.ts";

type DymoPrinterPrintParameterOptions = {
	Copies?: number;
	JobTitle?: string;
	FlowDirection?: FlowDirection;
};

export type TapePrinterPrintParameterOptions =
	& DymoPrinterPrintParameterOptions
	& {
		Alignment?: Alignment;
		CutMode?: CutMode;
	};

export type DZPrinterPrintParameterOptions =
	& DymoPrinterPrintParameterOptions
	& {
		Alignment?: Alignment;
		CutMode?: CutMode;
	};

export type LabelWriterPrintParameterOptions =
	& DymoPrinterPrintParameterOptions
	& {
		PrintQuality?: PrintQuality;
		TwinTurboRoll?: TwinTurboRoll;
	};

export type Color = {
	red: number;
	green: number;
	blue: number;
	alpha?: number;
};

export type RenderParameterOptions = {
	LabelColor?: Color;
	ShadowColor?: Color;
	ShadowDepth?: number;
	FlowDirection?: FlowDirection;
	PngUseDisplayResolution?: boolean;
};

export type XmlElementInput = {
	tag: string;
	content: string;
	attributes?: Record<string, string>;
};
