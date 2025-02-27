import { getCachedService } from "../cache/cachedService";
import { findWebService } from "./findWebService";
import { pingEndpoint } from "./pingEndpoint";

export default async function checkIsWebServiceRunning(): Promise<boolean> {
	const { serviceHost, servicePort } = getCachedService();

	if (serviceHost && servicePort) {
		return servicePort === (await pingEndpoint(serviceHost, servicePort));
	}

	try {
		await findWebService();
		return true;
	} catch (error) {
		// TODO: Logging
		return false;
	}
}
