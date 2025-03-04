import { serve } from "esbuild_serve";

serve({
	port: 8100,
	pages: {
		index: "main.ts",
	},
});
