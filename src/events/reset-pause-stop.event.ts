import { NO_ROM_LOADED } from "../helpers/const/no-rom-loaded.const";
import { cpu } from "../main";
import {
  $emuStatusText,
  $fileInput,
  $pauseBtn,
  $resetBtn,
  $romName,
  $stopBtn,
} from "./dom-refs";

$stopBtn.addEventListener("click", () => {
  cpu.stop();

  // limpiar input de archivo
  $fileInput.value = "";
  $fileInput.files = null;

  $emuStatusText.innerText = cpu.status;
  $romName.innerText = NO_ROM_LOADED;
});

$pauseBtn.addEventListener("click", () => {
  cpu.pause();

  $emuStatusText.innerText = cpu.status;
});

$resetBtn.addEventListener("click", () => {
  cpu.reset();

  $emuStatusText.innerText = cpu.status;
});
