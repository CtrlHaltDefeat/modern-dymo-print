export type MockElement = {
	tagName: string;
	textContent: string;
	attrs: Record<string, string>;
	children: MockElement[];
	setAttribute: (k: string, v: string) => void;
};
