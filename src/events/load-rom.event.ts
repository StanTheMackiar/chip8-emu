import { cpu, memory, rom } from "../main";
import {
  $controls,
  $emuStatusText,
  $fileInput,
  $loadBtn,
  $romName,
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
  const romData = new Uint8Array(buffer);

  rom.set(romData);
  memory.loadROM();

  // reiniciar CPU
  cpu.restart();

  $controls.style.display = "flex";
  $emuStatusText.innerText = cpu.status;
  $romName.innerText = file.name;
  $fileInput.value = "";
  $fileInput.files = null;
});
