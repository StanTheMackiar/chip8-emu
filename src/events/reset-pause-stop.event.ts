import { NO_ROM_LOADED } from "../helpers/const/no-rom-loaded.const";
import { CPUStatusEnum } from "../helpers/enum/cpu-status.enum";
import { cpu } from "../main";
import {
  $controls,
  $emuStatusText,
  $pauseBtn,
  $resetBtn,
  $romName,
  $stopBtn,
} from "./dom-refs";

$stopBtn.addEventListener("click", () => {
  cpu.stop();

  $emuStatusText.innerText = cpu.status;
  $romName.innerText = NO_ROM_LOADED;
  $controls.style.display = "none";
});

$pauseBtn.addEventListener("click", () => {
  const alreadyPaused = cpu.status === CPUStatusEnum.PAUSED;

  if (alreadyPaused) {
    cpu.start();
    $pauseBtn.innerText = "Pause";
  } else {
    cpu.pause();
    $pauseBtn.innerText = "Continue";
  }

  $emuStatusText.innerText = cpu.status;
});

$resetBtn.addEventListener("click", () => {
  cpu.restart();

  $pauseBtn.innerText = "Pause";
  $emuStatusText.innerText = cpu.status;
});
