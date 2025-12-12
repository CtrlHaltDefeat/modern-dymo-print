/**
 * Enumeration that specifies the direction in which objects and object text are laid out on the label. For Middle East labels/content specify "RightToLeft", otherwise specify "LeftToRight".
 * @see {@link https://github.com/dymosoftware/dymo-connect-framework/blob/master/doc/JavaScript/symbols/dymo.label.framework.html#.TapeCutMode|DYMO Label SDK Documentation - Print Parameters}
 */
export enum FlowDirection {
	LeftToRight = "LeftToRight",
	RightToLeft = "RightToLeft",
}

export enum Alignment {
	Left = "Left",
	Right = "Right",
	Center = "Center",
}

export enum CutMode {
	AutoCut = "AutoCut",
	ChainMarks = "ChainMarks",
}

export enum PrintQuality {
	Text = "Text",
	BarcodeAndGraphics = "BarcodeAndGraphics",
	Auto = "Auto",
}

export enum TwinTurboRoll {
	Left = "Left",
	Right = "Right",
	Auto = "Auto",
}

export enum PrinterType {
	LabelWriter = "LabelWriter",
	TapePrinter = "TapePrinter",
	DZPrinter = "DZPrinter",
}
