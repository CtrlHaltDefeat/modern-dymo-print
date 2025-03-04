import { isLoggingEnabled } from "@/logging/enableLogging.ts";

export enum LogLevel {
	INFO,
	WARNING,
	ERROR,
}

export default function logMessage(title: string, error?: Error | string, logLevel: LogLevel = LogLevel.INFO): void {
	if (!isLoggingEnabled) return;

	let errorMessage = `DymoPrint\n${title}`;
	if (!errorMessage.endsWith(".")) errorMessage += ".";
	if (error) errorMessage += `\n${error}`;

	switch (logLevel) {
		case LogLevel.INFO:
			console.log(errorMessage);
			break;
		case LogLevel.WARNING:
			console.warn(errorMessage);
			break;
		case LogLevel.ERROR:
			console.error(errorMessage);
			break;
	}
}
