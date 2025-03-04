import logMessage, { LogLevel } from "@/logging/logMessage.ts";
import DymoPrintService from "@/printService/DymoPrintService.ts";
import { COMMAND_ERROR, MISSING_CONTENT_TYPE_ERROR } from "@/webService/constants.ts";

export enum HttpMethod {
	GET = "GET",
	POST = "POST",
}

export default async function invokeCommand(
	serviceHost: string,
	servicePort: number,
	endpoint: string,
	method = HttpMethod.GET,
	formData?: Record<string, string>
): Promise<unknown> {
	const url = `${DymoPrintService.PROTOCOL}${serviceHost}:${servicePort}/${DymoPrintService.SERVICE_PATH}/${endpoint}`;

	if (formData)
		Object.keys(formData || {}).forEach((key) => {
			formData[key] = formData[key] ?? "";
		});

	const body = formData ? new URLSearchParams(formData) : undefined;

	try {
		const response = await fetch(url, { method, body });
		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const contentType = response.headers.get("content-type");

		if (!contentType) {
			throw new Error(MISSING_CONTENT_TYPE_ERROR);
		}

		if (contentType.includes("application/json")) {
			return await response.json();
		}

		return await response.text();
	} catch (error) {
		logMessage(`${COMMAND_ERROR}: ${endpoint}`, error instanceof Error ? error : undefined, LogLevel.ERROR);

		const errorMessage = error instanceof Error ? error.message : error;
		throw new Error(`${COMMAND_ERROR}: ${endpoint}. Error: ${errorMessage}`);
	}
}
