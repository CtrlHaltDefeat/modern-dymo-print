import { setCachedService } from "@/cache/setCachedService.ts";
import type { WebServiceSettings } from "@/cache/types.ts";
import logMessage, { LogLevel } from "@/logging/logMessage.ts";
import DymoPrintService from "@/printService/DymoPrintService.ts";
import { NO_WEB_SERVICE_FOUND_ERROR } from "@/webService/constants.ts";
import { pingEndpoint } from "@/webService/pingEndpoint.ts";

export async function findWebService(): Promise<Required<WebServiceSettings>> {
	let serviceHost: string | undefined = undefined;
	let servicePort: number | undefined = undefined;

	try {
		({ serviceHost, servicePort } = await findAllWebServices());
		setCachedService(serviceHost, servicePort);
	} catch (error) {
		logMessage(
			NO_WEB_SERVICE_FOUND_ERROR,
			error instanceof Error ? error : undefined,
			LogLevel.ERROR,
		);
		setCachedService();
		throw new Error(NO_WEB_SERVICE_FOUND_ERROR);
	}

	return { serviceHost, servicePort };
}

export async function findAllWebServices(): Promise<
	Required<WebServiceSettings>
> {
	const endPoints = [];

	for (
		const serviceHost of [DymoPrintService.HOST, DymoPrintService.LEGACY_HOST]
	) {
		for (
			let servicePort = DymoPrintService.START_PORT;
			servicePort <= DymoPrintService.END_PORT;
			++servicePort
		) {
			try {
				endPoints.push(pingEndpoint(serviceHost, servicePort));
			} catch (error) {
				logMessage(
					`Web service ${serviceHost}:${servicePort} is not running`,
					error instanceof Error ? error : undefined,
					LogLevel.ERROR,
				);
			}
		}
	}

	return await Promise.any(endPoints);
}
