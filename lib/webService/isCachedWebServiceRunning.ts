import logMessage from "@/logging/logMessage";
import { pingEndpoint } from "@/webService/pingEndpoint";
import { getCachedService } from "../cache/getCachedService";

export default async function isCachedWebServiceRunning(): Promise<boolean> {
	const { serviceHost, servicePort } = getCachedService();

	if (serviceHost && servicePort) {
		try {
			await pingEndpoint(serviceHost, servicePort);
			return true;
		} catch (error) {
			logMessage("Cached web service is not running", error instanceof Error ? error : undefined);
		}
	}

	return false;
}
