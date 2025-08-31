import { NO_ROM_LOADED } from "../helpers/const/no-rom-loaded.const";
import { CPUStatusEnum } from "../helpers/enum/cpu-status.enum";

export const $romName =
  document.querySelector<HTMLHeadingElement>("#rom-name")!;

export const $emuStatusText =
  document.querySelector<HTMLParagraphElement>("#emu-status-text")!;

export const $fileInput =
  document.querySelector<HTMLInputElement>("#romInput")!;

export const $loadBtn = document.querySelector<HTMLButtonElement>("#loadBtn")!;

export const $resetBtn =
  document.querySelector<HTMLButtonElement>("#resetBtn")!;

export const $pauseBtn =
  document.querySelector<HTMLButtonElement>("#pauseBtn")!;

export const $stopBtn = document.querySelector<HTMLButtonElement>("#stopBtn")!;

export const $controls = document.querySelector<HTMLDivElement>("#controls")!;

$romName.innerText = NO_ROM_LOADED;
$emuStatusText.innerText = CPUStatusEnum.STOPPED;
