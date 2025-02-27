import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "lib/index.ts"),
			name: "dymo-print",
			fileName: "dymo-print",
			formats: ["es"],
		},
	},
	resolve: { alias: { "@": resolve(__dirname, "lib/") } },
	test: {
		workspace: [
			{
				extends: true,
				test: {
					environment: "happy-dom",
				},
			},
		],
	},
});
