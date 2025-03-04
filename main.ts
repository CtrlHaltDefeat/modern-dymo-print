import { DymoPrintService } from "@/index.ts";
import { testLabel } from "./test/testData.ts";

const printService = await DymoPrintService.initDymoPrintService(true);

// If a printer is available, the next line automatically prints the label
// const printers = await printService.getPrinters();
// printService.printLabel(printers[0], testLabel.trim());

const labelImage = await printService.renderLabel(testLabel.trim());
const image = document.createElement("img");
image.src = `data:image/png;base64,${labelImage}`;
document.body.appendChild(image);
