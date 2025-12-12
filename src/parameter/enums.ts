/**
 * Emuneration that specifies the direction in which objects and object text are laid out on the label. For Middle East labels/content specify "RightToLeft", otherwise specify "LeftToRight" (default).
 * - LeftToRight - Indicates that the content flows from left to right.
 * - RightToLeft - Indicates that the content flows from right to left.
 */
export enum FlowDirection {
	/** Indicates that the content flows from left to right. */
	LeftToRight = "LeftToRight",
	/** Indicates that the content flows from right to left. */
	RightToLeft = "RightToLeft",
}

/**
 * Enumeration that specifies the leader and trailer for a tape label when printing to a Tape printer.
 * - Left - Indicates a 6mm leader and a 10mm trailer.
 * - Right - Indicates a 10mm leader and a 6mm trailer.
 * - Center - Indicates a 10mm leader and a 10mm trailer.
 */
export enum Alignment {
	/** Indicates a 6mm leader and a 10mm trailer. */
	Left = "Left",
	/** Indicates a 10mm leader and a 6mm trailer. */
	Right = "Right",
	/** Indicates a 10mm leader and a 10mm trailer. */
	Center = "Center",
}

/**
 * Enumeration that specifies the tape cut mode when printing multiple labels to a Tape printer. Note: This enumeration affects multiple page print jobs only. If a one page job is printed, the tape is always cut.
 * - AutoCut - Indicates to cut the tape between labels.
 * - ChainMarks - Indicates to print cut marks between labels.
 */
export enum CutMode {
	/** Indicates to cut the tape between labels. */
	AutoCut = "AutoCut",
	/** Indicates to print cut marks between labels. */
	ChainMarks = "ChainMarks",
}

/**
 * Enumeration that specifies the print quality when printing to a LabelWriter printer.
 * - Text - Indicates that text print quality (fast) is used.
 * - BarcodeAndGraphics - Indicates that barcode and images print quality (slow) is used.
 * - Auto - Indicates that the print quality is automatically determined based on the types of objects on the label.
 */
export enum PrintQuality {
	/** Indicates that text print quality (fast) is used. */
	Text = "Text",
	/** Indicates that barcode and images print quality (slow) is used. */
	BarcodeAndGraphics = "BarcodeAndGraphics",
	/** Indicates that the print quality is automatically determined based on the types of objects on the label.  */
	Auto = "Auto",
}

/**
 * Enumeration that specifies which roll to print to when printing to a Twin Turbo printer.
 * - Left - Indicates to print to the left roll only.
 * - Right - Indicates to print to the right roll only.
 * - Auto - Indicates to continue printing to the other roll when the current roll is out of paper. Note: This does not indicate which roll to print to first; printing may start on either roll.
 */
export enum TwinTurboRoll {
	/** Indicates to print to the left roll only. */
	Left = "Left",
	/** Indicates to print to the right roll only. */
	Right = "Right",
	/** Indicates to continue printing to the other roll when the current roll is out of paper. Note: This does not indicate which roll to print to first; printing may start on either roll. */
	Auto = "Auto",
}

/**
 * Enumeration that specifies the type of printer.
 * - LabelWriter - Indicates a LabelWriter printer.
 * - TapePrinter - Indicates a Tape printer.
 * - DZPrinter - Indicates a DZ printer.
 */
export enum PrinterType {
	/** Indicates a LabelWriter printer. */
	LabelWriter = "LabelWriter",
	/** Indicates a Tape printer. */
	TapePrinter = "TapePrinter",
	/** Indicates a DZ printer. */
	DZPrinter = "DZPrinter",
}
