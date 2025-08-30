import { CPU } from "./emu/cpu";
import { Display } from "./emu/display";
import { KeyPad } from "./emu/keypad";
import { Memory } from "./emu/memory";
import "./events/rom-load.event";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
const ctx = canvas.getContext("2d")!;

export const keypad = new KeyPad();
export const memory = new Memory();
export const display = new Display();
export const cpu = new CPU(memory, display, keypad);

// ----------------- CONFIG -----------------
const CPU_HZ = 500; // ~500 instrucciones/segundo
const TIMER_HZ = 60; // timers a 60 Hz

let lastCycle = performance.now();
let lastTimerUpdate = performance.now();

// ----------------- LOOP -----------------
function loop() {
  if (cpu.halted) {
    console.warn("CPU detenido");
    cpu.reset();
    return;
  }

  const now = performance.now();
  const delta = now - lastCycle;
  lastCycle = now;

  // Ejecutar tantas instrucciones como correspondan según el tiempo pasado
  const instructionsToRun = Math.floor((CPU_HZ * delta) / 1000);
  for (let i = 0; i < instructionsToRun; i++) {
    cpu.step();
    if (cpu.halted) break;
  }

  // Actualizar timers (60Hz = cada ~16.6ms)
  if (now - lastTimerUpdate >= 1000 / TIMER_HZ) {
    cpu.updateTimers();
    lastTimerUpdate = now;
  }

  // Renderizar en canvas
  display.renderToCanvas(ctx);

  requestAnimationFrame(loop);
}

loop();
