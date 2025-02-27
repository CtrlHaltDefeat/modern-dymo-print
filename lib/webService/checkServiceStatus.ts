import { pingEndpoint } from "./pingEndpoint";

export default async function checkServiceStatus(serviceHost: string, servicePort: number) {
	return servicePort === (await pingEndpoint(serviceHost, servicePort));
}
