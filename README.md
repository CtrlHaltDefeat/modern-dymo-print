# Modern DYMO Print

A modern TypeScript library for printing to DYMO label printers.

The [original library](https://github.com/dymosoftware/dymo-connect-framework)
has no TypeScript support and lacks proper error handling for many of its
functions. Furthermore, it uses callbacks instead of async/await and is really
heavy.

## Requirements

- DYMO Web Service must be installed and running on the client machine
- Compatible DYMO printer connected to the system
- Modern browser with JavaScript enabled

## Installation

```bash
# Deno
deno add jsr:@ctrlhaltdefeat/modern-dymo-print

# Node.js with npm
npx jsr add @ctrlhaltdefeat/modern-dymo-print

# Node.js with yarn
yarn add jsr:@ctrlhaltdefeat/modern-dymo-print

# Node.js with pnpm
pnpm i jsr:@ctrlhaltdefeat/modern-dymo-print
```

## Features

- Modern TypeScript implementation
- Full type safety and IntelliSense support
- No external dependencies
- Simple API for printing
  - Use either an already parsed XMLDocument or strings as labels

## Usage

### Basic Example

`DymoPrintService` has a static method `initDymoPrintService` that searches for
a running DYMO WebService with the following parameters:

| Parameter | Values               |
| --------- | -------------------- |
| Host      | localhost, 127.0.0.1 |
| Port      | 41951:41960          |

```typescript
import { DymoPrinter, DymoPrintService } from "@ctrlhaltdefeat/dymo-print";

// Init the print service
const printService = await DymoPrintService.initDymoPrintService();

// Get available printers
const printers: DymoPrinter[] = await printService.getPrinters();

// Print to the first available printer
if (printers.length > 0) {
	await printService.printLabel(printers[0], "YOUR LABEL HERE");
}
```

### Managing Printers

```typescript
import { DymoPrinter, DymoPrintService } from "@ctrlhaltdefeat/dymo-print";

// Init the print service
const printService = await DymoPrintService.initDymoPrintService();

// Get all available DYMO printers
const printers: DymoPrinter[] = await printService.getPrinters();

printers.foreach((printer) => {
	console.log(printer.isLocal);
	console.log(printer.isConnected);
	console.log(printer.modelName);
	console.log(printer.name);
	console.log(printer.printerType);
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
