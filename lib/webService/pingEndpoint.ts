import type { WebServiceSettings } from "@/cache/types";
import DymoPrintService from "@/printService/DymoPrintService";

export async function pingEndpoint(serviceHost: string, servicePort: number): Promise<Required<WebServiceSettings>> {
	const response = await fetch(
		`${DymoPrintService.PROTOCOL}${serviceHost}:${servicePort}/${DymoPrintService.SERVICE_PATH}/${DymoPrintService.COMMANDS.STATUS}`,
		{
			method: "GET",
		}
	);

	if (response.ok) return { serviceHost, servicePort };
	throw new Error(response.statusText);
}
