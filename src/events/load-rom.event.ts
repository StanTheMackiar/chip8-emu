import { cpu, memory } from "../main";
import {
  $emuStatusText,
  $fileInput,
  $loadBtn,
  $pauseBtn,
  $resetBtn,
  $romName,
  $stopBtn,
} from "./dom-refs";

$loadBtn.addEventListener("click", () => {
  $fileInput.click();
});

$fileInput.addEventListener("change", async () => {
  const file = $fileInput.files?.[0];
  if (!file) return;

  const fileNamesAccepted = [".c8", ".ch8"];

  if (!fileNamesAccepted.some((ext) => file.name.endsWith(ext))) {
    alert("Formato inválido. Solo se permiten archivos .c8 o .ch8");
    $fileInput.value = "";
    return;
  }

  const buffer = await file.arrayBuffer();
  const rom = new Uint8Array(buffer);

  // cargar rom en memoria
  memory.loadROM(rom);

  // iniciar CPU
  cpu.start();

  $resetBtn.hidden = false;
  $pauseBtn.hidden = false;
  $stopBtn.hidden = false;
  $emuStatusText.innerText = cpu.status;
  $romName.innerText = file.name;
});
