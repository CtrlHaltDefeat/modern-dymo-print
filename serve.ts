import { serve } from "https://deno.land/x/esbuild_serve@1.5.0/mod.ts";

serve({
	port: 8100,
	pages: {
		index: "main.ts",
	},
});
