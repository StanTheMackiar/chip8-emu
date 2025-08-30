import { cpu, memory } from "../main";

const fileInput = document.querySelector<HTMLInputElement>("#romInput")!;

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const buffer = await file.arrayBuffer();
  const rom = new Uint8Array(buffer);

  // cargar rom en memoria
  memory.loadROM(rom);

  // resetear CPU
  cpu.reset();
});
